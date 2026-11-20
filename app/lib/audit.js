const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const dbReady = () => Boolean(URL_ && SERVICE);

async function rest(path, opts = {}) {
  return fetch(URL_ + "/rest/v1/" + path, {
    ...opts,
    headers: { apikey: SERVICE, Authorization: "Bearer " + SERVICE, "Content-Type": "application/json", ...(opts.headers || {}) },
    cache: "no-store",
  });
}

export async function userFromRequest(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !URL_ || !ANON) return null;
  try {
    const r = await fetch(URL_ + "/auth/v1/user", { headers: { apikey: ANON, Authorization: "Bearer " + token }, cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()).id || null;
  } catch { return null; }
}

export async function logEvent(action, actor, meta = {}) {
  if (!dbReady()) return;
  try { await rest("audit_events", { method: "POST", body: JSON.stringify({ action, actor: actor || null, meta }) }); } catch {}
}

export async function recordLink(jti, createdBy, version) {
  if (!dbReady()) return;
  try { await rest("share_links", { method: "POST", body: JSON.stringify({ jti, created_by: createdBy || null, version }) }); } catch {}
}

export async function isRevoked(jti) {
  if (!jti || !dbReady()) return false;
  try {
    const r = await rest("share_links?jti=eq." + encodeURIComponent(jti) + "&select=revoked_at");
    if (!r.ok) return false;
    const rows = await r.json();
    return Boolean(rows[0] && rows[0].revoked_at);
  } catch { return false; }
}

export async function revokeLink(jti, userId) {
  if (!dbReady()) return { ok: false, error: "Database not configured." };
  const r = await rest("share_links?jti=eq." + encodeURIComponent(jti) + "&created_by=eq." + encodeURIComponent(userId), {
    method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ revoked_at: new Date().toISOString() }),
  });
  if (!r.ok) return { ok: false, error: "Could not revoke." };
  const rows = await r.json();
  return rows.length ? { ok: true } : { ok: false, error: "Link not found or not yours." };
}
