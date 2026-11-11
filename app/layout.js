import "./globals.css";
export const metadata = { title: "HandoverTrail", description: "Evidence-linked, permission-aware knowledge handover" };
export default function RootLayout({ children }) {
  return (<html lang="en"><body>{children}</body></html>);
}
