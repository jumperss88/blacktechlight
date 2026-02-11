import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const form = await req.formData();

  const lead = {
    ts: new Date().toISOString(),
    product: String(form.get("product") ?? ""),
    name: String(form.get("name") ?? ""),
    contact: String(form.get("contact") ?? ""),
    message: String(form.get("message") ?? ""),
  };

  const filePath = path.join(process.cwd(), "leads.jsonl");
  await fs.appendFile(filePath, JSON.stringify(lead) + "\n", "utf8");

  return NextResponse.redirect(new URL("/thanks", req.url));
}
