"use client";
import { useState } from "react";
export default function Ack() {
  const [at, setAt] = useState("");
  return at ? <p className="ok">Receipt acknowledged at {at}.</p> : <button className="btn" onClick={() => setAt(new Date().toLocaleString())}>Acknowledge receipt</button>;
}
