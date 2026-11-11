"use client";
import Link from "next/link";
import { useState } from "react";
const steps = [
  ["Connect", "Bring in authorised project sources: notes, tasks, chats and repository history."],
  ["Reconstruct", "AI pulls out decisions, owners, risks, blockers and next actions."],
  ["Verify", "Every claim is linked to the exact source text. Unsupported claims are flagged, never presented as fact."],
  ["Review", "A responsible person approves, edits or rejects each claim. Conflicts are shown side by side."],
  ["Handover", "The joiner gets a role-based plan. Confidential items stay hidden. They acknowledge receipt."],
];
export default function Home() {
  const [i, setI] = useState(0);
  return (
    <main>
      <section className="hero">
        <h1>Never lose project knowledge<br />when someone leaves.</h1>
        <p>HandoverTrail turns scattered project activity into a handover you can trust: every claim is traceable, uncertainty is flagged, and a human approves it.</p>
        <Link className="btn" href="/demo">Open the demo</Link>
      </section>
      <div className="wrap">
        <h2>How it works</h2>
        <div className="steps">
          {steps.map((s, k) => (
            <button key={s[0]} className={"step" + (k === i ? " on" : "")} onMouseEnter={() => setI(k)} onClick={() => setI(k)}>{k + 1}. {s[0]}</button>
          ))}
        </div>
        <div className="card"><strong>{steps[i][0]}</strong><p className="mute">{steps[i][1]}</p></div>
        <h2>Why it is different</h2>
        <div className="grid">
          <div className="card"><strong>Confidence on every claim</strong><p className="mute">Verified, Unverified or Conflicting, with the source snippet.</p></div>
          <div className="card"><strong>Human in control</strong><p className="mute">Nothing is shared until a reviewer approves it.</p></div>
          <div className="card"><strong>Permission-aware</strong><p className="mute">Joiners only see what they are allowed to see.</p></div>
        </div>
        <p style={{ textAlign: "center", margin: "40px 0" }}><Link className="btn" href="/demo">Try it with a sample project</Link></p>
      </div>
    </main>
  );
}
