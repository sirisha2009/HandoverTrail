import { NextResponse } from "next/server";
import { signToken } from "./token";

export const runtime = "nodejs";

// The server, not the browser, decides what a joiner may receive:
// only approved claims, and never anything marked confidential.
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const list = Array.isArray(body.claims) ? body.claims : [];
  const items = list
    .filter((c) => c && c.status === "approved" && !c.confidential && typeof c.text === "string")
    .slice(0, 25)
    .map((c) => ({ type: String(c.type || "").slice(0, 20), text: c.text.slice(0, 200), source: String(c.sourceTitle || "").slice(0, 40) }));
  if (!items.length) return NextResponse.json({ error: "Nothing approved to share." }, { status: 400 });
  const token = signToken({ v: Number(body.version) || 1, t: Date.now(), items });
  return NextResponse.json({ path: "/handover/" + token });
}
