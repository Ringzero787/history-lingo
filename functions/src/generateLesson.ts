import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import * as admin from "firebase-admin";
import { buildLessonPrompt, SYSTEM_PROMPT } from "./prompts/lessonPrompt";
import { lessonSchema } from "./prompts/schemas";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

interface GenerateLessonRequest {
  eraId: string;
  subcategory: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  ageGroup: "child" | "teen" | "adult";
  lessonOrder: number;
}

export const generateLesson = onCall(
  {
    timeoutSeconds: 120,
    memory: "512MiB",
    enforceAppCheck: false,
    secrets: [geminiApiKey],
  },
  async (request) => {
    // Verify authentication (warn instead of throw for demo mode)
    if (!request.auth) {
      console.warn("Unauthenticated request — allowing for demo mode");
    }

    const data = request.data as GenerateLessonRequest;
    const { eraId, subcategory, difficulty, ageGroup, lessonOrder } = data;

    // Validate inputs
    if (!eraId || !subcategory || !difficulty || !ageGroup) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    const db = admin.firestore();

    // Check if lesson already exists
    const existingLessons = await db
      .collection("eras")
      .doc(eraId)
      .collection("lessons")
      .where("order", "==", lessonOrder)
      .limit(1)
      .get();

    if (!existingLessons.empty) {
      return { success: true, lessonId: existingLessons.docs[0].id };
    }

    // Get era name for the prompt
    const eraDoc = await db.collection("eras").doc(eraId).get();
    const eraName = eraDoc.exists ? eraDoc.data()?.name ?? eraId : eraId;

    // Build the prompt
    const prompt = buildLessonPrompt({
      era: eraName,
      subcategory,
      difficulty,
      ageGroup,
      lessonNumber: lessonOrder,
    });

    try {
      // Initialize Gemini client inside handler (secret available at request time)
      const genAI = new GoogleGenerativeAI(geminiApiKey.value());
      // Call Gemini 2.5 Flash-Lite
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
        systemInstruction: SYSTEM_PROMPT,
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse and validate with Zod
      const parsed = JSON.parse(responseText);
      const validated = lessonSchema.parse(parsed);

      // Calculate estimated time (about 30 seconds per question)
      const estimatedMinutes = Math.ceil(validated.questions.length * 0.5);

      // Calculate XP reward based on question count and difficulty
      const difficultyMultiplier = difficulty === "beginner" ? 1 : difficulty === "intermediate" ? 1.5 : 2;
      const xpReward = Math.round(validated.questions.length * 10 * difficultyMultiplier);

      // Store in Firestore
      const lessonDoc = {
        title: validated.title,
        description: validated.description,
        difficulty,
        ageGroup,
        order: lessonOrder,
        xpReward,
        estimatedMinutes,
        questions: validated.questions,
        funFacts: validated.funFacts,
        generatedBy: "gemini-2.5-flash-lite" as const,
        generatedAt: admin.firestore.Timestamp.now(),
        reviewed: false,
      };

      const docRef = await db
        .collection("eras")
        .doc(eraId)
        .collection("lessons")
        .add(lessonDoc);

      return { success: true, lessonId: docRef.id };
    } catch (error: any) {
      console.error("Lesson generation error:", error);

      if (error.name === "ZodError") {
        throw new HttpsError(
          "internal",
          "AI generated invalid lesson format. Please try again."
        );
      }

      throw new HttpsError(
        "internal",
        "Failed to generate lesson. Please try again."
      );
    }
  }
);
