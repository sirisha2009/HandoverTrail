const TYPES = ["Decision", "Owner", "Blocker", "Risk", "Next action", "Contact"];

function locate(text, snippet) {
  const words = String(snippet || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  const esc = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+");
  const m = new RegExp(esc, "i").exec(text);
  return m ? m[0] : null;
}

export function parseClaims(raw) {
  const clean = String(raw || "").replace(/```json|```/g, "").trim();
  const data = JSON.parse(clean);
  const arr = Array.isArray(data) ? data : data.claims;
  if (!Array.isArray(arr)) throw new Error("The AI reply had no claims list");
  return arr;
}

// Never trust the AI: re-check every quote against the real source text.
export function verifyClaims(rawClaims, sources) {
  return rawClaims.slice(0, 40).map((c, i) => {
    const src = sources.find((s) => s.id === c.sourceId);
    const text = String(c.text || "").slice(0, 400);
    const type = TYPES.includes(c.type) ? c.type : "Next action";
    const out = { id: "c" + (i + 1), type, text, sourceId: "", snippet: "", confidence: "unverified", note: c.note ? String(c.note).slice(0, 300) : "" };
    if (src) {
      out.sourceId = src.id;
      if (src.confidential) out.confidential = true;
      const found = locate(src.text, c.snippet);
      if (found) {
        out.snippet = found;
        out.confidence = c.confidence === "conflicting" ? "conflicting" : "verified";
      } else {
        out.note = (out.note ? out.note + " " : "") + "The quoted evidence was not found in the source, so this is treated as an assumption.";
      }
    } else {
      out.note = (out.note ? out.note + " " : "") + "No source supports this claim. Treated as an assumption.";
    }
    return out;
  });
}
