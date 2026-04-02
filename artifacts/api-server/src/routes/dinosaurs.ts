import { Router, type IRouter } from "express";
import { eq, ilike } from "drizzle-orm";
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
        .where(ilike(dinosaursTable.name, `%${search.trim()}%`));
    } else {
      dinosaurs = await db.select().from(dinosaursTable);
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

export default router;
