import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

/**
 * Runs every 4 hours.
 * Computes top 100 users for alltime, daily, and weekly leaderboards.
 */
export const computeLeaderboard = onSchedule(
  {
    schedule: "0 */4 * * *",
    timeZone: "UTC",
    memory: "256MiB",
    timeoutSeconds: 120,
  },
  async () => {
    const db = admin.firestore();

    const periods: { id: string; field: string }[] = [
      { id: "alltime", field: "xp" },
      { id: "daily", field: "dailyXp" },
      { id: "weekly", field: "weeklyXp" },
    ];

    for (const period of periods) {
      const snapshot = await db
        .collection("users")
        .orderBy(period.field, "desc")
        .limit(100)
        .get();

      const rankings = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          displayName: data.displayName ?? "Unknown",
          avatarUrl: data.avatarUrl ?? "",
          xp: data[period.field] ?? 0,
          level: data.level ?? 0,
        };
      });

      await db
        .collection("leaderboard")
        .doc(period.id)
        .set({
          updatedAt: admin.firestore.Timestamp.now(),
          rankings,
        });

      console.log(
        `Updated ${period.id} leaderboard with ${rankings.length} entries.`
      );
    }
  }
);
