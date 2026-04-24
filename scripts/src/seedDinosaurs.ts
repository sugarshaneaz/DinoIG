import { db, dinosaursTable, type InsertDinosaur } from "@workspace/db";
import { sql } from "drizzle-orm";

const STARTER_DINOSAURS: InsertDinosaur[] = [
  {
    name: "Tyrannosaurus Rex",
    description:
      "The king of the late Cretaceous. Up to 40 feet long, with a bite that could crush bone.",
    period: "Late Cretaceous",
    diet: "Carnivore",
  },
  {
    name: "Triceratops",
    description:
      "Three-horned herbivore with a massive bony frill. Lived alongside T. rex in North America.",
    period: "Late Cretaceous",
    diet: "Herbivore",
  },
  {
    name: "Stegosaurus",
    description:
      "Famous for the double row of kite-shaped plates along its back and the four tail spikes (the 'thagomizer').",
    period: "Late Jurassic",
    diet: "Herbivore",
  },
  {
    name: "Velociraptor",
    description:
      "Small, feathered, and smart. Real ones were about the size of a turkey, not the Jurassic Park version.",
    period: "Late Cretaceous",
    diet: "Carnivore",
  },
  {
    name: "Brachiosaurus",
    description:
      "A long-necked giant that browsed treetops like a 50-foot-tall giraffe.",
    period: "Late Jurassic",
    diet: "Herbivore",
  },
  {
    name: "Spinosaurus",
    description:
      "Likely semi-aquatic, with a huge sail on its back. Possibly the largest carnivorous dinosaur ever.",
    period: "Mid Cretaceous",
    diet: "Carnivore",
  },
  {
    name: "Ankylosaurus",
    description:
      "A living tank: armored plates, spikes, and a club-shaped tail that could break bone.",
    period: "Late Cretaceous",
    diet: "Herbivore",
  },
  {
    name: "Allosaurus",
    description:
      "Top predator of the Late Jurassic. Lighter and faster than T. rex, with serrated teeth.",
    period: "Late Jurassic",
    diet: "Carnivore",
  },
  {
    name: "Diplodocus",
    description:
      "Long, low, and whip-tailed. One of the longest land animals that ever lived.",
    period: "Late Jurassic",
    diet: "Herbivore",
  },
  {
    name: "Parasaurolophus",
    description:
      "Duck-billed hadrosaur with a long hollow crest that likely resonated like a trumpet.",
    period: "Late Cretaceous",
    diet: "Herbivore",
  },
  {
    name: "Pteranodon",
    description:
      "Technically not a dinosaur — a flying reptile with a 23-foot wingspan and a distinctive head crest.",
    period: "Late Cretaceous",
    diet: "Carnivore",
  },
  {
    name: "Iguanodon",
    description:
      "One of the first dinosaurs ever named. Had a big thumb spike for defense (or feeding).",
    period: "Early Cretaceous",
    diet: "Herbivore",
  },
];

async function main() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(dinosaursTable);

  if (count > 0) {
    console.log(
      `dinosaurs table already has ${count} row(s); skipping seed.`,
    );
    console.log("Re-run with --force to insert anyway.");
    if (!process.argv.includes("--force")) {
      return;
    }
  }

  const inserted = await db
    .insert(dinosaursTable)
    .values(STARTER_DINOSAURS)
    .returning({ id: dinosaursTable.id, name: dinosaursTable.name });

  console.log(`Inserted ${inserted.length} dinosaurs:`);
  for (const d of inserted) {
    console.log(`  #${d.id}  ${d.name}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
