import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/admin/login", url.origin));
  res.cookies.set("admin", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
