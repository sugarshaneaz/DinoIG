export interface DinoComment {
  username: string;
  avatar: string;
  text: string;
}

const COMMENT_POOL: DinoComment[] = [
  { username: "t_rex_official", avatar: "🦖", text: "Love the vibes! Tried to clap but... you know. 🤏" },
  { username: "velociraptor", avatar: "🦕", text: "I could outrun this one. I outrun EVERYTHING. It's actually exhausting." },
  { username: "triceratops", avatar: "🦏", text: "Three horns > zero horns. Just saying. 📐" },
  { username: "brachiosaurus", avatar: "🦒", text: "Views from up here are incredible. You should try being 40 feet tall sometime." },
  { username: "stegosaurus", avatar: "🌵", text: "My plates aren't just for decoration — they also help regulate my temperature. Scientists took 100 years to figure that out lol" },
  { username: "ankylosaurus", avatar: "🛡️", text: "Nature gave me a tank body AND a club tail. I did NOT come to play." },
  { username: "pterodactyl", avatar: "🦅", text: "Technically not a dinosaur but nobody ever lets me forget that at parties 😭" },
  { username: "spinosaurus", avatar: "🐊", text: "I was bigger than T-Rex and I could SWIM. Where's MY movie franchise??" },
  { username: "diplodocus", avatar: "🐍", text: "Fun fact: my tail could crack like a whip and create a sonic boom. I was literally loud before it was cool." },
  { username: "allosaurus", avatar: "🔥", text: "T-Rex gets all the attention but I was here 80 MILLION YEARS EARLIER. Respect the OG." },
  { username: "iguanodon", avatar: "👍", text: "I had a thumb spike that scientists originally thought was my nose horn. It happens to the best of us." },
  { username: "parasaurolophus", avatar: "🎺", text: "My crest was basically a built-in trombone. I was making music before music was invented." },
  { username: "pachycephalosaurus", avatar: "⚽", text: "My skull was 10 inches thick. I headbutted rivals at full speed. I was the original soccer ball." },
  { username: "carnotaurus", avatar: "🤠", text: "Horn guy. That's it. That's the whole bio." },
  { username: "therizinosaurus", avatar: "✂️", text: "I have the longest claws of any known animal ever and I only ate plants. Make it make sense." },
  { username: "compsognathus", avatar: "🐦", text: "Small but make it fierce 💅 One of the earliest known dinosaurs btw no big deal" },
  { username: "deinonychus", avatar: "⚡", text: "Velociraptor gets the fame but I was the inspiration for the Jurassic Park raptors. I want royalties." },
  { username: "archaeopteryx", avatar: "🪶", text: "Half dinosaur, half bird. All icon. I literally bridged the gap between two eras." },
  { username: "maiasaura", avatar: "🥚", text: "First dinosaur proven to have raised its young. Mother of the year, every year, for 75 million years." },
  { username: "oviraptor", avatar: "😤", text: "They named me 'egg thief' based on a MISUNDERSTANDING and never apologized. I was protecting my OWN eggs!!" },
  { username: "protoceratops", avatar: "🐏", text: "My fossils were probably the inspiration for Griffin legends in ancient Greece. You're welcome, mythology." },
  { username: "baryonyx", avatar: "🎣", text: "I ate fish. I had fish bones IN my stomach as a fossil. I was literally a dinosaur fisherman. Legendary." },
  { username: "gallimimus", avatar: "🐓", text: "Fastest dinosaur. No arms debate needed. Just pure speed energy." },
  { username: "carcharodontosaurus", avatar: "🦈", text: "My name means 'shark-toothed lizard' and yes, I lived up to it every single day." },
  { username: "giganotosaurus", avatar: "📏", text: "South America's apex predator, bigger than T-Rex, yet somehow always described as 'like T-Rex but bigger.' Tired." },
  { username: "argentinosaurus", avatar: "🏔️", text: "Possibly the largest animal to ever walk the Earth. I leave footprints the size of bathtubs. Literally." },
  { username: "kentrosaurus", avatar: "🌵", text: "Stegosaurus' cousin. We don't talk much. Creative differences." },
  { username: "amargasaurus", avatar: "🎸", text: "Two rows of tall spines on my neck. Scientists still argue about what they were for. I think they look cool." },
  { username: "ceratosaurus", avatar: "🦏", text: "Had a nose horn AND brow ridges AND was blood red according to some scientists. I was overdressed and I knew it." },
  { username: "herrerasaurus", avatar: "⏳", text: "One of the very first dinosaurs ever. 230 million years ago. I started this whole thing." },
  { username: "coelophysis", avatar: "👻", text: "Mass fossil graveyard found with thousands of us together. We were either very social or very unlucky." },
  { username: "dilophosaurus", avatar: "💦", text: "Jurassic Park gave me a neck frill and venom. I have NEITHER of those things. Call my lawyer." },
  { username: "megalosaurus", avatar: "📚", text: "I was the FIRST dinosaur ever scientifically described, in 1824. And I've been humble about it ever since." },
  { username: "euoplocephalus", avatar: "🧱", text: "Even my eyelids were armored. I took personal security very seriously." },
  { username: "corythosaurus", avatar: "🎭", text: "My hollow crest might have made me sound like a foghorn. So yes, I was the loudest at every reunion." },
  { username: "dracorex", avatar: "🐲", text: "My name literally means 'Dragon King of Hogwarts.' J.K. Rowling has never acknowledged me. Rude." },
  { username: "pegomastax", avatar: "🦷", text: "I was tiny — like porcupine-sized — with fangs. I'm the dinosaur that says 'don't let my size fool you.'" },
  { username: "yutyrannus", avatar: "🧥", text: "A T-Rex cousin covered in FEATHERS. We were the fluffy era of tyrannosaurs and nobody talks about it." },
  { username: "nigersaurus", avatar: "🌿", text: "I had 500 teeth. Not all at once, but throughout my lifetime I grew them in rows like a conveyor belt." },
  { username: "microraptor", avatar: "🛸", text: "I had FOUR wings and could glide between trees. I was doing aerodynamics before the Wright Brothers were even born." },
  { username: "leedsichthys", avatar: "🐟", text: "Technically a fish not a dinosaur but I was 50 feet long and I deserve to be in this conversation." },
  { username: "shantungosaurus", avatar: "📐", text: "Largest duck-billed dinosaur ever. 50 feet. 16 tons. My beak was still called 'duck.' Disrespectful." },
  { username: "irritator", avatar: "😒", text: "Scientists were so annoyed by the fake modifications on my fossil that they literally named me Irritator. Rude but fair." },
  { username: "wuerhosaurus", avatar: "🌏", text: "One of the last known stegosaurs. I held it down for the plates crew until the end." },
  { username: "saurophaganax", avatar: "👑", text: "My name means 'king of the lizard eaters.' I didn't choose that name. But I chose to live up to it." },
];

function seededIndex(seed: number, max: number, offset: number): number {
  return Math.abs((seed * 2654435761 + offset * 40503) >>> 0) % max;
}

export function getCommentsForDino(dinoId: number, count = 3): DinoComment[] {
  const results: DinoComment[] = [];
  const used = new Set<number>();
  for (let i = 0; i < count + 10 && results.length < count; i++) {
    const idx = seededIndex(dinoId, COMMENT_POOL.length, i);
    if (!used.has(idx)) {
      used.add(idx);
      results.push(COMMENT_POOL[idx]);
    }
  }
  return results;
}
