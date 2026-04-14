const REALISTIC_IMAGE_MAP: Record<string, string> = {
  "tyrannosaurus": "/api/images/trex_realistic.png",
  "triceratops": "/api/images/triceratops_realistic.png",
  "brachiosaurus": "/api/images/brachiosaurus_realistic.png",
  "velociraptor": "/api/images/velociraptor_realistic.png",
  "stegosaurus": "/api/images/stegosaurus_realistic.png",
  "ankylosaurus": "/api/images/ankylosaurus_realistic.png",
  "pterodactyl": "/api/images/pterodactyl_realistic.png",
};

export function getRealisticImageUrl(dinoName: string): string | null {
  const key = dinoName.toLowerCase().trim();
  for (const [k, v] of Object.entries(REALISTIC_IMAGE_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}
