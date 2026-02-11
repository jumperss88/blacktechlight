import "dotenv/config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") || "");

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: "ADMIN_PASSWORD not set" }, { status: 500 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // secure: true, // включишь на проде при https
  });
  return res;
}
