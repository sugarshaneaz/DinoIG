import express, { type Express } from "express";
import cors, { type CorsOptions } from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";
import { globalLimiter } from "./middlewares/rateLimit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProd = process.env.NODE_ENV === "production";
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, native mobile apps, same-origin)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes("*")) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    // In development, allow everything when no allowlist is configured
    if (!isProd && allowedOrigins.length === 0) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
};

const app: Express = express();

// Respect X-Forwarded-* headers when behind a proxy (Replit, Cloudflare, etc.)
// so req.ip and rate-limit keying work correctly.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors(corsOptions));
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

app.use(
  "/api/images",
  express.static(path.join(__dirname, "../public/images")),
);

app.use("/api", globalLimiter, router);

export default app;
