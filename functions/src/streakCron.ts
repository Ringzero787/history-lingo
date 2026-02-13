import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

/**
 * Runs daily at 00:05 UTC.
 * Resets streaks for users who missed yesterday, consuming a streak freeze if available.
 */
export const resetBrokenStreaks = onSchedule(
  {
    schedule: "5 0 * * *",
    timeZone: "UTC",
    memory: "256MiB",
    timeoutSeconds: 300,
  },
  async () => {
    const db = admin.firestore();

    // Yesterday's date string
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Query users with active streaks who were NOT active yesterday
    const snapshot = await db
      .collection("users")
      .where("currentStreak", ">", 0)
      .where("lastActiveDate", "<", yesterdayStr)
      .get();

    if (snapshot.empty) {
      console.log("No broken streaks to process.");
      return;
    }

    console.log(`Processing ${snapshot.size} users with broken streaks.`);

    // Process in batches of 499 (Firestore limit is 500 per batch)
    const BATCH_SIZE = 499;
    let batch = db.batch();
    let count = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const streakFreezes = data.streakFreezes ?? 0;

      if (streakFreezes > 0) {
        // Consume a freeze, keep streak
        batch.update(doc.ref, {
          streakFreezes: admin.firestore.FieldValue.increment(-1),
        });
      } else {
        // Reset streak
        batch.update(doc.ref, {
          currentStreak: 0,
        });
      }

      count++;
      if (count % BATCH_SIZE === 0) {
        await batch.commit();
        batch = db.batch();
      }
    }

    // Commit remaining
    if (count % BATCH_SIZE !== 0) {
      await batch.commit();
    }

    console.log(`Processed ${count} users.`);
  }
);
