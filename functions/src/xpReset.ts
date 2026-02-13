import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

const BATCH_SIZE = 499;

/**
 * Runs daily at midnight UTC.
 * Resets dailyXp to 0 for all users.
 */
export const resetDailyXp = onSchedule(
  {
    schedule: "0 0 * * *",
    timeZone: "UTC",
    memory: "256MiB",
    timeoutSeconds: 300,
  },
  async () => {
    const db = admin.firestore();
    const snapshot = await db
      .collection("users")
      .where("dailyXp", ">", 0)
      .get();

    if (snapshot.empty) {
      console.log("No users with dailyXp to reset.");
      return;
    }

    let batch = db.batch();
    let count = 0;

    for (const doc of snapshot.docs) {
      batch.update(doc.ref, { dailyXp: 0 });
      count++;
      if (count % BATCH_SIZE === 0) {
        await batch.commit();
        batch = db.batch();
      }
    }

    if (count % BATCH_SIZE !== 0) {
      await batch.commit();
    }

    console.log(`Reset dailyXp for ${count} users.`);
  }
);

/**
 * Runs every Monday at midnight UTC.
 * Resets weeklyXp to 0 for all users.
 */
export const resetWeeklyXp = onSchedule(
  {
    schedule: "0 0 * * 1",
    timeZone: "UTC",
    memory: "256MiB",
    timeoutSeconds: 300,
  },
  async () => {
    const db = admin.firestore();
    const snapshot = await db
      .collection("users")
      .where("weeklyXp", ">", 0)
      .get();

    if (snapshot.empty) {
      console.log("No users with weeklyXp to reset.");
      return;
    }

    let batch = db.batch();
    let count = 0;

    for (const doc of snapshot.docs) {
      batch.update(doc.ref, { weeklyXp: 0 });
      count++;
      if (count % BATCH_SIZE === 0) {
        await batch.commit();
        batch = db.batch();
      }
    }

    if (count % BATCH_SIZE !== 0) {
      await batch.commit();
    }

    console.log(`Reset weeklyXp for ${count} users.`);
  }
);
