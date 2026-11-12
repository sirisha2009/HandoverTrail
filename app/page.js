"use client";
import Link from "next/link";
import { useState } from "react";
const steps = [
  ["Connect", "Bring in authorised project sources: notes, tasks, chats and repo history."],
  ["Reconstruct", "AI pulls out decisions, owners, risks, blockers and next actions."],
  ["Verify", "Every claim links to the exact source text. Unsupported claims are flagged, never shown as fact."],
  ["Review", "A responsible person approves, edits or rejects each claim. Conflicts appear side by side."],
  ["Handover", "The joiner gets a role-based plan. Confidential items stay hidden. They acknowledge receipt."],
];
const R = 130, C = 170;
export default function Home() {
  const [i, setI] = useState(0);
  return (
    <main>
      <section className="hero">
        <span className="pill">Evidence-linked. Permission-aware. Human-approved.</span>
        <h1>Never lose project knowledge<br /><span className="grad">when someone leaves.</span></h1>
        <p>HandoverTrail turns scattered notes, tasks and chats into a handover you can trust. Every claim is traceable to its source, uncertainty is flagged, and a person makes the final call.</p>
        <div className="btns"><Link className="btn" href="/demo">Open the demo</Link><a className="btn ghost" href="#how">How it works</a></div>
        <div className="chips"><span className="chip">Every claim cited</span><span className="chip">Conflicts flagged</span><span className="chip">Role-based views</span><span className="chip">Human approval</span></div>
      </section>
      <section className="sec" id="how">
        <h2>How it works</h2>
        <p className="sub">Five steps from scattered activity to an approved handover. Hover or tap a step.</p>
        <div className="wheelbox">
          <div className="ring" />
          {steps.map((s, k) => {
            const a = (k / 5) * 2 * Math.PI - Math.PI / 2;
            return (<button key={s[0]} className={"node" + (k === i ? " on" : "")} style={{ left: C + R * Math.cos(a), top: C + R * Math.sin(a) }}
              onMouseEnter={() => setI(k)} onClick={() => setI(k)} aria-label={s[0]}>{k + 1}</button>);
          })}
          <div className="hub"><strong>{steps[i][0]}</strong><span>Step {i + 1} of 5</span></div>
        </div>
        <div className="card cap"><p style={{ margin: 0 }}>{steps[i][1]}</p></div>
      </section>
      <section className="sec">
        <h2>Why it is different</h2>
        <p className="sub">Not another summariser. A handover that shows how sure it is.</p>
        <div className="cards3">
          <div className="card"><div className="ico">🔎</div><strong>Confidence on every claim</strong><p className="mute">Verified, Unverified or Conflicting, with the exact source snippet highlighted.</p></div>
          <div className="card"><div className="ico">✅</div><strong>Human in control</strong><p className="mute">Nothing is shared until a reviewer approves, edits or rejects it.</p></div>
          <div className="card"><div className="ico">🔒</div><strong>Permission-aware</strong><p className="mute">Joiners only see what they are allowed to see. Confidential items stay hidden.</p></div>
        </div>
        <p style={{ textAlign: "center", marginTop: 36 }}><Link className="btn" href="/demo">Try it with a sample project</Link></p>
      </section>
      <p className="foot">HandoverTrail · built for the CodePuneThinkers Hackathon · demo uses synthetic data</p>
    </main>
  );
}
