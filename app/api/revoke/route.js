import { NextResponse } from "next/server";
import { userFromRequest, revokeLink, logEvent } from "../../lib/audit";

export const runtime = "nodejs";

export async function POST(req) {
  const userId = await userFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Sign in to revoke links." }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const jti = String(body.jti || "");
  if (!/^[0-9a-f-]{36}$/i.test(jti)) return NextResponse.json({ error: "Bad link id." }, { status: 400 });
  const res = await revokeLink(jti, userId);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 404 });
  await logEvent("share_revoked", userId, { jti });
  return NextResponse.json({ ok: true });
}
