import { Router, type IRouter } from "express";
import { eq, ilike, sql } from "drizzle-orm";
import { db, dinosaursTable, insertDinosaurSchema } from "@workspace/db";

const router: IRouter = Router();

router.get("/dinosaurs", async (req, res) => {
  try {
    const search = req.query.search as string | undefined;
    let dinosaurs;
    if (search && search.trim()) {
      dinosaurs = await db
        .select()
        .from(dinosaursTable)
        .where(ilike(dinosaursTable.name, `%${search.trim()}%`))
        .orderBy(dinosaursTable.id);
    } else {
      dinosaurs = await db.select().from(dinosaursTable).orderBy(dinosaursTable.id);
    }
    res.json(dinosaurs);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch dinosaurs");
    res.status(500).json({ error: "Failed to fetch dinosaurs" });
  }
});

router.post("/dinosaurs", async (req, res) => {
  try {
    const parsed = insertDinosaurSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [dinosaur] = await db
      .insert(dinosaursTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(dinosaur);
  } catch (err) {
    req.log.error({ err }, "Failed to create dinosaur");
    res.status(500).json({ error: "Failed to create dinosaur" });
  }
});

router.get("/dinosaurs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [dinosaur] = await db
      .select()
      .from(dinosaursTable)
      .where(eq(dinosaursTable.id, id));
    if (!dinosaur) {
      res.status(404).json({ error: "Dinosaur not found" });
      return;
    }
    res.json(dinosaur);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch dinosaur");
    res.status(500).json({ error: "Failed to fetch dinosaur" });
  }
});

router.put("/dinosaurs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const parsed = insertDinosaurSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [dinosaur] = await db
      .update(dinosaursTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(dinosaursTable.id, id))
      .returning();
    if (!dinosaur) {
      res.status(404).json({ error: "Dinosaur not found" });
      return;
    }
    res.json(dinosaur);
  } catch (err) {
    req.log.error({ err }, "Failed to update dinosaur");
    res.status(500).json({ error: "Failed to update dinosaur" });
  }
});

router.delete("/dinosaurs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [deleted] = await db
      .delete(dinosaursTable)
      .where(eq(dinosaursTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Dinosaur not found" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete dinosaur");
    res.status(500).json({ error: "Failed to delete dinosaur" });
  }
});

router.post("/dinosaurs/:id/like", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [updated] = await db
      .update(dinosaursTable)
      .set({
        likesCount: sql`${dinosaursTable.likesCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(dinosaursTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Dinosaur not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to like dinosaur");
    res.status(500).json({ error: "Failed to like dinosaur" });
  }
});

router.post("/dinosaurs/:id/fetch-image", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const [dinosaur] = await db
      .select()
      .from(dinosaursTable)
      .where(eq(dinosaursTable.id, id));

    if (!dinosaur) {
      res.status(404).json({ error: "Dinosaur not found" });
      return;
    }

    const imageUrl = await searchDinosaurImage(dinosaur.name);

    if (!imageUrl) {
      res.status(404).json({ error: "No image found for this dinosaur" });
      return;
    }

    const [updated] = await db
      .update(dinosaursTable)
      .set({ imageUrl, updatedAt: new Date() })
      .where(eq(dinosaursTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch dinosaur image");
    res.status(500).json({ error: "Failed to fetch dinosaur image" });
  }
});

async function searchDinosaurImage(name: string): Promise<string | null> {
  const encoded = encodeURIComponent(name);
  const url =
    `https://en.wikipedia.org/w/api.php?action=query` +
    `&titles=${encoded}` +
    `&prop=pageimages` +
    `&pithumbsize=600` +
    `&pilicense=any` +
    `&format=json` +
    `&origin=*`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = (await response.json()) as {
    query?: {
      pages?: Record<
        string,
        { thumbnail?: { source?: string }; pageimage?: string }
      >;
    };
  };

  const pages = data?.query?.pages;
  if (!pages) return null;

  for (const page of Object.values(pages)) {
    if (page.thumbnail?.source) {
      return page.thumbnail.source;
    }
  }

  const commonsUrl =
    `https://en.wikipedia.org/w/api.php?action=query` +
    `&list=search` +
    `&srsearch=${encoded}+dinosaur` +
    `&prop=pageimages` +
    `&pithumbsize=600` +
    `&format=json` +
    `&origin=*`;

  const commonsResponse = await fetch(commonsUrl);
  if (!commonsResponse.ok) return null;

  const commonsData = (await commonsResponse.json()) as {
    query?: { search?: Array<{ title?: string }> };
  };

  const results = commonsData?.query?.search;
  if (!results || results.length === 0) return null;

  const firstTitle = results[0]?.title;
  if (!firstTitle) return null;

  const detailUrl =
    `https://en.wikipedia.org/w/api.php?action=query` +
    `&titles=${encodeURIComponent(firstTitle)}` +
    `&prop=pageimages` +
    `&pithumbsize=600` +
    `&pilicense=any` +
    `&format=json` +
    `&origin=*`;

  const detailResponse = await fetch(detailUrl);
  if (!detailResponse.ok) return null;

  const detailData = (await detailResponse.json()) as {
    query?: {
      pages?: Record<string, { thumbnail?: { source?: string } }>;
    };
  };

  const detailPages = detailData?.query?.pages;
  if (!detailPages) return null;

  for (const page of Object.values(detailPages)) {
    if (page.thumbnail?.source) {
      return page.thumbnail.source;
    }
  }

  return null;
}

export default router;
