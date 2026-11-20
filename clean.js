const TYPES = ["Decision", "Owner", "Blocker", "Risk", "Next action", "Contact"];

// Turns the raw AI reply into a safe list of questions.
export function cleanQuestions(raw) {
  const clean = String(raw || "").replace(/```json|```/g, "").trim();
  const data = JSON.parse(clean);
  const arr = Array.isArray(data) ? data : data.questions;
  if (!Array.isArray(arr)) throw new Error("The AI reply had no questions list");
  return arr
    .filter((q) => q && typeof q.question === "string" && q.question.trim())
    .slice(0, 6)
    .map((q, i) => ({
      id: "q" + (i + 1),
      question: q.question.trim().slice(0, 240),
      reason: String(q.reason || "").slice(0, 200),
      type: TYPES.includes(q.type) ? q.type : "Next action",
    }));
}
