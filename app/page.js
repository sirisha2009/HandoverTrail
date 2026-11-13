"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import "./landing.css";
const Scene = dynamic(() => import("./Scene"), { ssr: false });

const D = {
  brackets: <path d="M30 20 L8 40 L30 60 M70 20 L92 40 L70 60 M58 12 L42 68" />,
  spark: <path d="M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z" />,
  search: (<g><circle cx="40" cy="40" r="26" /><path d="M60 60 L90 90" /></g>),
  check: <path d="M10 48 L36 74 L90 16" />,
  star: <path d="M50 8 L61 38 L93 40 L68 60 L77 92 L50 74 L23 92 L32 60 L7 40 L39 38 Z" />,
  lock: (<g><rect x="20" y="44" width="60" height="44" rx="6" /><path d="M32 44 V30 a18 18 0 0 1 36 0 V44" /></g>),
};
function Doodle({ k }) { return (<svg viewBox="0 0 100 100" className="doodle draw">{D[k]}</svg>); }

const steps = [
  ["Connect", "Bring in authorised project sources: notes, tasks, chats and repo history.", "brackets"],
  ["Reconstruct", "AI pulls out decisions, owners, risks, blockers and next actions.", "spark"],
  ["Verify", "Every claim links to the exact source text. Unsupported claims are flagged, never shown as fact.", "search"],
  ["Review", "A person approves, edits or rejects each claim. Conflicts appear side by side.", "check"],
  ["Handover", "The joiner gets a role-based plan. Confidential items stay hidden. They acknowledge receipt.", "star"],
];
function Tilt({ children }) {
  const r = useRef(null);
  const mv = (e) => { const b = r.current.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5; r.current.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`; };
  return (<div ref={r} className="tilt reveal" onMouseMove={mv} onMouseLeave={() => (r.current.style.transform = "")}>{children}</div>);
}
export default function Home() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => { if (hold) return; const t = setInterval(() => setI((v) => (v + 1) % 5), 4500); return () => clearInterval(t); }, [hold]);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  const go = (k) => { setHold(true); setI(((k % 5) + 5) % 5); };
  return (
    <main className="L">
      <section className="hero">
        <Scene /><div className="vig" /><div className="beam a" /><div className="beam b" />
        <div className="htxt">
          <div className="tag">CODEPUNETHINKERS · ROUND 2</div>
          <h1>Never lose project knowledge <span className="und amber">when someone leaves.<svg viewBox="0 0 300 20" className="doodle draw" preserveAspectRatio="none"><path d="M5 12 C 40 2, 70 20, 110 10 S 190 2, 230 12 S 280 14, 295 6" /></svg></span></h1>
          <p className="lead">HandoverTrail turns scattered notes, tasks and chats into a handover you can trust. Every claim is traceable to its source, uncertainty is flagged, and a person makes the final call.</p>
          <div className="btns"><Link className="btn" href="/demo">Open the demo</Link><a className="btn ghost" href="#how">How it works</a></div>
          <div className="note"><svg viewBox="0 0 120 90" className="doodle draw"><path d="M5 80 C 30 80, 90 60, 100 12" /><path d="M84 26 L101 10 L113 30" /></svg>every claim is cited!</div>
        </div>
      </section>
      <section className="sec" id="how">
        <h2 className="reveal">How it works</h2>
        <p className="sub reveal">Five steps from scattered activity to an approved handover.</p>
        <div className="stage reveal">
          <div className="ring3" style={{ transform: `rotateY(${-i * 72}deg)` }}>
            {steps.map((s, k) => (
              <div key={s[0]} className={"c3" + (k === i ? " on" : "")} style={{ transform: `rotateY(${k * 72}deg) translateZ(var(--z))` }} onClick={() => go(k)}>
                <div className="n">STEP 0{k + 1}</div><h3>{s[0]}</h3><p>{s[1]}</p><Doodle k={s[2]} />
              </div>
            ))}
          </div>
        </div>
        <div className="ctl"><button className="btn ghost sm" onClick={() => go(i - 1)}>Prev</button><button className="btn ghost sm" onClick={() => go(i + 1)}>Next</button></div>
      </section>
      <section className="sec">
        <h2 className="reveal">Why it is different</h2>
      
        <div className="g3">
          <Tilt><Doodle k="search" /><h3>Confidence on every claim</h3><p>Verified, Unverified or Conflicting, with the exact source snippet highlighted.</p></Tilt>
          <Tilt><Doodle k="check" /><h3>Human in control</h3><p>Nothing is shared until a reviewer approves, edits or rejects it.</p></Tilt>
          <Tilt><Doodle k="lock" /><h3>Permission-aware</h3><p>Joiners only see what they are allowed to see. Confidential items stay hidden.</p></Tilt>
        </div>
      </section>
      <section className="sec cta reveal">
        <Doodle k="star" /><h2>Try the handover yourself</h2><p className="sub">Load a sample project, review the claims and publish a handover.</p>
        <Link className="btn" href="/demo">Open the demo</Link>
      </section>
    </main>
  );
}
