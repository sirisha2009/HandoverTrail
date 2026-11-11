"use client";
import Link from "next/link";
import { useState } from "react";
import { sources, mockClaims } from "../../data/sample";

function Highlight({ text, snippet }) {
  const k = snippet ? text.indexOf(snippet) : -1;
  if (k < 0) return <span>{text}</span>;
  return (<span>{text.slice(0, k)}<mark>{snippet}</mark>{text.slice(k + snippet.length)}</span>);
}

export default function Demo() {
  const [claims, setClaims] = useState(null);
  const [role, setRole] = useState("lead");
  const [openId, setOpenId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState("");
  const [version, setVersion] = useState(0);
  const [acked, setAcked] = useState(false);

  const load = () => setClaims(mockClaims.map((c) => ({ ...c, status: "pending" })));
  const set = (id, patch) => setClaims(claims.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const pending = claims ? claims.filter((c) => c.status === "pending").length : 0;
  const visible = (c) => role === "lead" || !c.confidential;
  const srcOf = (id) => sources.find((s) => s.id === id);
  const approved = claims ? claims.filter((c) => c.status === "approved" && visible(c)) : [];
  const types = ["Decision", "Owner", "Blocker", "Risk", "Next action", "Contact"];

  return (
    <main>
      <div className="top">
        <Link href="/"><strong>HandoverTrail</strong></Link>
        <div className="row" style={{ margin: 0 }}>
          <span className="mute">View as:</span>
          <button className={"step" + (role === "lead" ? " on" : "")} onClick={() => setRole("lead")}>Project lead</button>
          <button className={"step" + (role === "joiner" ? " on" : "")} onClick={() => setRole("joiner")}>Joiner</button>
        </div>
      </div>
      <div className="wrap">
        {!claims && (
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Step 1. Connect sources</h2>
            <p className="mute">Sample project: 4 sources (notes, task board, private chat). Click below to reconstruct the project state.</p>
            {sources.filter(visible).map((s) => (<div key={s.id} className="card"><strong>{s.title}</strong> {s.confidential && <span className="badge conf">confidential</span>}<p className="mute">{s.text}</p></div>))}
            <button className="btn" onClick={load}>Generate handover</button>
          </div>
        )}
        {claims && (
          <div className="two">
            <div>
              <h2 style={{ marginTop: 0 }}>Review claims</h2>
              <p className="mute">{pending} pending. Click a claim to see its source. Approve, edit or reject each one.</p>
              {claims.filter(visible).map((c) => (
                <div key={c.id} className="card" style={{ opacity: c.status === "rejected" ? 0.45 : 1 }}>
                  <span className="badge type">{c.type}</span>
                  <span className={"badge " + c.confidence}>{c.confidence}</span>
                  {c.confidential && <span className="badge conf">confidential</span>}
                  {c.status !== "pending" && <span className="badge type">{c.status}</span>}
                  {editId === c.id ? (
                    <div><textarea rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} />
                      <div className="row"><button className="btn sm" onClick={() => { set(c.id, { text: draft, status: "approved", confidence: "verified" }); setEditId(null); }}>Save and approve</button>
                        <button className="btn sm ghost" onClick={() => setEditId(null)}>Cancel</button></div></div>
                  ) : (<p style={{ margin: "8px 0", cursor: "pointer" }} onClick={() => setOpenId(c.id)}>{c.text}</p>)}
                  {c.note && <p className="mute">Note: {c.note}</p>}
                  {editId !== c.id && (
                    <div className="row">
                      <button className="btn sm" onClick={() => set(c.id, { status: "approved" })}>Approve</button>
                      <button className="btn sm amb" onClick={() => { setEditId(c.id); setDraft(c.text); }}>Edit</button>
                      <button className="btn sm red" onClick={() => set(c.id, { status: "rejected" })}>Reject</button>
                      <button className="btn sm ghost" onClick={() => setOpenId(c.id)}>View source</button>
                    </div>)}
                </div>
              ))}
            </div>
            <div>
              <h2 style={{ marginTop: 0 }}>Evidence</h2>
              {(() => {
                const c = claims.find((x) => x.id === openId);
                if (!c) return <div className="card mute">Select a claim to see where it came from.</div>;
                const s = srcOf(c.sourceId);
                if (!s) return <div className="card"><strong>No source found.</strong><p className="mute">This claim is an unverified assumption. Do not treat it as fact.</p></div>;
                return <div className="card"><strong>{s.title}</strong><p><Highlight text={s.text} snippet={c.snippet} /></p></div>;
              })()}
              <h2>Handover</h2>
              <div className="card">
                <p className="mute">Publish when every claim is reviewed. Joiners will not see confidential items.</p>
                <button className="btn" disabled={pending > 0 || approved.length === 0} onClick={() => { setVersion(version + 1); setAcked(false); }}>Publish handover v{version + 1}</button>
              </div>
            </div>
          </div>
        )}
        {version > 0 && (
          <div className="card" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Handover v{version} ({role === "lead" ? "Project lead view" : "Joiner view"})</h2>
            {types.map((t) => { const items = approved.filter((c) => c.type === t); return items.length ? (
              <div key={t}><strong>{t}s</strong><ul>{items.map((c) => <li key={c.id}>{c.text} <span className="mute">[{srcOf(c.sourceId)?.title || "no source"}]</span></li>)}</ul></div>) : null; })}
            {acked ? <p className="ok">Receipt acknowledged.</p> : <button className="btn" onClick={() => setAcked(true)}>Acknowledge receipt</button>}
          </div>
        )}
      </div>
    </main>
  );
}
