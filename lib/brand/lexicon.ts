// Hand-curated word banks the naming engine draws from.
// "images" are real, concrete words from a domain's world: things you can
// picture, not descriptions of the business. That's where good names come from.

export type Root = { root: string; meaning: string };

export type Domain = {
  id: string;
  theme: string; // used in rationale copy: "borrowed from <theme>"
  triggers: string[];
  images: string[];
  roots: Root[];
};

export const DOMAINS: Domain[] = [
  {
    id: "pets",
    theme: "life with animals",
    triggers: ["dog", "puppy", "pet", "cat", "kitten", "vet", "walker", "groomer", "grooming", "animal", "shelter", "adoption"],
    images: ["Leash", "Fetch", "Wag", "Kennel", "Burrow", "Whistle", "Collar", "Scruff", "Romp", "Tumble", "Biscuit", "Pawprint"],
    roots: [{ root: "canis", meaning: "dog" }, { root: "felis", meaning: "cat" }, { root: "amica", meaning: "friend" }],
  },
  {
    id: "food",
    theme: "the kitchen",
    triggers: ["food", "meal", "restaurant", "cook", "cooking", "recipe", "kitchen", "chef", "bakery", "bake", "baking", "grocery", "groceries", "lunch", "dinner", "snack", "eat", "eating", "catering", "pizza", "taco"],
    images: ["Ladle", "Crumb", "Larder", "Skillet", "Simmer", "Sprig", "Pantry", "Hearth", "Saffron", "Brine", "Knead", "Morsel"],
    roots: [{ root: "gusto", meaning: "taste" }, { root: "sapor", meaning: "flavor" }, { root: "mensa", meaning: "table" }],
  },
  {
    id: "drink",
    theme: "the café and the cellar",
    triggers: ["coffee", "cafe", "café", "tea", "drink", "drinks", "brew", "brewery", "juice", "wine", "beer", "bar", "cocktail", "smoothie"],
    images: ["Roast", "Steep", "Crema", "Kettle", "Pour", "Tannin", "Barrel", "Ferment", "Cask", "Decant", "Grounds", "Copper"],
    roots: [{ root: "vinum", meaning: "wine" }, { root: "aqua", meaning: "water" }, { root: "cafe", meaning: "coffee" }],
  },
  {
    id: "music",
    theme: "record crates and listening rooms",
    triggers: ["music", "record", "records", "vinyl", "song", "songs", "band", "audio", "concert", "playlist", "guitar", "podcast", "sound", "musician", "dj", "studio", "album"],
    images: ["Groove", "Needle", "Encore", "Spin", "Chorus", "Treble", "Reverb", "Flipside", "Tempo", "Crate", "Hum", "Backbeat"],
    roots: [{ root: "sona", meaning: "sound" }, { root: "lyra", meaning: "lyre" }, { root: "canto", meaning: "I sing" }],
  },
  {
    id: "fitness",
    theme: "training and movement",
    triggers: ["fitness", "gym", "workout", "workouts", "exercise", "train", "training", "run", "running", "runner", "yoga", "athlete", "coach", "lift", "lifting", "pilates", "strength"],
    images: ["Stride", "Sprint", "Pulse", "Summit", "Grit", "Rally", "Peak", "Momentum", "Lunge", "Pace", "Kettlebell", "Switchback"],
    roots: [{ root: "vigor", meaning: "energy" }, { root: "fortis", meaning: "strong" }, { root: "kine", meaning: "movement" }],
  },
  {
    id: "finance",
    theme: "money and safekeeping",
    triggers: ["money", "budget", "budgeting", "finance", "financial", "invest", "investing", "bank", "banking", "pay", "payment", "payments", "saving", "savings", "save", "tax", "taxes", "loan", "credit", "expense", "expenses", "accounting", "invoice", "invoices", "spending"],
    images: ["Ledger", "Keel", "Ballast", "Harbor", "Vault", "Tally", "Acorn", "Nest", "Anchor", "Coin", "Abacus", "Purse"],
    roots: [{ root: "fides", meaning: "trust" }, { root: "aurum", meaning: "gold" }, { root: "cresco", meaning: "I grow" }],
  },
  {
    id: "education",
    theme: "the classroom",
    triggers: ["learn", "learning", "study", "studying", "tutor", "tutoring", "school", "student", "students", "course", "courses", "class", "classes", "teach", "teacher", "teachers", "homework", "exam", "exams", "college", "education", "lesson", "lessons", "university"],
    images: ["Chalk", "Margin", "Lantern", "Satchel", "Recess", "Quill", "Atlas", "Primer", "Ivy", "Owl", "Slate", "Footnote"],
    roots: [{ root: "schola", meaning: "school" }, { root: "sophia", meaning: "wisdom" }, { root: "disco", meaning: "I learn" }],
  },
  {
    id: "travel",
    theme: "the road and the map",
    triggers: ["travel", "traveler", "travelers", "trip", "trips", "hotel", "flight", "flights", "vacation", "tour", "tourist", "tourists", "booking", "hostel", "explore", "adventure", "road", "itinerary", "backpacker"],
    images: ["Compass", "Passport", "Layover", "Meridian", "Trail", "Drift", "Postcard", "Nomad", "Wayfare", "Waypoint", "Signpost", "Horizon"],
    roots: [{ root: "via", meaning: "way" }, { root: "iter", meaning: "journey" }, { root: "terra", meaning: "land" }],
  },
  {
    id: "home",
    theme: "the house itself",
    triggers: ["home", "homes", "house", "houses", "rent", "rental", "apartment", "apartments", "landlord", "tenant", "tenants", "cleaning", "clean", "furniture", "interior", "roommate", "roommates", "repair", "repairs", "plumber", "moving", "realtor", "property"],
    images: ["Hearth", "Threshold", "Lintel", "Gable", "Porch", "Keystone", "Doorway", "Rafter", "Nook", "Mantel", "Latch", "Dwell"],
    roots: [{ root: "domus", meaning: "home" }, { root: "casa", meaning: "house" }, { root: "oikos", meaning: "household" }],
  },
  {
    id: "fashion",
    theme: "the tailor's bench",
    triggers: ["clothes", "clothing", "fashion", "wear", "shoe", "shoes", "outfit", "outfits", "style", "thrift", "vintage", "apparel", "dress", "dresses", "jewelry", "sneaker", "sneakers", "closet", "wardrobe"],
    images: ["Seam", "Hem", "Thread", "Selvedge", "Stitch", "Bobbin", "Tailor", "Pleat", "Lapel", "Loom", "Swatch", "Gusset"],
    roots: [{ root: "vestis", meaning: "garment" }, { root: "moda", meaning: "fashion" }, { root: "tela", meaning: "fabric" }],
  },
  {
    id: "plants",
    theme: "the garden",
    triggers: ["plant", "plants", "garden", "gardening", "gardener", "flower", "flowers", "farm", "farmer", "farmers", "grow", "growing", "seed", "seeds", "florist", "houseplant", "houseplants", "produce"],
    images: ["Sprout", "Trellis", "Thicket", "Bloom", "Furrow", "Loam", "Sapling", "Fern", "Bramble", "Orchard", "Petal", "Taproot"],
    roots: [{ root: "flora", meaning: "flowers" }, { root: "hortus", meaning: "garden" }, { root: "viridis", meaning: "green" }],
  },
  {
    id: "books",
    theme: "the bookshelf",
    triggers: ["book", "books", "reading", "read", "reader", "readers", "library", "author", "authors", "writer", "writers", "writing", "novel", "novels", "story", "stories", "poetry", "journal", "journaling", "bookstore"],
    images: ["Folio", "Dogear", "Inkwell", "Spine", "Chapter", "Bookmark", "Prose", "Fable", "Verse", "Ink", "Marginalia", "Colophon"],
    roots: [{ root: "liber", meaning: "book" }, { root: "scribo", meaning: "I write" }, { root: "verba", meaning: "words" }],
  },
  {
    id: "family",
    theme: "childhood",
    triggers: ["kid", "kids", "child", "children", "parent", "parents", "parenting", "baby", "babies", "mom", "moms", "dad", "dads", "family", "families", "toddler", "toddlers", "daycare", "babysitter", "babysitting", "nanny"],
    images: ["Crayon", "Cradle", "Hopscotch", "Lullaby", "Kite", "Sandbox", "Piggyback", "Marbles", "Treehouse", "Peekaboo", "Tadpole", "Nest"],
    roots: [{ root: "nido", meaning: "nest" }, { root: "familia", meaning: "household" }, { root: "parva", meaning: "little one" }],
  },
  {
    id: "health",
    theme: "care and recovery",
    triggers: ["health", "healthy", "doctor", "doctors", "medical", "clinic", "patient", "patients", "therapy", "therapist", "mental", "wellness", "sleep", "meditation", "nurse", "nurses", "caregiver", "caregivers", "senior", "seniors", "elderly", "nutrition", "pharmacy"],
    images: ["Tonic", "Haven", "Balm", "Remedy", "Steady", "Shoreline", "Breath", "Lull", "Mend", "Sage", "Kindred", "Tide"],
    roots: [{ root: "salus", meaning: "wellbeing" }, { root: "cura", meaning: "care" }, { root: "vita", meaning: "life" }],
  },
  {
    id: "events",
    theme: "the party",
    triggers: ["event", "events", "party", "parties", "wedding", "weddings", "birthday", "ticket", "tickets", "festival", "venue", "venues", "celebration", "planner", "planning", "gathering", "rsvp"],
    images: ["Confetti", "Marquee", "Toast", "Encore", "Gather", "Sparkler", "Banquet", "Fete", "Soiree", "Revel", "Lantern", "Ribbon"],
    roots: [{ root: "festa", meaning: "feast" }, { root: "gala", meaning: "celebration" }, { root: "convivo", meaning: "I dine together" }],
  },
  {
    id: "art",
    theme: "the studio",
    triggers: ["art", "artist", "artists", "photo", "photos", "photography", "photographer", "design", "designer", "designers", "creative", "creatives", "paint", "painting", "craft", "crafts", "illustration", "creator", "creators", "video", "film", "portfolio"],
    images: ["Easel", "Canvas", "Gesso", "Sketch", "Aperture", "Gouache", "Prism", "Frame", "Charcoal", "Vellum", "Darkroom", "Umber"],
    roots: [{ root: "ars", meaning: "craft" }, { root: "lumen", meaning: "light" }, { root: "opus", meaning: "work" }],
  },
  {
    id: "games",
    theme: "the game table",
    triggers: ["game", "games", "gaming", "gamer", "gamers", "esports", "puzzle", "puzzles", "player", "players", "trivia", "boardgame", "tabletop", "arcade"],
    images: ["Gambit", "Meeple", "Joystick", "Checkmate", "Dice", "Quest", "Rook", "Respawn", "Combo", "Endgame", "Sidequest", "Wildcard"],
    roots: [{ root: "ludus", meaning: "play" }, { root: "alea", meaning: "dice" }, { root: "agon", meaning: "contest" }],
  },
  {
    id: "work",
    theme: "how teams work",
    triggers: ["team", "teams", "work", "meeting", "meetings", "project", "projects", "manager", "managers", "productivity", "task", "tasks", "office", "remote", "collaborate", "collaboration", "business", "businesses", "hiring", "recruit", "recruiting", "freelance", "freelancer", "freelancers", "client", "clients", "employee", "employees", "workflow"],
    images: ["Relay", "Cadence", "Keystone", "Huddle", "Tandem", "Lattice", "Switchboard", "Blueprint", "Bridge", "Loom", "Gearbox", "Baton"],
    roots: [{ root: "opus", meaning: "work" }, { root: "nexus", meaning: "connection" }, { root: "socius", meaning: "partner" }],
  },
  {
    id: "dev",
    theme: "the codebase",
    triggers: ["developer", "developers", "code", "coding", "software", "api", "apis", "data", "cloud", "devops", "engineer", "engineers", "engineering", "website", "websites", "database", "analytics", "automation", "ai"],
    images: ["Kernel", "Lambda", "Vector", "Circuit", "Syntax", "Daemon", "Socket", "Patch", "Schema", "Compile", "Bitfield", "Runtime"],
    roots: [{ root: "logos", meaning: "reason" }, { root: "machina", meaning: "machine" }, { root: "nexus", meaning: "connection" }],
  },
  {
    id: "earth",
    theme: "the natural world",
    triggers: ["sustainable", "sustainability", "eco", "green", "climate", "recycle", "recycling", "solar", "energy", "carbon", "waste", "compost", "environment", "environmental", "ocean", "zero"],
    images: ["Canopy", "Glacier", "Solstice", "Watershed", "Moss", "Current", "Kelp", "Rewild", "Grove", "Tidepool", "Lichen", "Fallow"],
    roots: [{ root: "terra", meaning: "earth" }, { root: "sol", meaning: "sun" }, { root: "verde", meaning: "green" }],
  },
  {
    id: "beauty",
    theme: "the vanity",
    triggers: ["beauty", "skin", "skincare", "makeup", "hair", "salon", "barber", "barbers", "nail", "nails", "cosmetic", "cosmetics", "spa", "fragrance", "perfume"],
    images: ["Dewdrop", "Blush", "Velvet", "Gloss", "Lather", "Shear", "Porcelain", "Rosewater", "Mirror", "Silk", "Pumice", "Vanity"],
    roots: [{ root: "bella", meaning: "beautiful" }, { root: "kalos", meaning: "beauty" }, { root: "aura", meaning: "glow" }],
  },
  {
    id: "transport",
    theme: "the open road",
    triggers: ["car", "cars", "auto", "vehicle", "vehicles", "driver", "drivers", "driving", "mechanic", "parking", "ride", "rides", "bike", "bikes", "bicycle", "scooter", "delivery", "deliveries", "transport", "commute", "commuters", "courier"],
    images: ["Throttle", "Gearshift", "Odometer", "Torque", "Kickstand", "Ignition", "Roadster", "Pitstop", "Axle", "Overdrive", "Tailwind", "Milepost"],
    roots: [{ root: "rota", meaning: "wheel" }, { root: "cursus", meaning: "course" }, { root: "via", meaning: "way" }],
  },
  {
    id: "sports",
    theme: "game day",
    triggers: ["soccer", "football", "basketball", "baseball", "tennis", "golf", "hockey", "league", "leagues", "swim", "swimming", "climbing", "ski", "skiing", "surf", "surfing", "skate", "skateboard", "fan", "fans", "sports", "sport"],
    images: ["Huddle", "Overtime", "Varsity", "Dugout", "Baseline", "Breakaway", "Fairway", "Rebound", "Kickoff", "Halftime", "Bullpen", "Pennant"],
    roots: [{ root: "palma", meaning: "victory" }, { root: "agon", meaning: "contest" }, { root: "stadion", meaning: "stadium" }],
  },
];

export type Vibe = "modern" | "luxury" | "playful" | "retro" | "tech";

export const VIBES: Vibe[] = ["modern", "luxury", "playful", "retro", "tech"];

// Imagery that carries a vibe on its own, used to mix with domain words.
export const VIBE_IMAGES: Record<Vibe, string[]> = {
  modern: ["Field", "Arc", "Axis", "North", "Slate", "Frame", "Grid", "Index", "Form", "Range", "Plain", "Common"],
  luxury: ["Velvet", "Atelier", "Marble", "Gilt", "Ivory", "Sable", "Regent", "Vellum", "Laurel", "Crest", "Onyx", "Amber"],
  playful: ["Pickle", "Bounce", "Sprinkle", "Wiggle", "Kazoo", "Doodle", "Pogo", "Jelly", "Noodle", "Yolk", "Zigzag", "Gumball"],
  retro: ["Diner", "Polaroid", "Rotary", "Malt", "Ticker", "Cassette", "Telegram", "Chrome", "Woodgrain", "Pinball", "Jukebox", "Soda"],
  tech: ["Signal", "Helix", "Flux", "Orbit", "Relay", "Cipher", "Photon", "Node", "Quanta", "Pixel", "Vertex", "Static"],
};

// Short tails for compound names ("Crate" + "house" = "Cratehouse").
export const COMPOUND_TAILS: Record<Vibe, string[]> = {
  modern: ["field", "works", "line", "well", "house", "ward"],
  luxury: ["hall", "mere", "court", "worth", "ton", "gate"],
  playful: ["pop", "hop", "patch", "club", "box", "bus"],
  retro: ["house", "shop", "yard", "ville", "mill", "port"],
  tech: ["base", "stack", "grid", "lab", "deck", "forge"],
};

// Word endings for coined names built on Latin/Greek roots.
export const ROOT_ENDINGS: Record<Vibe, string[]> = {
  modern: ["a", "o", "ia", "en"],
  luxury: ["elle", "ine", "ora", "ena"],
  playful: ["oo", "y", "ito", "ola"],
  retro: ["o", "ette", "ola", "ex"],
  tech: ["ix", "on", "ex", "era"],
};

// Phrase-name patterns. {A} and {B} are image words.
export const PHRASE_PATTERNS: Record<Vibe, string[]> = {
  modern: ["{A} & {B}", "{A} Studio", "Common {A}", "{A} Supply"],
  luxury: ["Maison {A}", "House of {A}", "{A} & {B}", "{A} Atelier"],
  playful: ["Little {A}", "Hey {A}", "{A} Party", "Good {A}"],
  retro: ["{A} & {B}", "The Good {A}", "Second {A}", "{A} Brothers"],
  tech: ["{A} Labs", "{A} Systems", "Project {A}", "{A} Works"],
};

export const VIBE_DETAILS: Record<Vibe, { label: string; blurb: string }> = {
  modern: { label: "Modern", blurb: "Clean, confident, quietly smart" },
  luxury: { label: "Luxury", blurb: "Refined, unhurried, detail-obsessed" },
  playful: { label: "Playful", blurb: "Warm, bright, a little cheeky" },
  retro: { label: "Retro", blurb: "Crafted, nostalgic, built to last" },
  tech: { label: "Tech", blurb: "Precise, fast, built for builders" },
};

export function isVibe(value: unknown): value is Vibe {
  return typeof value === "string" && (VIBES as string[]).includes(value);
}
