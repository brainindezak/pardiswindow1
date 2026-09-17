import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { contactRequests } from "@/db/schema";
import { contactTopics } from "@/lib/content";

const topicValues = contactTopics.map((t) => t.value) as [string, ...string[]];

const payloadSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد.").max(120),
  phone: z
    .string()
    .trim()
    .min(8, "شماره تماس معتبر وارد کنید.")
    .max(32)
    .regex(/^[0-9+\-\s()]+$/, "شماره تماس فقط باید شامل عدد باشد."),
  email: z.union([z.literal(""), z.string().trim().email("ایمیل معتبر وارد کنید.")]).optional(),
  city: z.string().trim().max(80).optional(),
  topic: z.enum(topicValues, { message: "موضوع درخواست را انتخاب کنید." }),
  message: z.string().trim().min(10, "پیام باید حداقل ۱۰ حرف باشد.").max(2000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "درخواست نامعتبر است." }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, message: firstIssue?.message ?? "اطلاعات ارسالی معتبر نیست.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const [row] = await db
      .insert(contactRequests)
      .values({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        city: parsed.data.city || null,
        topic: parsed.data.topic,
        message: parsed.data.message,
      })
      .returning({ id: contactRequests.id });

    return NextResponse.json({ ok: true, id: row?.id });
  } catch (error) {
    console.error("contact-request-insert-failed", error);
    return NextResponse.json({ ok: false, message: "ثبت درخواست با خطا مواجه شد. دوباره تلاش کنید." }, { status: 500 });
  }
}
