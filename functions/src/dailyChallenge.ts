import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import * as admin from "firebase-admin";
import { buildLessonPrompt, SYSTEM_PROMPT } from "./prompts/lessonPrompt";
import { lessonSchema } from "./prompts/schemas";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

// All 6 eras with their IDs
const ERA_IDS = [
  "ancient_egypt",
  "ancient_greece",
  "ancient_rome",
  "medieval_europe",
  "renaissance",
  "world_war_2",
];

/**
 * Runs daily at midnight UTC.
 * Generates a daily challenge lesson using Gemini AI.
 */
export const generateDailyChallenge = onSchedule(
  {
    schedule: "0 0 * * *",
    timeZone: "UTC",
    memory: "512MiB",
    timeoutSeconds: 120,
    secrets: [geminiApiKey],
  },
  async () => {
    const db = admin.firestore();
    const today = new Date().toISOString().split("T")[0];

    // Check if today's challenge already exists
    const existing = await db.collection("dailyChallenges").doc(today).get();
    if (existing.exists) {
      console.log(`Daily challenge for ${today} already exists.`);
      return;
    }

    // Pick a random era
    const randomEraId = ERA_IDS[Math.floor(Math.random() * ERA_IDS.length)];
    const eraDoc = await db.collection("eras").doc(randomEraId).get();
    const eraData = eraDoc.data();
    const eraName = eraData?.name ?? randomEraId;
    const subcategories: string[] = eraData?.subcategories ?? [];
    const randomSubcategory =
      subcategories.length > 0
        ? subcategories[Math.floor(Math.random() * subcategories.length)]
        : eraName;

    // Build prompt for advanced-level challenge
    const prompt = buildLessonPrompt({
      era: eraName,
      subcategory: randomSubcategory,
      difficulty: "advanced",
      ageGroup: "adult",
      lessonNumber: 0, // special: daily challenge
    });

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey.value());
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);
      const validated = lessonSchema.parse(parsed);

      const estimatedMinutes = Math.ceil(validated.questions.length * 0.5);
      const xpReward = Math.round(validated.questions.length * 10 * 2); // advanced = 2x

      // Store lesson in eras collection
      const lessonDoc = {
        title: `Daily Challenge: ${validated.title}`,
        description: validated.description,
        difficulty: "advanced" as const,
        ageGroup: "adult" as const,
        order: -1, // Special: not part of normal sequence
        xpReward,
        estimatedMinutes,
        questions: validated.questions,
        funFacts: validated.funFacts,
        generatedBy: "gemini-2.5-flash-lite" as const,
        generatedAt: admin.firestore.Timestamp.now(),
        reviewed: false,
      };

      const lessonRef = await db
        .collection("eras")
        .doc(randomEraId)
        .collection("lessons")
        .add(lessonDoc);

      // Store daily challenge reference
      await db
        .collection("dailyChallenges")
        .doc(today)
        .set({
          date: today,
          eraId: randomEraId,
          eraName,
          lessonId: lessonRef.id,
          title: validated.title,
          description: validated.description,
          xpBonus: 50,
          createdAt: admin.firestore.Timestamp.now(),
        });

      console.log(
        `Generated daily challenge for ${today}: ${validated.title} (${randomEraId}/${lessonRef.id})`
      );
    } catch (error: any) {
      console.error("Daily challenge generation error:", error);
      throw error;
    }
  }
);
