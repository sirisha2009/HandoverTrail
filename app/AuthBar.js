"use client";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "./lib/useUser";

const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
const demoPass = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

export default function AuthBar() {
  const { user, loading, supabase } = useUser();
  const [msg, setMsg] = useState("");
  if (!supabase || loading) return null;
  const signIn = () => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + window.location.pathname } });
  const demo = async () => {
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPass });
    if (error) setMsg("Demo sign-in failed: " + error.message);
  };
  if (!user) {
    const hasDemo = demoEmail && demoPass;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
        <div className="row" style={{ margin: 0 }}>
          <button className="btn sm" onClick={signIn}>Sign in with Google</button>
          {hasDemo && <button className="btn sm amb" onClick={demo}>Use demo account</button>}
        </div>
        {hasDemo && (
          <details className="mute" style={{ fontSize: 12 }}>
            <summary>Demo account details</summary>
            Email: {demoEmail}<br />Password: {demoPass}<br />Shared and public. Synthetic data only.
          </details>
        )}
        {msg && <span style={{ color: "var(--red)", fontSize: 12 }}>{msg}</span>}
      </div>
    );
  }
  return (
    <div className="row" style={{ margin: 0 }}>
      <Link className="btn sm ghost" href="/saved">My handovers</Link>
      <span className="mute">{user.email}</span>
      <button className="btn sm ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}
