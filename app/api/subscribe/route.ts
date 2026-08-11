import { subscribers } from "../../../db/schema";
import { ensureDbSchema, getDb } from "../../../db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { email?: string; locale?: string };
    const email = payload.email?.trim().toLowerCase() ?? "";
    const locale = payload.locale?.trim().slice(0, 12) || "en";

    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await ensureDbSchema();
    const db = getDb();
    const [created] = await db
      .insert(subscribers)
      .values({ email, locale })
      .onConflictDoNothing({ target: subscribers.email })
      .returning({ id: subscribers.id });

    return Response.json(
      { subscribed: true, alreadySubscribed: !created },
      { status: created ? 201 : 200 },
    );
  } catch (error) {
    console.error("Subscription request failed", error);
    return Response.json(
      { error: "We could not save your subscription. Please try again." },
      { status: 500 },
    );
  }
}
