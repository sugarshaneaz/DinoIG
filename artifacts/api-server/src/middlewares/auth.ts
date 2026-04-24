import type { RequestHandler } from "express";

const API_KEY = process.env.API_KEY;
const isProd = process.env.NODE_ENV === "production";

if (isProd && !API_KEY) {
  throw new Error(
    "API_KEY must be set in production to protect mutation routes",
  );
}

export const requireApiKey: RequestHandler = (req, res, next) => {
  if (!API_KEY) {
    return next();
  }

  const provided = req.header("x-api-key");
  if (provided && provided === API_KEY) {
    return next();
  }

  res.status(401).json({ error: "Unauthorized" });
};
