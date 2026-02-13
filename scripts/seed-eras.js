/**
 * Seed script to populate Firestore `eras` collection from ERA_DEFINITIONS.
 *
 * Usage:
 *   node scripts/seed-eras.js
 *
 * Uses Firebase CLI stored access token to call Firestore REST API.
 */

const path = require("path");
const fs = require("fs");
const os = require("os");
const https = require("https");

const PROJECT_ID = "history-lingo";

// Read Firebase CLI access token
const configPath = path.join(
  os.homedir(),
  ".config",
  "configstore",
  "firebase-tools.json"
);
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
const accessToken = firebaseConfig.tokens.access_token;

// ERA_DEFINITIONS from src/constants/eras.ts
const ERA_DEFINITIONS = [
  {
    id: "ancient-egypt",
    name: "Ancient Egypt",
    description:
      "Explore the land of pharaohs, pyramids, and the mighty Nile. Discover one of the oldest civilizations in human history.",
    iconUrl: "pyramid",
    color: "#F39C12",
    order: 1,
    requiredXpToUnlock: 0,
    subcategories: [
      "Pharaohs",
      "Pyramids & Architecture",
      "Daily Life",
      "Religion & Mythology",
    ],
  },
  {
    id: "ancient-greece",
    name: "Ancient Greece",
    description:
      "From Athenian democracy to Spartan warriors, uncover the ideas and battles that shaped Western civilization.",
    iconUrl: "temple",
    color: "#3498DB",
    order: 2,
    requiredXpToUnlock: 500,
    subcategories: [
      "Democracy & Politics",
      "Philosophy",
      "Mythology",
      "Wars & Battles",
    ],
  },
  {
    id: "ancient-rome",
    name: "Ancient Rome",
    description:
      "Rise and fall of the greatest empire. From the Republic to the Empire, explore Rome's lasting legacy.",
    iconUrl: "colosseum",
    color: "#C0392B",
    order: 3,
    requiredXpToUnlock: 1500,
    subcategories: ["Republic", "Empire", "Daily Life", "Military"],
  },
  {
    id: "medieval-europe",
    name: "Medieval Europe",
    description:
      "Knights, castles, and the Black Death. Dive into the Middle Ages and its transformative events.",
    iconUrl: "castle",
    color: "#8E44AD",
    order: 4,
    requiredXpToUnlock: 3000,
    subcategories: [
      "Feudalism",
      "Crusades",
      "Black Death",
      "Culture & Religion",
    ],
  },
  {
    id: "renaissance",
    name: "The Renaissance",
    description:
      "Art, science, and rebirth. Discover how Europe emerged from the Middle Ages into a new era of creativity.",
    iconUrl: "palette",
    color: "#27AE60",
    order: 5,
    requiredXpToUnlock: 5000,
    subcategories: [
      "Art & Artists",
      "Scientific Revolution",
      "Exploration",
      "Politics & Power",
    ],
  },
  {
    id: "wwii",
    name: "World War II",
    description:
      "The conflict that shaped the modern world. Understand the causes, key battles, and aftermath of WWII.",
    iconUrl: "globe",
    color: "#2C3E50",
    order: 6,
    requiredXpToUnlock: 8000,
    subcategories: [
      "Causes",
      "Major Battles",
      "Home Front",
      "Aftermath & Legacy",
    ],
  },
];

// Convert a JS value to Firestore Value format
function toFirestoreValue(value) {
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "number") {
    if (Number.isInteger(value)) return { integerValue: String(value) };
    return { doubleValue: value };
  }
  if (typeof value === "boolean") return { booleanValue: value };
  if (value === null) return { nullValue: null };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function firestoreRequest(method, docPath, body) {
  return new Promise((resolve, reject) => {
    const urlPath = `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${docPath}`;

    const options = {
      hostname: "firestore.googleapis.com",
      path: urlPath,
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function seedEras() {
  console.log("Seeding eras collection via Firestore REST API...\n");

  for (const era of ERA_DEFINITIONS) {
    const doc = { ...era, totalLessons: 0 };
    // Remove 'id' from fields (it's the document ID)
    const { id, ...fields } = doc;

    const firestoreFields = {};
    for (const [key, value] of Object.entries(fields)) {
      firestoreFields[key] = toFirestoreValue(value);
    }

    await firestoreRequest("PATCH", `eras/${era.id}`, {
      fields: firestoreFields,
    });

    console.log(`  + ${era.id} (${era.name})`);
  }

  console.log(`\nDone! Seeded ${ERA_DEFINITIONS.length} eras.`);
}

seedEras().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
