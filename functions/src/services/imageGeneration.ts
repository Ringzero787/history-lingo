import { GoogleGenAI } from "@google/genai";
import * as admin from "firebase-admin";

/**
 * Slugify a character name for use as a document/file ID.
 * "Julius Caesar" → "julius-caesar"
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Look up or generate a cartoon portrait of a historical figure.
 * Uses Imagen 3 for generation, Firebase Storage for file hosting,
 * and Firestore `characterImages/{slug}` for caching.
 *
 * Returns the public image URL, or null on failure (non-blocking).
 */
export async function getOrGenerateCharacterImage(
  characterName: string,
  apiKey: string
): Promise<string | null> {
  const slug = slugify(characterName);
  if (!slug) return null;

  const db = admin.firestore();
  const cacheRef = db.collection("characterImages").doc(slug);

  // 1. Check Firestore cache
  const cacheDoc = await cacheRef.get();
  if (cacheDoc.exists) {
    const data = cacheDoc.data();
    if (data?.imageUrl) {
      console.log(`Character image cache hit: ${slug}`);
      return data.imageUrl as string;
    }
  }

  // 2. Generate with Imagen 3
  console.log(`Generating character image for: ${characterName} (${slug})`);
  const genai = new GoogleGenAI({ apiKey });

  const response = await genai.models.generateImages({
    model: "imagen-3.0-generate-002",
    prompt:
      `Cartoon-style portrait of ${characterName}, fun and colorful illustration ` +
      `for an educational history app, friendly expression, historically accurate ` +
      `clothing and accessories, solid color background, digital art style, ` +
      `suitable for all ages`,
    config: {
      numberOfImages: 1,
      outputMimeType: "image/png",
    },
  });

  const generatedImage = response.generatedImages?.[0];
  if (!generatedImage?.image?.imageBytes) {
    console.warn(`Imagen returned no image for: ${characterName}`);
    return null;
  }

  // 3. Upload to Firebase Storage
  const bucket = admin.storage().bucket();
  const filePath = `characters/${slug}.png`;
  const file = bucket.file(filePath);

  const imageBuffer = Buffer.from(generatedImage.image.imageBytes, "base64");

  await file.save(imageBuffer, {
    metadata: { contentType: "image/png" },
  });

  // Make publicly readable
  await file.makePublic();

  const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

  // 4. Cache in Firestore
  await cacheRef.set({
    name: characterName,
    imageUrl,
    generatedAt: admin.firestore.Timestamp.now(),
  });

  console.log(`Character image generated and cached: ${slug} → ${imageUrl}`);
  return imageUrl;
}
