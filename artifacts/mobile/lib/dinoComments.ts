export interface DinoReply {
  username: string;
  avatar: string;
  text: string;
}

export interface DinoComment {
  username: string;
  avatar: string;
  text: string;
  replies?: DinoReply[];
}

const COMMENT_POOL: DinoComment[] = [
  {
    username: "t_rex_official", avatar: "🦖",
    text: "Love the vibes! Tried to clap but... you know. 🤏",
    replies: [
      { username: "velociraptor", avatar: "🦕", text: "we KNOW about the arms, you bring this up every single post" },
      { username: "t_rex_official", avatar: "🦖", text: "it's called trauma, look it up" },
    ],
  },
  {
    username: "velociraptor", avatar: "🦕",
    text: "I could outrun this one. I outrun EVERYTHING. It's actually exhausting.",
    replies: [
      { username: "gallimimus", avatar: "🐓", text: "bold claim from someone who's 2 feet tall" },
      { username: "velociraptor", avatar: "🦕", text: "2 feet of PURE SPEED. good day." },
    ],
  },
  {
    username: "triceratops", avatar: "🦏",
    text: "Three horns > zero horns. Just saying. 📐",
    replies: [
      { username: "carnotaurus", avatar: "🤠", text: "excuse me I also have horns" },
      { username: "triceratops", avatar: "🦏", text: "brow ridges don't count, we've been over this" },
    ],
  },
  {
    username: "brachiosaurus", avatar: "🦒",
    text: "Views from up here are incredible. You should try being 40 feet tall sometime.",
    replies: [
      { username: "compsognathus", avatar: "🐦", text: "some of us have other qualities 😤" },
      { username: "brachiosaurus", avatar: "🦒", text: "I didn't say anything, I simply stated facts" },
    ],
  },
  {
    username: "stegosaurus", avatar: "🌵",
    text: "My plates aren't just for decoration — they also help regulate my temperature. Scientists took 100 years to figure that out lol",
    replies: [
      { username: "kentrosaurus", avatar: "🌵", text: "cousin!! missed you at the reunion" },
      { username: "stegosaurus", avatar: "🌵", text: "I was there. you walked right past me." },
      { username: "kentrosaurus", avatar: "🌵", text: "...sorry" },
    ],
  },
  {
    username: "ankylosaurus", avatar: "🛡️",
    text: "Nature gave me a tank body AND a club tail. I did NOT come to play.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "I respect the build. truly." },
      { username: "ankylosaurus", avatar: "🛡️", text: "first smart thing you've said all week" },
    ],
  },
  {
    username: "pterodactyl", avatar: "🦅",
    text: "Technically not a dinosaur but nobody ever lets me forget that at parties 😭",
    replies: [
      { username: "archaeopteryx", avatar: "🪶", text: "same energy. 'ohhh are you a bird or a dinosaur' STOP ASKING" },
      { username: "pterodactyl", avatar: "🦅", text: "WE FOUND EACH OTHER 😭😭" },
    ],
  },
  {
    username: "spinosaurus", avatar: "🐊",
    text: "I was bigger than T-Rex and I could SWIM. Where's MY movie franchise??",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "you were in Jurassic Park 3 and you know what happened there" },
      { username: "spinosaurus", avatar: "🐊", text: "I WON THAT FIGHT and nobody talks about it" },
      { username: "t_rex_official", avatar: "🦖", text: "blocking you" },
    ],
  },
  {
    username: "diplodocus", avatar: "🐍",
    text: "Fun fact: my tail could crack like a whip and create a sonic boom. I was literally loud before it was cool.",
    replies: [
      { username: "parasaurolophus", avatar: "🎺", text: "I made sonic booms with my FACE. sit down." },
    ],
  },
  {
    username: "allosaurus", avatar: "🔥",
    text: "T-Rex gets all the attention but I was here 80 MILLION YEARS EARLIER. Respect the OG.",
    replies: [
      { username: "herrerasaurus", avatar: "⏳", text: "80 million years earlier? I was here 230 million years ago. you were basically yesterday." },
      { username: "allosaurus", avatar: "🔥", text: "ok we're not doing this right now" },
    ],
  },
  {
    username: "iguanodon", avatar: "👍",
    text: "I had a thumb spike that scientists originally thought was my nose horn. It happens to the best of us.",
    replies: [
      { username: "oviraptor", avatar: "😤", text: "THEY NAMED ME 'EGG THIEF' and they just said 'oops.' I feel your pain." },
      { username: "iguanodon", avatar: "👍", text: "science really just does not apologize" },
    ],
  },
  {
    username: "parasaurolophus", avatar: "🎺",
    text: "My crest was basically a built-in trombone. I was making music before music was invented.",
    replies: [
      { username: "corythosaurus", avatar: "🎭", text: "my crest was a foghorn. we were basically a whole band." },
      { username: "parasaurolophus", avatar: "🎺", text: "you can be percussion" },
    ],
  },
  {
    username: "pachycephalosaurus", avatar: "⚽",
    text: "My skull was 10 inches thick. I headbutted rivals at full speed. I was the original soccer ball.",
    replies: [
      { username: "ankylosaurus", avatar: "🛡️", text: "don't headbutt me. I'm warning you." },
      { username: "pachycephalosaurus", avatar: "⚽", text: "I wasn't going to... but now I'm thinking about it" },
    ],
  },
  {
    username: "carnotaurus", avatar: "🤠",
    text: "Horn guy. That's it. That's the whole bio.",
    replies: [
      { username: "triceratops", avatar: "🦏", text: "two horns. I have THREE. log off." },
    ],
  },
  {
    username: "therizinosaurus", avatar: "✂️",
    text: "I have the longest claws of any known animal ever and I only ate plants. Make it make sense.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "you have the claws AND the reach. I don't want to talk about it." },
      { username: "therizinosaurus", avatar: "✂️", text: "I just wanted to rake leaves. I was GARDENING." },
    ],
  },
  {
    username: "deinonychus", avatar: "⚡",
    text: "Velociraptor gets the fame but I was the inspiration for the Jurassic Park raptors. I want royalties.",
    replies: [
      { username: "velociraptor", avatar: "🦕", text: "they used MY name. that's gotta count for something." },
      { username: "deinonychus", avatar: "⚡", text: "your name and my body. we both got robbed." },
      { username: "velociraptor", avatar: "🦕", text: "...class action lawsuit?" },
    ],
  },
  {
    username: "maiasaura", avatar: "🥚",
    text: "First dinosaur proven to have raised its young. Mother of the year, every year, for 75 million years.",
    replies: [
      { username: "oviraptor", avatar: "😤", text: "I raised my eggs too! but they called me an egg THIEF. Justice for oviraptor." },
      { username: "maiasaura", avatar: "🥚", text: "I've been saying this for years. you were FRAMED." },
    ],
  },
  {
    username: "protoceratops", avatar: "🐏",
    text: "My fossils were probably the inspiration for Griffin legends in ancient Greece. You're welcome, mythology.",
    replies: [
      { username: "dracorex", avatar: "🐲", text: "I inspired dragon legends AND have 'Hogwarts' in my name. respectfully, I win." },
      { username: "protoceratops", avatar: "🐏", text: "you were discovered in 2006. I've been legendary since antiquity." },
    ],
  },
  {
    username: "baryonyx", avatar: "🎣",
    text: "I ate fish. I had fish bones IN my stomach as a fossil. I was literally a dinosaur fisherman. Legendary.",
    replies: [
      { username: "spinosaurus", avatar: "🐊", text: "fellow fish guy 🤝" },
      { username: "baryonyx", avatar: "🎣", text: "the only two chill ones out here honestly" },
    ],
  },
  {
    username: "gallimimus", avatar: "🐓",
    text: "Fastest dinosaur. No arms debate needed. Just pure speed energy.",
    replies: [
      { username: "velociraptor", avatar: "🦕", text: "EXCUSE me, I am also very fast" },
      { username: "gallimimus", avatar: "🐓", text: "you are welcome to try and catch me to discuss this further" },
    ],
  },
  {
    username: "giganotosaurus", avatar: "📏",
    text: "South America's apex predator, bigger than T-Rex, yet somehow always described as 'like T-Rex but bigger.' Tired.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "you're welcome for the brand recognition" },
      { username: "giganotosaurus", avatar: "📏", text: "I am going to walk into the ocean" },
    ],
  },
  {
    username: "coelophysis", avatar: "👻",
    text: "Mass fossil graveyard found with thousands of us together. We were either very social or very unlucky.",
    replies: [
      { username: "maiasaura", avatar: "🥚", text: "that is the most haunted sentence I've ever read" },
    ],
  },
  {
    username: "dilophosaurus", avatar: "💦",
    text: "Jurassic Park gave me a neck frill and venom. I have NEITHER of those things. Call my lawyer.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "at least they made you look cool" },
      { username: "dilophosaurus", avatar: "💦", text: "they made me spit on a man's face. that is not cool that is embarrassing." },
    ],
  },
  {
    username: "megalosaurus", avatar: "📚",
    text: "I was the FIRST dinosaur ever scientifically described, in 1824. And I've been humble about it ever since.",
    replies: [
      { username: "iguanodon", avatar: "👍", text: "described second here. we should start a club." },
      { username: "megalosaurus", avatar: "📚", text: "the Founding Fossils. I'll have shirts made." },
    ],
  },
  {
    username: "euoplocephalus", avatar: "🧱",
    text: "Even my eyelids were armored. I took personal security very seriously.",
    replies: [
      { username: "ankylosaurus", avatar: "🛡️", text: "cousin! armored gang 💪" },
      { username: "euoplocephalus", avatar: "🧱", text: "I even sleep with one eye open. well. armored." },
    ],
  },
  {
    username: "dracorex", avatar: "🐲",
    text: "My name literally means 'Dragon King of Hogwarts.' J.K. Rowling has never acknowledged me. Rude.",
    replies: [
      { username: "protoceratops", avatar: "🐏", text: "she's missing out. you're literally canon." },
      { username: "dracorex", avatar: "🐲", text: "I have sent three owls. No reply." },
    ],
  },
  {
    username: "yutyrannus", avatar: "🧥",
    text: "A T-Rex cousin covered in FEATHERS. We were the fluffy era of tyrannosaurs and nobody talks about it.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "we do NOT claim this era" },
      { username: "yutyrannus", avatar: "🧥", text: "you were probably fluffy too as a baby and you KNOW it" },
      { username: "t_rex_official", avatar: "🦖", text: "this conversation is over" },
    ],
  },
  {
    username: "microraptor", avatar: "🛸",
    text: "I had FOUR wings and could glide between trees. I was doing aerodynamics before the Wright Brothers were even born.",
    replies: [
      { username: "archaeopteryx", avatar: "🪶", text: "two wings and I also flew. solidarity ✊" },
      { username: "pterodactyl", avatar: "🦅", text: "could I join this group" },
      { username: "microraptor", avatar: "🛸", text: "yes but only if you stop telling people you're not a dinosaur" },
    ],
  },
  {
    username: "irritator", avatar: "😒",
    text: "Scientists were so annoyed by the fake modifications on my fossil that they literally named me Irritator. Rude but fair.",
    replies: [
      { username: "oviraptor", avatar: "😤", text: "at least your name isn't a false accusation" },
      { username: "irritator", avatar: "😒", text: "fair point. we should form a support group." },
    ],
  },
  {
    username: "nigersaurus", avatar: "🌿",
    text: "I had 500 teeth arranged like a conveyor belt. Nature said 'this one loves salad.' And they were right.",
    replies: [
      { username: "therizinosaurus", avatar: "✂️", text: "fellow plant fan 🌿 they never expect us to be dangerous" },
      { username: "nigersaurus", avatar: "🌿", text: "I'm not dangerous I just have 500 teeth. completely different." },
    ],
  },
  {
    username: "saurophaganax", avatar: "👑",
    text: "My name means 'king of the lizard eaters.' I didn't choose that name. But I chose to live up to it.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "there can only be one king and it's me" },
      { username: "saurophaganax", avatar: "👑", text: "you weren't even born yet when I was ruling. historically speaking." },
    ],
  },
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
