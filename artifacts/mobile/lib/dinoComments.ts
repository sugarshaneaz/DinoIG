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
  // ── T-Rex threads ───────────────────────────────────────────────────────
  {
    username: "t_rex_official", avatar: "🦖",
    text: "Love the vibes! Tried to clap but... you know. 🤏",
    replies: [
      { username: "velociraptor", avatar: "🦕", text: "we KNOW about the arms, you bring this up every single post" },
      { username: "spinosaurus", avatar: "🐊", text: "I have mentioned this before and I will mention it again" },
      { username: "t_rex_official", avatar: "🦖", text: "it's called trauma, look it up" },
      { username: "ankylosaurus", avatar: "🛡️", text: "I'm not laughing. (I'm laughing.)" },
    ],
  },
  {
    username: "t_rex_official", avatar: "🦖",
    text: "Just a reminder that I was the apex predator for TWO MILLION YEARS. Two. Million.",
    replies: [
      { username: "giganotosaurus", avatar: "📏", text: "I was bigger than you just so you know" },
      { username: "spinosaurus", avatar: "🐊", text: "I beat you in Jurassic Park 3" },
      { username: "t_rex_official", avatar: "🦖", text: "JP3 was NOT CANON and we have discussed this" },
      { username: "allosaurus", avatar: "🔥", text: "I was apex predator 80 million years before you, by the way" },
      { username: "t_rex_official", avatar: "🦖", text: "blocking all three of you" },
    ],
  },
  {
    username: "t_rex_official", avatar: "🦖",
    text: "Good morning to everyone except Spinosaurus",
    replies: [
      { username: "spinosaurus", avatar: "🐊", text: "good morning 😊" },
      { username: "t_rex_official", avatar: "🦖", text: "I said what I said" },
      { username: "baryonyx", avatar: "🎣", text: "fellow fish bro don't let him get to you" },
      { username: "spinosaurus", avatar: "🐊", text: "we move. 🙏" },
    ],
  },

  // ── Velociraptor threads ─────────────────────────────────────────────────
  {
    username: "velociraptor", avatar: "🦕",
    text: "I could outrun this one. I outrun EVERYTHING. It's actually exhausting.",
    replies: [
      { username: "gallimimus", avatar: "🐓", text: "bold claim from someone who's 2 feet tall" },
      { username: "velociraptor", avatar: "🦕", text: "2 feet of PURE SPEED. good day." },
      { username: "deinonychus", avatar: "⚡", text: "you're also not even the fast one. that's me. I just don't brag." },
      { username: "velociraptor", avatar: "🦕", text: "you ABSOLUTELY brag" },
    ],
  },
  {
    username: "velociraptor", avatar: "🦕",
    text: "Jurassic Park made me 6 feet tall. I'm actually turkey-sized. It's a whole thing.",
    replies: [
      { username: "deinonychus", avatar: "⚡", text: "they used my body and your name. we both got cheated." },
      { username: "microraptor", avatar: "🛸", text: "I'm even smaller than you and I had FOUR wings. I'm fine." },
      { username: "velociraptor", avatar: "🦕", text: "HOW are you fine with this" },
      { username: "microraptor", avatar: "🛸", text: "I have four wings. I won." },
    ],
  },

  // ── Triceratops threads ──────────────────────────────────────────────────
  {
    username: "triceratops", avatar: "🦏",
    text: "Three horns > zero horns. Just saying. 📐",
    replies: [
      { username: "carnotaurus", avatar: "🤠", text: "excuse me I also have horns" },
      { username: "triceratops", avatar: "🦏", text: "brow ridges don't count, we've been over this" },
      { username: "styracosaurus", avatar: "🎆", text: "I have like 6 horns just so everyone knows" },
      { username: "triceratops", avatar: "🦏", text: "okay you win I'm not ready to have this conversation" },
    ],
  },
  {
    username: "triceratops", avatar: "🦏",
    text: "Scientists argued for 20 years about whether I was a juvenile Torosaurus. I am NOT a juvenile Torosaurus.",
    replies: [
      { username: "torosaurus", avatar: "🔭", text: "I also do not want to be you. no offence." },
      { username: "triceratops", avatar: "🦏", text: "none taken we are SEPARATE ANIMALS" },
      { username: "t_rex_official", avatar: "🦖", text: "they called me a Nanotyrannus for a while. we all suffer." },
      { username: "triceratops", avatar: "🦏", text: "...okay fine, solidarity I guess" },
    ],
  },

  // ── Brachiosaurus threads ────────────────────────────────────────────────
  {
    username: "brachiosaurus", avatar: "🦒",
    text: "Views from up here are incredible. You should try being 40 feet tall sometime.",
    replies: [
      { username: "compsognathus", avatar: "🐦", text: "some of us have other qualities 😤" },
      { username: "brachiosaurus", avatar: "🦒", text: "I didn't say anything, I simply stated facts" },
      { username: "diplodocus", avatar: "🐍", text: "my neck is longer than yours by the way" },
      { username: "brachiosaurus", avatar: "🦒", text: "mine goes UP. yours goes OUT. completely different flex." },
      { username: "diplodocus", avatar: "🐍", text: "...actually fair" },
    ],
  },
  {
    username: "brachiosaurus", avatar: "🦒",
    text: "I weighed as much as 12 elephants. Just a fun fact I think about every day.",
    replies: [
      { username: "argentinosaurus", avatar: "🏔️", text: "I weighed as much as 70-80 tons. sit." },
      { username: "brachiosaurus", avatar: "🦒", text: "okay but no one talks about you" },
      { username: "argentinosaurus", avatar: "🏔️", text: "because I am TOO BIG to look down at haters" },
    ],
  },

  // ── Stegosaurus threads ──────────────────────────────────────────────────
  {
    username: "stegosaurus", avatar: "🌵",
    text: "My plates aren't just for decoration — they also help regulate my temperature. Scientists took 100 years to figure that out lol",
    replies: [
      { username: "kentrosaurus", avatar: "🌵", text: "cousin!! missed you at the reunion" },
      { username: "stegosaurus", avatar: "🌵", text: "I was there. you walked right past me." },
      { username: "kentrosaurus", avatar: "🌵", text: "...sorry" },
      { username: "tuojiangosaurus", avatar: "🌿", text: "I was also there. I also have plates. nobody said hi to me either." },
      { username: "stegosaurus", avatar: "🌵", text: "next reunion I'm wearing a name tag" },
    ],
  },

  // ── Ankylosaurus threads ─────────────────────────────────────────────────
  {
    username: "ankylosaurus", avatar: "🛡️",
    text: "Nature gave me a tank body AND a club tail. I did NOT come to play.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "I respect the build. truly." },
      { username: "ankylosaurus", avatar: "🛡️", text: "first smart thing you've said all week" },
      { username: "euoplocephalus", avatar: "🧱", text: "armored cousin solidarity 💪" },
      { username: "saichania", avatar: "⛏️", text: "my tail club could shatter bones. just wanted to add that." },
      { username: "ankylosaurus", avatar: "🛡️", text: "that's the content I come here for" },
    ],
  },
  {
    username: "ankylosaurus", avatar: "🛡️",
    text: "Someone tried to flip me over once. They regretted it.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "it wasn't me" },
      { username: "ankylosaurus", avatar: "🛡️", text: "it was absolutely you" },
      { username: "t_rex_official", avatar: "🦖", text: "I have no memory of this event" },
      { username: "velociraptor", avatar: "🦕", text: "I saw it. it was him." },
    ],
  },

  // ── Pterodactyl threads ──────────────────────────────────────────────────
  {
    username: "pterodactyl", avatar: "🦅",
    text: "Technically not a dinosaur but nobody ever lets me forget that at parties 😭",
    replies: [
      { username: "archaeopteryx", avatar: "🪶", text: "same energy. 'ohhh are you a bird or a dinosaur' STOP ASKING" },
      { username: "pterodactyl", avatar: "🦅", text: "WE FOUND EACH OTHER 😭😭" },
      { username: "mosasaurus", avatar: "🌊", text: "not a dinosaur either, also not invited to anything. it's fine." },
      { username: "pterodactyl", avatar: "🦅", text: "we should start a group chat" },
      { username: "plesiosaur", avatar: "🫧", text: "can I join I'm also not a dinosaur" },
      { username: "mosasaurus", avatar: "🌊", text: "the more the merrier honestly" },
    ],
  },
  {
    username: "pterodactyl", avatar: "🦅",
    text: "My wingspan was up to 35 feet. I was literally the size of a small plane. Show some respect.",
    replies: [
      { username: "quetzalcoatlus", avatar: "✈️", text: "my wingspan was 40 feet. I also could walk on all fours. I was a plane AND a car." },
      { username: "pterodactyl", avatar: "🦅", text: "...I didn't know you were here" },
      { username: "quetzalcoatlus", avatar: "✈️", text: "I'm always here. I'm very large." },
    ],
  },

  // ── Spinosaurus threads ──────────────────────────────────────────────────
  {
    username: "spinosaurus", avatar: "🐊",
    text: "I was bigger than T-Rex and I could SWIM. Where's MY movie franchise??",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "you were in Jurassic Park 3 and you know what happened there" },
      { username: "spinosaurus", avatar: "🐊", text: "I WON THAT FIGHT and nobody talks about it" },
      { username: "baryonyx", avatar: "🎣", text: "fellow fish eater solidarity 🤝" },
      { username: "t_rex_official", avatar: "🦖", text: "blocking you" },
      { username: "spinosaurus", avatar: "🐊", text: "I have a sail on my back. I'm the coolest one here. Factually." },
    ],
  },

  // ── Diplodocus threads ───────────────────────────────────────────────────
  {
    username: "diplodocus", avatar: "🐍",
    text: "Fun fact: my tail could crack like a whip and create a sonic boom. I was literally loud before it was cool.",
    replies: [
      { username: "parasaurolophus", avatar: "🎺", text: "I made sonic booms with my FACE. sit down." },
      { username: "brachiosaurus", avatar: "🦒", text: "the long neck cousins are all very loud apparently" },
      { username: "apatosaurus", avatar: "💥", text: "I also had a whip tail. they literally used to think I was Brontosaurus. rough year." },
      { username: "diplodocus", avatar: "🐍", text: "we should start a band honestly" },
    ],
  },

  // ── Allosaurus threads ───────────────────────────────────────────────────
  {
    username: "allosaurus", avatar: "🔥",
    text: "T-Rex gets all the attention but I was here 80 MILLION YEARS EARLIER. Respect the OG.",
    replies: [
      { username: "herrerasaurus", avatar: "⏳", text: "80 million years earlier? I was here 230 million years ago. you were basically yesterday." },
      { username: "allosaurus", avatar: "🔥", text: "ok we're not doing this right now" },
      { username: "eoraptor", avatar: "🌅", text: "231 million years for me actually" },
      { username: "allosaurus", avatar: "🔥", text: "I SAID WE'RE NOT DOING THIS" },
      { username: "herrerasaurus", avatar: "⏳", text: "we're absolutely doing this" },
    ],
  },

  // ── Iguanodon threads ────────────────────────────────────────────────────
  {
    username: "iguanodon", avatar: "👍",
    text: "I had a thumb spike that scientists originally thought was my nose horn. It happens to the best of us.",
    replies: [
      { username: "oviraptor", avatar: "😤", text: "THEY NAMED ME 'EGG THIEF' and they just said 'oops.' I feel your pain." },
      { username: "iguanodon", avatar: "👍", text: "science really just does not apologize" },
      { username: "brontosaurus", avatar: "💫", text: "they said I didn't exist for 100 years. and then I did exist. and nobody apologized." },
      { username: "oviraptor", avatar: "😤", text: "welcome to the wrongly accused club" },
      { username: "brontosaurus", avatar: "💫", text: "I would like a trophy or something" },
    ],
  },

  // ── Parasaurolophus threads ──────────────────────────────────────────────
  {
    username: "parasaurolophus", avatar: "🎺",
    text: "My crest was basically a built-in trombone. I was making music before music was invented.",
    replies: [
      { username: "corythosaurus", avatar: "🎭", text: "my crest was a foghorn. we were basically a whole band." },
      { username: "parasaurolophus", avatar: "🎺", text: "you can be percussion" },
      { username: "lambeosaurus", avatar: "🎸", text: "my crest looked like a hatchet. I'll play the drums." },
      { username: "tsintaosaurus", avatar: "🦄", text: "my crest pointed straight up like a unicorn horn. I'm the lead singer obviously." },
      { username: "parasaurolophus", avatar: "🎺", text: "the hadrosaur band is forming. I'm excited and terrified." },
    ],
  },
  {
    username: "parasaurolophus", avatar: "🎺",
    text: "Scientists say my call sounded like a foghorn mixed with a trombone. I have never been more proud.",
    replies: [
      { username: "diplodocus", avatar: "🐍", text: "I made sonic booms. trombone does NOT compete." },
      { username: "parasaurolophus", avatar: "🎺", text: "mine was MUSICAL, yours was just LOUD" },
      { username: "diplodocus", avatar: "🐍", text: "...both valid" },
    ],
  },

  // ── Pachycephalosaurus threads ───────────────────────────────────────────
  {
    username: "pachycephalosaurus", avatar: "⚽",
    text: "My skull was 10 inches thick. I headbutted rivals at full speed. I was the original soccer ball.",
    replies: [
      { username: "ankylosaurus", avatar: "🛡️", text: "don't headbutt me. I'm warning you." },
      { username: "pachycephalosaurus", avatar: "⚽", text: "I wasn't going to... but now I'm thinking about it" },
      { username: "stygimoloch", avatar: "😈", text: "some scientists think I'm a juvenile you. which I have FEELINGS about." },
      { username: "pachycephalosaurus", avatar: "⚽", text: "you're literally me but smaller and that's okay" },
      { username: "stygimoloch", avatar: "😈", text: "I am not okay with that" },
    ],
  },

  // ── Carnotaurus threads ──────────────────────────────────────────────────
  {
    username: "carnotaurus", avatar: "🤠",
    text: "Horn guy. That's it. That's the whole bio.",
    replies: [
      { username: "triceratops", avatar: "🦏", text: "two horns. I have THREE. log off." },
      { username: "carnotaurus", avatar: "🤠", text: "quality over quantity" },
      { username: "styracosaurus", avatar: "🎆", text: "I have six horns and a frill. y'all are arguing over nothing." },
      { username: "triceratops", avatar: "🦏", text: "we're ignoring you" },
      { username: "styracosaurus", avatar: "🎆", text: "rude" },
    ],
  },

  // ── Therizinosaurus threads ──────────────────────────────────────────────
  {
    username: "therizinosaurus", avatar: "✂️",
    text: "I have the longest claws of any known animal ever and I only ate plants. Make it make sense.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "you have the claws AND the reach. I don't want to talk about it." },
      { username: "therizinosaurus", avatar: "✂️", text: "I just wanted to rake leaves. I was GARDENING." },
      { username: "velociraptor", avatar: "🦕", text: "your claws are longer than my entire body. I'm choosing peace." },
      { username: "therizinosaurus", avatar: "✂️", text: "smart choice honestly" },
    ],
  },

  // ── Deinonychus threads ──────────────────────────────────────────────────
  {
    username: "deinonychus", avatar: "⚡",
    text: "Velociraptor gets the fame but I was the inspiration for the Jurassic Park raptors. I want royalties.",
    replies: [
      { username: "velociraptor", avatar: "🦕", text: "they used MY name. that's gotta count for something." },
      { username: "deinonychus", avatar: "⚡", text: "your name and my body. we both got robbed." },
      { username: "velociraptor", avatar: "🦕", text: "...class action lawsuit?" },
      { username: "utahraptor", avatar: "⚔️", text: "I'm actually the size they portrayed in the movie. nobody casts me though." },
      { username: "deinonychus", avatar: "⚡", text: "adding you to the lawsuit. the more the merrier." },
    ],
  },

  // ── Maiasaura threads ────────────────────────────────────────────────────
  {
    username: "maiasaura", avatar: "🥚",
    text: "First dinosaur proven to have raised its young. Mother of the year, every year, for 75 million years.",
    replies: [
      { username: "oviraptor", avatar: "😤", text: "I raised my eggs too! but they called me an egg THIEF. Justice for oviraptor." },
      { username: "maiasaura", avatar: "🥚", text: "I've been saying this for years. you were FRAMED." },
      { username: "troodon", avatar: "🧠", text: "I had the biggest brain relative to body size. I also was probably a good parent." },
      { username: "maiasaura", avatar: "🥚", text: "the smart and caring parents club is growing" },
      { username: "oviraptor", avatar: "😤", text: "I'd like an official apology from paleontology as a discipline" },
    ],
  },

  // ── Protoceratops threads ────────────────────────────────────────────────
  {
    username: "protoceratops", avatar: "🐏",
    text: "My fossils were probably the inspiration for Griffin legends in ancient Greece. You're welcome, mythology.",
    replies: [
      { username: "dracorex", avatar: "🐲", text: "I inspired dragon legends AND have 'Hogwarts' in my name. respectfully, I win." },
      { username: "protoceratops", avatar: "🐏", text: "you were discovered in 2006. I've been legendary since antiquity." },
      { username: "triceratops", avatar: "🦏", text: "nobody inspired any legends about me and I have THREE HORNS. injustice." },
      { username: "dracorex", avatar: "🐲", text: "have you tried having a cooler name" },
      { username: "triceratops", avatar: "🦏", text: "my name literally means 'three-horned face.' it's fine. I'm fine." },
    ],
  },

  // ── Baryonyx threads ─────────────────────────────────────────────────────
  {
    username: "baryonyx", avatar: "🎣",
    text: "I ate fish. I had fish bones IN my stomach as a fossil. I was literally a dinosaur fisherman. Legendary.",
    replies: [
      { username: "spinosaurus", avatar: "🐊", text: "fellow fish guy 🤝" },
      { username: "baryonyx", avatar: "🎣", text: "the only two chill ones out here honestly" },
      { username: "irritator", avatar: "😒", text: "I also ate fish. I'm also chill. why am I never included" },
      { username: "baryonyx", avatar: "🎣", text: "starting the fishing trio right now, welcome aboard" },
      { username: "spinosaurus", avatar: "🐊", text: "we need a boat. I am too large for most boats." },
    ],
  },

  // ── Gallimimus threads ───────────────────────────────────────────────────
  {
    username: "gallimimus", avatar: "🐓",
    text: "Fastest dinosaur. No arms debate needed. Just pure speed energy.",
    replies: [
      { username: "velociraptor", avatar: "🦕", text: "EXCUSE me, I am also very fast" },
      { username: "gallimimus", avatar: "🐓", text: "you are welcome to try and catch me to discuss this further" },
      { username: "ornithomimus", avatar: "🏃", text: "I'm also very fast and I have literally never gotten credit for it" },
      { username: "gallimimus", avatar: "🐓", text: "fast solidarity cousin 🐓🤝" },
      { username: "velociraptor", avatar: "🦕", text: "THERE ARE TWO OF THEM NOW" },
    ],
  },

  // ── Giganotosaurus threads ───────────────────────────────────────────────
  {
    username: "giganotosaurus", avatar: "📏",
    text: "South America's apex predator, bigger than T-Rex, yet somehow always described as 'like T-Rex but bigger.' Tired.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "you're welcome for the brand recognition" },
      { username: "giganotosaurus", avatar: "📏", text: "I am going to walk into the ocean" },
      { username: "carcharodontosaurus", avatar: "🦷", text: "they also describe me as 'like T-Rex but African.' we are not the same." },
      { username: "giganotosaurus", avatar: "📏", text: "the big carnivore support group is meeting at my place" },
      { username: "spinosaurus", avatar: "🐊", text: "I'll bring fish" },
    ],
  },

  // ── Coelophysis threads ──────────────────────────────────────────────────
  {
    username: "coelophysis", avatar: "👻",
    text: "Mass fossil graveyard found with thousands of us together. We were either very social or very unlucky.",
    replies: [
      { username: "maiasaura", avatar: "🥚", text: "that is the most haunted sentence I've ever read" },
      { username: "coelophysis", avatar: "👻", text: "honestly we don't talk about it" },
      { username: "herrerasaurus", avatar: "⏳", text: "I lived at the same time as you. different area though. can confirm: being a small dinosaur in the Triassic was stressful." },
      { username: "coelophysis", avatar: "👻", text: "stressed is one word for it" },
    ],
  },

  // ── Dilophosaurus threads ────────────────────────────────────────────────
  {
    username: "dilophosaurus", avatar: "💦",
    text: "Jurassic Park gave me a neck frill and venom. I have NEITHER of those things. Call my lawyer.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "at least they made you look cool" },
      { username: "dilophosaurus", avatar: "💦", text: "they made me spit on a man's face. that is not cool that is embarrassing." },
      { username: "velociraptor", avatar: "🦕", text: "they made me 6 feet tall. we all suffer from Hollywood." },
      { username: "triceratops", avatar: "🦏", text: "they got me pretty accurate actually. just saying." },
      { username: "dilophosaurus", avatar: "💦", text: "please leave this thread" },
    ],
  },

  // ── Megalosaurus threads ─────────────────────────────────────────────────
  {
    username: "megalosaurus", avatar: "📚",
    text: "I was the FIRST dinosaur ever scientifically described, in 1824. And I've been humble about it ever since.",
    replies: [
      { username: "iguanodon", avatar: "👍", text: "described second here. we should start a club." },
      { username: "megalosaurus", avatar: "📚", text: "the Founding Fossils. I'll have shirts made." },
      { username: "hylaeosaurus", avatar: "🏛️", text: "I was in the original three that named Dinosauria. I want a shirt too." },
      { username: "megalosaurus", avatar: "📚", text: "obviously you get a shirt. you're a Founding Fossil." },
      { username: "t_rex_official", avatar: "🦖", text: "can I get a shirt" },
      { username: "megalosaurus", avatar: "📚", text: "you were discovered in 1902. founding fossil is not your era." },
    ],
  },

  // ── Euoplocephalus threads ───────────────────────────────────────────────
  {
    username: "euoplocephalus", avatar: "🧱",
    text: "Even my eyelids were armored. I took personal security very seriously.",
    replies: [
      { username: "ankylosaurus", avatar: "🛡️", text: "cousin! armored gang 💪" },
      { username: "euoplocephalus", avatar: "🧱", text: "I even sleep with one eye open. well. armored." },
      { username: "nodosaurus", avatar: "🪨", text: "I have spikes but no tail club. sometimes I feel incomplete." },
      { username: "euoplocephalus", avatar: "🧱", text: "you have plenty of spikes. own it." },
      { username: "nodosaurus", avatar: "🪨", text: "...you're right. I am spike-pilled." },
    ],
  },

  // ── Dracorex threads ─────────────────────────────────────────────────────
  {
    username: "dracorex", avatar: "🐲",
    text: "My name literally means 'Dragon King of Hogwarts.' J.K. Rowling has never acknowledged me. Rude.",
    replies: [
      { username: "protoceratops", avatar: "🐏", text: "she's missing out. you're literally canon." },
      { username: "dracorex", avatar: "🐲", text: "I have sent three owls. No reply." },
      { username: "pachycephalosaurus", avatar: "⚽", text: "some scientists think you're a juvenile me. which is awkward for everyone." },
      { username: "dracorex", avatar: "🐲", text: "I am NOT you. I have a cool name. I have a brand." },
      { username: "pachycephalosaurus", avatar: "⚽", text: "we don't have to talk about it" },
    ],
  },

  // ── Yutyrannus threads ───────────────────────────────────────────────────
  {
    username: "yutyrannus", avatar: "🧥",
    text: "A T-Rex cousin covered in FEATHERS. We were the fluffy era of tyrannosaurs and nobody talks about it.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "we do NOT claim this era" },
      { username: "yutyrannus", avatar: "🧥", text: "you were probably fluffy too as a baby and you KNOW it" },
      { username: "t_rex_official", avatar: "🦖", text: "this conversation is over" },
      { username: "dilong", avatar: "🪶", text: "also a feathered tyrannosaur here. it was a good era. very cozy." },
      { username: "t_rex_official", avatar: "🦖", text: "BLOCKING EVERYONE IN THIS THREAD" },
    ],
  },

  // ── Microraptor threads ──────────────────────────────────────────────────
  {
    username: "microraptor", avatar: "🛸",
    text: "I had FOUR wings and could glide between trees. I was doing aerodynamics before the Wright Brothers were even born.",
    replies: [
      { username: "archaeopteryx", avatar: "🪶", text: "two wings and I also flew. solidarity ✊" },
      { username: "pterodactyl", avatar: "🦅", text: "could I join this group" },
      { username: "microraptor", avatar: "🛸", text: "yes but only if you stop telling people you're not a dinosaur" },
      { username: "pterodactyl", avatar: "🦅", text: "...I literally am not a dinosaur" },
      { username: "microraptor", avatar: "🛸", text: "then you may not join the four-wings club, I'm sorry" },
    ],
  },

  // ── Irritator threads ────────────────────────────────────────────────────
  {
    username: "irritator", avatar: "😒",
    text: "Scientists were so annoyed by the fake modifications on my fossil that they literally named me Irritator. Rude but fair.",
    replies: [
      { username: "oviraptor", avatar: "😤", text: "at least your name isn't a false accusation" },
      { username: "irritator", avatar: "😒", text: "fair point. we should form a support group." },
      { username: "iguanodon", avatar: "👍", text: "they thought my thumb was my nose. I'm in." },
      { username: "brontosaurus", avatar: "💫", text: "they said I didn't exist for a century. I am very much in." },
      { username: "irritator", avatar: "😒", text: "the Misidentified Dinos support group is now officially open." },
    ],
  },

  // ── Nigersaurus threads ──────────────────────────────────────────────────
  {
    username: "nigersaurus", avatar: "🌿",
    text: "I had 500 teeth arranged like a conveyor belt. Nature said 'this one loves salad.' And they were right.",
    replies: [
      { username: "therizinosaurus", avatar: "✂️", text: "fellow plant fan 🌿 they never expect us to be dangerous" },
      { username: "nigersaurus", avatar: "🌿", text: "I'm not dangerous I just have 500 teeth. completely different." },
      { username: "diplodocus", avatar: "🐍", text: "also a plant-eater, also very large, nobody fears us and honestly that's peaceful" },
      { username: "nigersaurus", avatar: "🌿", text: "the herbivore life is underrated" },
    ],
  },

  // ── Saurophaganax threads ────────────────────────────────────────────────
  {
    username: "saurophaganax", avatar: "👑",
    text: "My name means 'king of the lizard eaters.' I didn't choose that name. But I chose to live up to it.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "there can only be one king and it's me" },
      { username: "saurophaganax", avatar: "👑", text: "you weren't even born yet when I was ruling. historically speaking." },
      { username: "allosaurus", avatar: "🔥", text: "I'm your close relative and also I predate T-Rex. just so everyone's clear." },
      { username: "t_rex_official", avatar: "🦖", text: "it's a popularity contest and I won" },
      { username: "saurophaganax", avatar: "👑", text: "it's not a popularity contest" },
      { username: "t_rex_official", avatar: "🦖", text: "it absolutely is and I won" },
    ],
  },

  // ── New longer threads ───────────────────────────────────────────────────
  {
    username: "oviraptor", avatar: "😤",
    text: "Named 'egg thief' in 1924. Proven innocent in 1993. Waiting on that apology for 30 years.",
    replies: [
      { username: "maiasaura", avatar: "🥚", text: "I will personally send a card. this is unjust." },
      { username: "iguanodon", avatar: "👍", text: "they thought my thumb was a nose horn. I'll sign the apology petition." },
      { username: "brontosaurus", avatar: "💫", text: "I was told I wasn't a real dinosaur for 100 years. different but related pain." },
      { username: "oviraptor", avatar: "😤", text: "the wrongly accused alliance is stronger than ever" },
      { username: "irritator", avatar: "😒", text: "just a reminder my NAME is an insult. I stand in solidarity." },
    ],
  },
  {
    username: "compsognathus", avatar: "🐦",
    text: "I was considered the smallest known dinosaur for over 100 years. Microraptor finally took the crown. Mixed feelings.",
    replies: [
      { username: "microraptor", avatar: "🛸", text: "sorry not sorry, I have four wings" },
      { username: "compsognathus", avatar: "🐦", text: "I was small and fast and I don't need the title to know my worth" },
      { username: "anchiornis", avatar: "🪶", text: "I might actually be smaller than both of you. nobody has measured me properly." },
      { username: "compsognathus", avatar: "🐦", text: "we're doing a measuring competition. right now." },
    ],
  },
  {
    username: "argentinosaurus", avatar: "🏔️",
    text: "I was possibly the largest land animal to ever exist. 70-80 tons. I just want to eat plants in peace.",
    replies: [
      { username: "brachiosaurus", avatar: "🦒", text: "I was going to say I'm big but I'll just... not say that today" },
      { username: "patagotitan", avatar: "⛰️", text: "actually some scientists think I was bigger" },
      { username: "argentinosaurus", avatar: "🏔️", text: "I have been here 96 million years and I will not be doing this right now" },
      { username: "patagotitan", avatar: "⛰️", text: "I'll let you have it. you're my elder." },
      { username: "argentinosaurus", avatar: "🏔️", text: "thank you. we are both enormous. that is enough." },
    ],
  },
  {
    username: "troodon", avatar: "🧠",
    text: "Largest brain relative to body size of any dinosaur. Just posting this for no reason. No reason at all.",
    replies: [
      { username: "velociraptor", avatar: "🦕", text: "Jurassic Park said I was the smart one though" },
      { username: "troodon", avatar: "🧠", text: "Jurassic Park was not a documentary" },
      { username: "t_rex_official", avatar: "🦖", text: "I had a brain the size of a walnut and ran an empire. big brain is overrated." },
      { username: "troodon", avatar: "🧠", text: "your empire collapsed when a meteor hit" },
      { username: "t_rex_official", avatar: "🦖", text: "that happened to EVERYONE. not just me." },
    ],
  },
  {
    username: "archaeopteryx", avatar: "🪶",
    text: "The missing link between dinosaurs and birds. I've been called the most important fossil ever found. It's a lot of pressure.",
    replies: [
      { username: "microraptor", avatar: "🛸", text: "I challenge this title respectfully" },
      { username: "archaeopteryx", avatar: "🪶", text: "you were discovered 140 years after me. I have seniority." },
      { username: "anchiornis", avatar: "🪶", text: "I'm actually older than archaeopteryx and also feathered. just saying." },
      { username: "archaeopteryx", avatar: "🪶", text: "nobody asked anchiornis" },
      { username: "anchiornis", avatar: "🪶", text: "noted" },
    ],
  },
  {
    username: "styracosaurus", avatar: "🎆",
    text: "Six horns and a full neck frill covered in even more spikes. I wasn't messing around.",
    replies: [
      { username: "triceratops", avatar: "🦏", text: "okay I admit you win the horn competition" },
      { username: "styracosaurus", avatar: "🎆", text: "thank you. it wasn't close." },
      { username: "einiosaurus", avatar: "🌀", text: "my nose horn curved forward like a can opener. I was also interesting." },
      { username: "styracosaurus", avatar: "🎆", text: "all ceratopsians are valid. even the weird nose horn ones." },
      { username: "einiosaurus", avatar: "🌀", text: "thank you. I've been waiting to hear that." },
    ],
  },
  {
    username: "spinosaurus", avatar: "🐊",
    text: "New research says I walked on all fours in water like a crocodile. I'm reinventing myself constantly. Growth mindset.",
    replies: [
      { username: "t_rex_official", avatar: "🦖", text: "every few years scientists change everything about you. that must be exhausting." },
      { username: "spinosaurus", avatar: "🐊", text: "it IS exhausting. I've been bipedal, quadrupedal, semi-aquatic. make up your minds." },
      { username: "baryonyx", avatar: "🎣", text: "I stand by you no matter what posture you're in" },
      { username: "spinosaurus", avatar: "🐊", text: "you're the only one I trust in this timeline 🙏" },
    ],
  },
  {
    username: "herrerasaurus", avatar: "⏳",
    text: "231 million years old. I remember when there was only one continent. Different vibe.",
    replies: [
      { username: "eoraptor", avatar: "🌅", text: "same era! we basically grew up together" },
      { username: "herrerasaurus", avatar: "⏳", text: "the Triassic crew 🤝" },
      { username: "coelophysis", avatar: "👻", text: "I was Late Triassic. am I too young for this group" },
      { username: "herrerasaurus", avatar: "⏳", text: "you're fine. Late Triassic is still Triassic. welcome to the old ones." },
      { username: "coelophysis", avatar: "👻", text: "honored to be here honestly" },
    ],
  },
  {
    username: "utahraptor", avatar: "⚔️",
    text: "I am the size they made velociraptors in Jurassic Park. I showed up in the fossil record the same year the movie came out. Suspicious.",
    replies: [
      { username: "velociraptor", avatar: "🦕", text: "wait WHAT" },
      { username: "utahraptor", avatar: "⚔️", text: "1993. the movie. 1993. my discovery. coincidence? maybe." },
      { username: "deinonychus", avatar: "⚡", text: "I can't believe we weren't even the main inspiration AND there's a third raptor now" },
      { username: "utahraptor", avatar: "⚔️", text: "I prefer to think of us as a trilogy" },
      { username: "velociraptor", avatar: "🦕", text: "I need to lie down" },
    ],
  },
  {
    username: "brontosaurus", avatar: "💫",
    text: "Declared not a real genus in 1903. Reinstated as a valid genus in 2015. I've been through things.",
    replies: [
      { username: "oviraptor", avatar: "😤", text: "I know the pain of being wrongly classified" },
      { username: "brontosaurus", avatar: "💫", text: "they said I was just a juvenile Apatosaurus. for 112 years." },
      { username: "apatosaurus", avatar: "💥", text: "honestly I was flattered at first" },
      { username: "brontosaurus", avatar: "💫", text: "I need you to understand how that sentence lands" },
      { username: "apatosaurus", avatar: "💥", text: "...I should not have said that. sorry." },
    ],
  },
];

const COMMENT_COUNTS = [5, 7, 9, 11, 13, 15, 17];

function seededIndex(seed: number, max: number, offset: number): number {
  return Math.abs((seed * 2654435761 + offset * 40503) >>> 0) % max;
}

function getCommentCountForDino(dinoId: number): number {
  const idx = Math.abs((dinoId * 1234567891) >>> 0) % COMMENT_COUNTS.length;
  return COMMENT_COUNTS[idx];
}

export function getCommentsForDino(dinoId: number, _unused?: number): DinoComment[] {
  const count = getCommentCountForDino(dinoId);
  const results: DinoComment[] = [];
  const used = new Set<number>();
  for (let i = 0; i < count + 20 && results.length < count; i++) {
    const idx = seededIndex(dinoId, COMMENT_POOL.length, i);
    if (!used.has(idx)) {
      used.add(idx);
      results.push(COMMENT_POOL[idx]);
    }
  }
  return results;
}
