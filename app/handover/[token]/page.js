import Link from "next/link";
import { readToken } from "../../api/share/token";
import { isRevoked, logEvent } from "../../lib/audit";
import Ack from "./Ack";
export const dynamic = "force-dynamic";
const TYPES = ["Decision", "Owner", "Blocker", "Risk", "Next action", "Contact"];

export default async function Handover({ params }) {
  let data = readToken(decodeURIComponent(params.token));
  let revoked = false;
  if (data && data.jti) {
    revoked = await isRevoked(data.jti);
    await logEvent(revoked ? "view_blocked_revoked" : "share_viewed", null, { jti: data.jti });
  }
  if (revoked) data = null;
  return (
    <main>
      <div className="top"><Link href="/"><strong>HandoverTrail</strong></Link><span className="badge type">Viewing as: Joiner</span></div>
      <div className="wrap">
        {!data ? (
          <div className="card"><h2 style={{ marginTop: 0 }}>This link is not valid</h2><p className="mute">It may be incomplete, altered or revoked. Ask the project lead for a new link.</p></div>
        ) : (
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Handover v{data.v}</h2>
            <p className="mute">Shared by the project lead. This shows only approved items. Confidential items are not included.</p>
            {TYPES.map((t) => { const items = data.items.filter((c) => c.type === t); return items.length ? (
              <div key={t}><strong>{t}s</strong><ul>{items.map((c, i) => <li key={i}>{c.text} <span className="mute">[{c.source || "no source"}]</span></li>)}</ul></div>) : null; })}
            <Ack />
          </div>
        )}
      </div>
    </main>
  );
}
