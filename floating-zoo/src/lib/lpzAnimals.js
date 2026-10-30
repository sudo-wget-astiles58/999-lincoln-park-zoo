// Lincoln Park Zoo animals, pulled from lpzoo.org exhibit pages (Oct 2026).
// featured: true = the "headliner" animals most visitors look for.
// Emojis are the closest match where no exact emoji exists (noted with a comment).


// "🐵🐒🦍🦧🐶🐕🦮🐕‍🦺🐩🐺🦊🦝🐱🐈🐈‍⬛🦁🐯🐅🐆🐴🫎🫏🐎🦄🦓🦌🦬🐮🐂🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🦙🦒🐘🦣🦏🦛🐭🐁🐀🐹🐰🐇🐿️🦫🦔🦇🐻🐻‍❄️🐨🐼🦥🦦🦨🦘🦡🐾🦃🐔🐓🐣🐤🐥🐦🐧🕊️🦅🦆🦢🦉🦤🪶🦩🦚🦜🪽🐦‍⬛🪿🐦‍🔥🪺🐸🐊🐢🦎🐍🐲🐉🦕🦖🐳🐋🐬🦭🐟🐠🐡🦈🐙🐚🪸🪼🦀🦞🦐🦑🦪🐌🦋🐛🐜🐝🪲🐞🦗🪳🕷️🕸️🦂🦟🪰🪱🦠💐🌸💮🪷🏵️🌹🥀🌺🌻🌼🌷🪻🌱🪴🌲🌳🌴🌵🌾🌿☘️🍀🍁🍂🍃🪾🪨🪵🌑🌒🌓🌔🌕🌖🌗🌘🌙🌚🌛🌜☀️🌝🌞🪐⭐🌠🌌☁️⛅⛈️🌤️🌥️🌦️🌧️🌨️🌩️🌀🌈🌂☂️⛱️❄️☃️⛄☄️🔥💧🌊"




export const LPZ_ANIMALS = {
    // ── Regenstein African Journey ──
    aardvark: { name: 'Aardvark', emoji: '🐽', exhibit: 'African Journey' }, // no aardvark emoji
    africanPaintedDog: { name: 'African Painted Dog', emoji: '🐕', exhibit: 'African Journey', featured: true },
    africanSpoonbill: { name: 'African Spoonbill', emoji: '🐦', exhibit: 'African Journey' },
    blueBelliedRoller: { name: 'Blue-bellied Roller', emoji: '🐦', exhibit: 'African Journey' },
    blueBilledTeal: { name: 'Blue-billed Teal', emoji: '🦆', exhibit: 'African Journey' },
    crestedGuineafowl: { name: 'Crested Guineafowl', emoji: '🐓', exhibit: 'African Journey' },
    dianaMonkey: { name: 'Diana Monkey', emoji: '🐒', exhibit: 'African Journey' },
    blackRhino: { name: 'Eastern Black Rhinoceros', emoji: '🦏', exhibit: 'African Journey', featured: true },
    giraffe: { name: 'Giraffe', emoji: '🦒', exhibit: 'African Journey', featured: true },
    hadadaIbis: { name: 'Hadada Ibis', emoji: '🐦', exhibit: 'African Journey' },
    klipspringer: { name: 'Klipspringer', emoji: '🐐', exhibit: 'African Journey' }, // small antelope
    malawiCichlid: { name: 'Lake Malawi Cichlid', emoji: '🐠', exhibit: 'African Journey' },
    hissingCockroach: { name: 'Madagascar Hissing Cockroach', emoji: '🪳', exhibit: 'African Journey' },
    meerkat: { name: 'Meerkat', emoji: '🐿️', exhibit: 'African Journey', featured: true }, // no meerkat emoji
    plainsZebra: { name: 'Plains Zebra', emoji: '🦓', exhibit: 'African Journey', featured: true },
    pygmyHippo: { name: 'Pygmy Hippopotamus', emoji: '🦛', exhibit: 'African Journey', featured: true },
    redRiverHog: { name: 'Red River Hog', emoji: '🐗', exhibit: 'African Journey' },
    redBilledHornbill: { name: 'Red-billed Hornbill', emoji: '🐦', exhibit: 'African Journey' },
    dwarfCrocodile: { name: 'West African Dwarf Crocodile', emoji: '🐊', exhibit: 'African Journey', featured: true },

    // ── Regenstein Small Mammal-Reptile House ──
    africanRockPython: { name: 'African Rock Python', emoji: '🐍', exhibit: 'Small Mammal-Reptile House' },
    amazonMilkFrog: { name: 'Amazon Milk Frog', emoji: '🐸', exhibit: 'Small Mammal-Reptile House' },
    anthonysDartFrog: { name: 'Anthony’s Poison Dart Frog', emoji: '🐸', exhibit: 'Small Mammal-Reptile House' },
    arubaRattlesnake: { name: 'Aruba Island Rattlesnake', emoji: '🐍', exhibit: 'Small Mammal-Reptile House' },
    asianOtter: { name: 'Asian Small-clawed Otter', emoji: '🦦', exhibit: 'Small Mammal-Reptile House', featured: true },
    axolotl: { name: 'Axolotl', emoji: '🦎', exhibit: 'Small Mammal-Reptile House', featured: true }, // no axolotl emoji
    blackTreeMonitor: { name: 'Black Tree Monitor', emoji: '🦎', exhibit: 'Small Mammal-Reptile House' },
    cactusMouse: { name: 'Cactus Mouse', emoji: '🐁', exhibit: 'Small Mammal-Reptile House' },
    dwarfMongoose: { name: 'Dwarf Mongoose', emoji: '🦡', exhibit: 'Small Mammal-Reptile House' },
    dyeingDartFrog: { name: 'Dyeing Poison Dart Frog', emoji: '🐸', exhibit: 'Small Mammal-Reptile House' },
    massasauga: { name: 'Eastern Massasauga Rattlesnake', emoji: '🐍', exhibit: 'Small Mammal-Reptile House' },
    fruitBat: { name: 'Egyptian Fruit Bat', emoji: '🦇', exhibit: 'Small Mammal-Reptile House' },
    emperorNewt: { name: 'Emperor Newt', emoji: '🦎', exhibit: 'Small Mammal-Reptile House' },
    emperorTamarin: { name: 'Emperor Tamarin', emoji: '🐒', exhibit: 'Small Mammal-Reptile House', featured: true },
    greenTreePython: { name: 'Green Tree Python', emoji: '🐍', exhibit: 'Small Mammal-Reptile House' },
    sloth: { name: 'Hoffmann’s Two-toed Sloth', emoji: '🦥', exhibit: 'Small Mammal-Reptile House', featured: true },
    fatTailedGecko: { name: 'Iranian Fat-tailed Gecko', emoji: '🦎', exhibit: 'Small Mammal-Reptile House' },
    jamaicanIguana: { name: 'Jamaican Iguana', emoji: '🦎', exhibit: 'Small Mammal-Reptile House' },
    bushbaby: { name: 'Moholi Bushbaby', emoji: '🐒', exhibit: 'Small Mammal-Reptile House' },
    nakedMoleRat: { name: 'Naked Mole Rat', emoji: '🐀', exhibit: 'Small Mammal-Reptile House', featured: true },
    treeShrew: { name: 'Northern Tree Shrew', emoji: '🐁', exhibit: 'Small Mammal-Reptile House' },
    walkingstick: { name: 'Northern Walkingstick', emoji: '🦗', exhibit: 'Small Mammal-Reptile House' },
    fireBelliedToad: { name: 'Oriental Fire-bellied Toad', emoji: '🐸', exhibit: 'Small Mammal-Reptile House' },
    knightAnole: { name: 'Oriente Knight Anole', emoji: '🦎', exhibit: 'Small Mammal-Reptile House' },
    porcupine: { name: 'Prehensile-tailed Porcupine', emoji: '🦔', exhibit: 'Small Mammal-Reptile House' },
    prehensileSkink: { name: 'Prehensile-tailed Skink', emoji: '🦎', exhibit: 'Small Mammal-Reptile House' },
    puertoRicanParrot: { name: 'Puerto Rican Parrot', emoji: '🦜', exhibit: 'Small Mammal-Reptile House' },
    slowLoris: { name: 'Pygmy Slow Loris', emoji: '🐒', exhibit: 'Small Mammal-Reptile House' },
    redFootedTortoise: { name: 'Red-footed Tortoise', emoji: '🐢', exhibit: 'Small Mammal-Reptile House' },
    beadedLizard: { name: 'Rio Fuerte Beaded Lizard', emoji: '🦎', exhibit: 'Small Mammal-Reptile House' },
    leafFrog: { name: 'Solomon Islands Leaf Frog', emoji: '🐸', exhibit: 'Small Mammal-Reptile House' },
    caiman: { name: 'Spectacled Caiman', emoji: '🐊', exhibit: 'Small Mammal-Reptile House' },
    virginIslandsBoa: { name: 'Virgin Islands Boa', emoji: '🐍', exhibit: 'Small Mammal-Reptile House' },
    gaboonViper: { name: 'West African Gaboon Viper', emoji: '🐍', exhibit: 'Small Mammal-Reptile House' },
    stingray: { name: 'White-blotched River Stingray', emoji: '🐟', exhibit: 'Small Mammal-Reptile House' }, // no ray emoji
    saki: { name: 'White-faced Saki', emoji: '🐒', exhibit: 'Small Mammal-Reptile House' },
    amazonRiverTurtle: { name: 'Yellow-spotted Amazon River Turtle', emoji: '🐢', exhibit: 'Small Mammal-Reptile House' },
    reedFrog: { name: 'Whitebelly Reed Frog', emoji: '🐸', exhibit: 'Small Mammal-Reptile House' },

    // ── Helen Brach Primate House ──
    swampMonkey: { name: 'Allen’s Swamp Monkey', emoji: '🐒', exhibit: 'Primate House' },
    colobus: { name: 'Black-and-white Colobus Monkey', emoji: '🐒', exhibit: 'Primate House', featured: true },
    titiMonkey: { name: 'Bolivian Gray Titi Monkey', emoji: '🐒', exhibit: 'Primate House' },
    deBrazza: { name: 'De Brazza’s Monkey', emoji: '🐒', exhibit: 'Primate House' },
    francoisLangur: { name: 'Francois’ Langur', emoji: '🐒', exhibit: 'Primate House' },
    piedTamarin: { name: 'Pied Tamarin', emoji: '🐒', exhibit: 'Primate House' },
    howlerMonkey: { name: 'Southern Black Howler Monkey', emoji: '🐒', exhibit: 'Primate House' },
    gibbon: { name: 'White-cheeked Gibbon', emoji: '🐒', exhibit: 'Primate House', featured: true },

    // ── McCormick Bird House ──
    abdimsStork: { name: 'Abdim’s Stork', emoji: '🐦', exhibit: 'Bird House' },
    avocet: { name: 'American Avocet', emoji: '🐦', exhibit: 'Bird House' },
    baersPochard: { name: 'Baer’s Pochard', emoji: '🦆', exhibit: 'Bird House' },
    baliMyna: { name: 'Bali Myna', emoji: '🐦', exhibit: 'Bird House' },
    beautifulFruitDove: { name: 'Beautiful Fruit Dove', emoji: '🕊️', exhibit: 'Bird House' },
    stilt: { name: 'Black-necked Stilt', emoji: '🐦', exhibit: 'Bird House' },
    honeyeater: { name: 'Blue-faced Honeyeater', emoji: '🐦', exhibit: 'Bird House' },
    tanager: { name: 'Blue-grey Tanager', emoji: '🐦', exhibit: 'Bird House' },
    bourkesParrot: { name: 'Bourke’s Parrot', emoji: '🦜', exhibit: 'Bird House' },
    hwamei: { name: 'Chinese Hwamei', emoji: '🐦', exhibit: 'Bird House' },
    bulbul: { name: 'Collared Finch-billed Bulbul', emoji: '🐦', exhibit: 'Bird House' },
    woodPartridge: { name: 'Crested Wood-partridge', emoji: '🐦', exhibit: 'Bird House' },
    emeraldStarling: { name: 'Emerald Starling', emoji: '🐦', exhibit: 'Bird House' },
    goldenStarling: { name: 'Golden-breasted Starling', emoji: '🐦', exhibit: 'Bird House' },
    broadbill: { name: 'Green Broadbill', emoji: '🐦', exhibit: 'Bird House' },
    guamKingfisher: { name: 'Guam Kingfisher', emoji: '🐦', exhibit: 'Bird House', featured: true },
    hamerkop: { name: 'Hamerkop', emoji: '🐦', exhibit: 'Bird House' },
    curassow: { name: 'Helmeted Curassow', emoji: '🦃', exhibit: 'Bird House' },
    incaTern: { name: 'Inca Tern', emoji: '🐦', exhibit: 'Bird House' },
    jambuFruitDove: { name: 'Jambu Fruit Dove', emoji: '🕊️', exhibit: 'Bird House' },
    kagu: { name: 'Kagu', emoji: '🐦', exhibit: 'Bird House' },
    kookaburra: { name: 'Laughing Kookaburra', emoji: '🐦', exhibit: 'Bird House', featured: true },
    bleedingHeartDove: { name: 'Luzon Bleeding Heart Dove', emoji: '🕊️', exhibit: 'Bird House' },
    maskedLapwing: { name: 'Masked Lapwing', emoji: '🐦', exhibit: 'Bird House' },
    nicobarPigeon: { name: 'Nicobar Pigeon', emoji: '🕊️', exhibit: 'Bird House' },
    leiothrix: { name: 'Red-billed Leiothrix', emoji: '🐦', exhibit: 'Bird House' },
    redCappedCardinal: { name: 'Red-capped Cardinal', emoji: '🐦', exhibit: 'Bird House' },
    scarletIbis: { name: 'Scarlet Ibis', emoji: '🐦', exhibit: 'Bird House', featured: true },
    robinChat: { name: 'Snowy-headed Robin Chat', emoji: '🐦', exhibit: 'Bird House' },
    dikkop: { name: 'Spotted Dikkop', emoji: '🐦', exhibit: 'Bird House' },
    sunbittern: { name: 'Sunbittern', emoji: '🐦', exhibit: 'Bird House' },
    golden_weaver: { name: 'Taveta Golden Weaver', emoji: '🐦', exhibit: 'Bird House' },
    frogmouth: { name: 'Tawny Frogmouth', emoji: '🦉', exhibit: 'Bird House', featured: true }, // owl-like look
    turaco: { name: 'Violaceous Turaco', emoji: '🐦', exhibit: 'Bird House' },
    buffaloWeaver: { name: 'White-headed Buffalo Weaver', emoji: '🐦', exhibit: 'Bird House' },
    shama: { name: 'White-rumped Shama', emoji: '🐦', exhibit: 'Bird House' },

    // ── Pepper Family Wildlife Center ──
    lion: { name: 'African Lion', emoji: '🦁', exhibit: 'Pepper Family Wildlife Center', featured: true },
    lynx: { name: 'Canada Lynx', emoji: '🐈', exhibit: 'Pepper Family Wildlife Center' },
    redPanda: { name: 'Red Panda', emoji: '🐼', exhibit: 'Pepper Family Wildlife Center', featured: true }, // no red panda emoji
    snowLeopard: { name: 'Snow Leopard', emoji: '🐆', exhibit: 'Pepper Family Wildlife Center', featured: true },

    // ── Regenstein Center for African Apes ──
    chimpanzee: { name: 'Chimpanzee', emoji: '🐵', exhibit: 'Center for African Apes', featured: true },
    gorilla: { name: 'Western Lowland Gorilla', emoji: '🦍', exhibit: 'Center for African Apes', featured: true },

    // ── Pritzker Family Children's Zoo ──
    beaver: { name: 'American Beaver', emoji: '🦫', exhibit: 'Children’s Zoo', featured: true },
    blackBear: { name: 'American Black Bear', emoji: '🐻', exhibit: 'Children’s Zoo', featured: true },
    blandingsTurtle: { name: 'Blanding’s Turtle', emoji: '🐢', exhibit: 'Children’s Zoo' },
    riverOtter: { name: 'North American River Otter', emoji: '🦦', exhibit: 'Children’s Zoo', featured: true },
    ornateBoxTurtle: { name: 'Ornate Box Turtle', emoji: '🐢', exhibit: 'Children’s Zoo' },
    redWolf: { name: 'Red Wolf', emoji: '🐺', exhibit: 'Children’s Zoo', featured: true },
    spottedTurtle: { name: 'Spotted Turtle', emoji: '🐢', exhibit: 'Children’s Zoo' },
    threeToedBoxTurtle: { name: 'Three-toed Box Turtle', emoji: '🐢', exhibit: 'Children’s Zoo' },
    woodTurtle: { name: 'Wood Turtle', emoji: '🐢', exhibit: 'Children’s Zoo' },

    // ── Farm-in-the-Zoo ──
    cow: { name: 'Domestic Cattle', emoji: '🐄', exhibit: 'Farm-in-the-Zoo', featured: true },
    chicken: { name: 'Domestic Chicken', emoji: '🐔', exhibit: 'Farm-in-the-Zoo' },
    goat: { name: 'Domestic Goat', emoji: '🐐', exhibit: 'Farm-in-the-Zoo' },
    pig: { name: 'Domestic Pig', emoji: '🐖', exhibit: 'Farm-in-the-Zoo' },
    rabbit: { name: 'Domestic Rabbit', emoji: '🐇', exhibit: 'Farm-in-the-Zoo' },
    pony: { name: 'Pony', emoji: '🐴', exhibit: 'Farm-in-the-Zoo' },

    // ── Regenstein Birds of Prey ──
    baldEagle: { name: 'Bald Eagle', emoji: '🦅', exhibit: 'Birds of Prey', featured: true },
    vulture: { name: 'Cinereous Vulture', emoji: '🦅', exhibit: 'Birds of Prey' },
    whiteStork: { name: 'European White Stork', emoji: '🐦', exhibit: 'Birds of Prey' },
    snowyOwl: { name: 'Snowy Owl', emoji: '🦉', exhibit: 'Birds of Prey', featured: true },

    // ── Waterfowl Lagoon ──
    flamingo: { name: 'Chilean Flamingo', emoji: '🦩', exhibit: 'Waterfowl Lagoon', featured: true },
    swanGoose: { name: 'Swan Goose', emoji: '🪿', exhibit: 'Waterfowl Lagoon' },

    // ── South Loop (Camel & Zebra area) ──
    peccary: { name: 'Chacoan Peccary', emoji: '🐗', exhibit: 'South Loop' },
    grevysZebra: { name: 'Grevy’s Zebra', emoji: '🦓', exhibit: 'South Loop', featured: true },
    pereDavidsDeer: { name: 'Père David’s Deer', emoji: '🦌', exhibit: 'South Loop' },
    takin: { name: 'Sichuan Takin', emoji: '🐃', exhibit: 'South Loop' },
    alpaca: { name: 'Alpaca', emoji: '🦙', exhibit: 'South Loop', featured: true },

    // ── Kovler Seal Pool ──
    greySeal: { name: 'Grey Seal', emoji: '🦭', exhibit: 'Kovler Seal Pool', featured: true },
    harborSeal: { name: 'Harbor Seal', emoji: '🦭', exhibit: 'Kovler Seal Pool', featured: true },

    // ── Walter Family Arctic Tundra ──
    polarBear: { name: 'Polar Bear', emoji: '🐻‍❄️', exhibit: 'Arctic Tundra', featured: true },
    grizzlyBear: { name: 'Grizzly Bear', emoji: '🐻', exhibit: 'Arctic Tundra', featured: true },

    // ── Not yet verified against exhibit pages (see notes in chat) ──
    africanPenguin: { name: 'African Penguin', emoji: '🐧', exhibit: 'Penguin Cove', featured: true },
    japaneseMacaque: { name: 'Japanese Macaque', emoji: '🐒', exhibit: 'Macaque Forest', featured: true },
    barrowsGoldeneye: { name: 'Barrow’s Goldeneye', emoji: '🦆', exhibit: '?' },
    nightHeron: { name: 'Black-crowned Night Heron', emoji: '🐦', exhibit: '?' },
}