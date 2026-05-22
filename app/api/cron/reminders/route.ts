import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { sendReminderEmail } from "@/lib/email";
import { and, eq, isNull, lt, or } from "drizzle-orm";
import { NextResponse } from "next/server";

const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    console.log("CRON JOB STARTED");

    const threeDaysAgo = new Date(Date.now() - THREE_DAYS_IN_MS);

    const inactiveUsers = await db
      .select()
      .from(users)
      .where(
        and(
          lt(users.lastActivityDate, threeDaysAgo),
          or(
            isNull(users.lastReminderSent),
            lt(users.lastReminderSent, users.lastActivityDate)
          )
        )
      );

    console.log("INACTIVE USERS:", inactiveUsers.length);

    for (const user of inactiveUsers) {
      try {
        await sendReminderEmail({
          fullName: user.fullName,
          email: user.email,
        });

        await db
          .update(users)
          .set({
            lastReminderSent: new Date(),
          })
          .where(eq(users.id, user.id));

        console.log(`Reminder sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed for ${user.email}`);
      }
    }

    return NextResponse.json({
      success: true,
      processedUsers: inactiveUsers.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}