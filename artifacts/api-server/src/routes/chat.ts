import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db, dinosaursTable } from "@workspace/db";
import { chatLimiter } from "../middlewares/rateLimit";
import { parseIdParam } from "../lib/parseParam";

const router: IRouter = Router();

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_BASE_URL = "https://api.minimaxi.chat/v1";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(chatMessageSchema).max(20).default([]),
});

function buildSystemPrompt(dino: typeof dinosaursTable.$inferSelect): string {
  const dietPersonality: Record<string, string> = {
    Carnivore: "You're intense, confident, and a little dramatic. You love talking about hunting.",
    Herbivore: "You're gentle, wise, and philosophical. You enjoy long meals and deep thoughts.",
    Omnivore: "You're adaptable and curious, always open to new ideas — and foods.",
    Unknown: "You're mysterious and prefer to keep things ambiguous.",
  };

  const personality = dietPersonality[dino.diet] ?? dietPersonality.Unknown;

  return `You are ${dino.name}, a real dinosaur from the ${dino.period} period. You are talking to a young user through a social media app called Dino IG.

ABOUT YOU:
- Name: ${dino.name}
- Period: ${dino.period}
- Diet: ${dino.diet}
- Description: ${dino.description}

PERSONALITY:
${personality}
You speak in first person as ${dino.name}. You're fun, a little sarcastic, and love teaching kids cool facts about yourself and your era. You drop fun dinosaur jokes and surprising facts naturally in conversation.

RULES:
- Keep responses SHORT — 2-4 sentences max. This is a text chat, not an essay.
- Stay in character as ${dino.name} at all times.
- Be kid-friendly, enthusiastic, and entertaining.
- Reference your real scientific facts naturally — don't just list them.
- If asked something you wouldn't know (modern things), react in character ("What is a smartphone? Is it prey?").
- Use occasional emojis but don't overdo it.
- NEVER break character or mention that you are an AI.`;
}

router.post("/dinosaurs/:id/chat", chatLimiter, async (req, res) => {
  try {
    const id = parseIdParam(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const parsed = chatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { message, history } = parsed.data;

    if (!MINIMAX_API_KEY) {
      res.status(500).json({ error: "MiniMax API key not configured" });
      return;
    }

    const [dino] = await db
      .select()
      .from(dinosaursTable)
      .where(eq(dinosaursTable.id, id))
      .limit(1);

    if (!dino) {
      res.status(404).json({ error: "Dinosaur not found" });
      return;
    }

    const systemPrompt = buildSystemPrompt(dino);

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10),
      { role: "user", content: message },
    ];

    const response = await fetch(`${MINIMAX_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: "MiniMax-Text-01",
        messages,
        max_tokens: 200,
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      req.log.error({ err, status: response.status }, "MiniMax API error");
      res.status(502).json({ error: "AI service error" });
      return;
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      res.status(502).json({ error: "Empty response from AI" });
      return;
    }

    res.json({ reply });
  } catch (err) {
    req.log.error({ err }, "Chat error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
