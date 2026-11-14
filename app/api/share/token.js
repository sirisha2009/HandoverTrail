import crypto from "crypto";
const secret = () => process.env.SHARE_SECRET || process.env.GEMINI_API_KEY || "dev-only-secret";
const sign = (body) => crypto.createHmac("sha256", secret()).update(body).digest("base64url");

export function signToken(obj) {
  const body = Buffer.from(JSON.stringify(obj)).toString("base64url");
  return body + "." + sign(body);
}
// Returns the data only if the signature matches. Altered links return null.
export function readToken(tok) {
  try {
    const [body, sig] = String(tok).split(".");
    if (!body || !sig) return null;
    const a = Buffer.from(sig), b = Buffer.from(sign(body));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    return JSON.parse(Buffer.from(body, "base64url").toString());
  } catch { return null; }
}
