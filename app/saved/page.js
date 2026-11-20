"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "../lib/useUser";
import AuthBar from "../AuthBar";

const fmt = (d) => new Date(d).toLocaleString();
const summary = (d) => Object.entries(d || {}).map(([k, v]) => k + ": " + v).join(", ");

export default function Saved() {
  const { user, loading, supabase } = useUser();
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (!user || !supabase) return;
    (async () => {
      const h = await supabase.from("handovers").select("*").order("created_at", { ascending: false });
      if (h.error) { setErr(h.error.message); return; }
      const ids = h.data.map((x) => x.id);
      let v = { data: [] }, a = { data: [] };
      if (ids.length) {
        v = await supabase.from("versions").select("*").in("handover_id", ids).order("version_no");
        a = await supabase.from("audit_log").select("*").in("handover_id", ids).order("created_at");
      }
      if (v.error || a.error) { setErr((v.error || a.error).message); return; }
      setRows(h.data.map((x) => ({ ...x, versions: v.data.filter((y) => y.handover_id === x.id), log: a.data.filter((y) => y.handover_id === x.id) })));
    })();
  }, [user, supabase]);

  return (
    <main>
      <div className="top"><Link href="/"><strong>HandoverTrail</strong></Link><AuthBar /><Link className="btn sm ghost" href="/demo">Back to demo</Link></div>
      <div className="wrap">
        <h2 style={{ marginTop: 0 }}>My handovers</h2>
        {loading && <p className="mute">Loading...</p>}
        {!loading && !supabase && <div className="card"><p className="mute">Sign-in is not configured on this deployment. You can still use the guest demo.</p></div>}
        {!loading && supabase && !user && <div className="card"><p className="mute">Sign in with Google to see the handovers you saved, their versions and the audit log. Each account only ever sees its own data.</p></div>}
        {err && <div className="card"><p style={{ color: "var(--red)" }}>Could not load your data: {err}</p></div>}
        {user && rows && rows.length === 0 && <div className="card"><p className="mute">No saved handovers yet. Open the demo while signed in, generate a handover and publish a version.</p></div>}
        {user && rows && rows.map((h) => (
          <div key={h.id} className="card">
            <strong>{h.title}</strong> <span className="mute">created {fmt(h.created_at)}</span>
            <h3>Versions</h3>
            {h.versions.length === 0 && <p className="mute">No version published yet.</p>}
            {h.versions.map((v) => {
              const ok = (v.claims || []).filter((c) => c.status === "approved");
              return (
                <details key={v.id} style={{ marginBottom: 6 }}>
                  <summary>Version {v.version_no} - {fmt(v.created_at)} - {ok.length} approved claims</summary>
                  <ul>{ok.map((c) => <li key={c.id}>{c.type}: {c.text} {c.confidential && <span className="badge conf">confidential</span>}</li>)}</ul>
                </details>
              );
            })}
            <h3>Audit log</h3>
            <ul>{h.log.map((l) => <li key={l.id} className="mute">{fmt(l.created_at)} - {l.actor_email} - <strong>{l.action}</strong> {summary(l.detail)}</li>)}</ul>
          </div>
        ))}
      </div>
    </main>
  );
}
