import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { signToken } from "./token";
import { userFromRequest, recordLink, logEvent } from "../../lib/audit";

export const runtime = "nodejs";

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const list = Array.isArray(body.claims) ? body.claims : [];
  const items = list
    .filter((c) => c && c.status === "approved" && !c.confidential && typeof c.text === "string")
    .slice(0, 25)
    .map((c) => ({ type: String(c.type || "").slice(0, 20), text: c.text.slice(0, 200), source: String(c.sourceTitle || "").slice(0, 40) }));
  if (!items.length) return NextResponse.json({ error: "Nothing approved to share." }, { status: 400 });

  const version = Number(body.version) || 1;
  const jti = randomUUID();
  const userId = await userFromRequest(req);
  const token = signToken({ v: version, t: Date.now(), jti, items });
  await recordLink(jti, userId, version);
  await logEvent("share_created", userId, { jti, version, count: items.length });
  return NextResponse.json({ path: "/handover/" + token, jti, revocable: Boolean(userId) });
}
