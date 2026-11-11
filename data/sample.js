export const sources = [
  { id: "s1", title: "Meeting notes, 3 Oct", confidential: false,
    text: "Decision: we will use Firebase for the app backend because it is free for students and fast to set up. Maya will own the login module. Open question: who will handle deployment?" },
  { id: "s2", title: "Meeting notes, 17 Oct", confidential: false,
    text: "Decision: switch backend to Supabase. Firebase free plan limits were hit. Raj will migrate the data by 25 Oct. Risk: the payment API key has not been transferred to the new owner." },
  { id: "s3", title: "Task board export", confidential: false,
    text: "Login module - owner Maya - in progress. Data migration - owner Raj - blocked. Deployment - owner unassigned. Report draft - owner Aisha - done." },
  { id: "s4", title: "Private chat export", confidential: true,
    text: "Maya: I am leaving the team on 30 Nov. The admin credentials are kept in the old notes file, please move them. For server access, contact the college IT head, Mr. Verma." },
];

// Mock output. Tomorrow this array is replaced by the real AI result from /api/generate.
export const mockClaims = [
  { id: "c1", type: "Decision", text: "Backend was moved from Firebase to Supabase.", sourceId: "s2", snippet: "Decision: switch backend to Supabase.", confidence: "verified" },
  { id: "c2", type: "Decision", text: "Backend is Firebase.", sourceId: "s1", snippet: "we will use Firebase for the app backend", confidence: "conflicting", note: "Conflicts with the 17 Oct decision (c1). The newer note probably wins, please confirm." },
  { id: "c3", type: "Owner", text: "Maya owns the login module (in progress).", sourceId: "s3", snippet: "Login module - owner Maya - in progress.", confidence: "verified" },
  { id: "c4", type: "Blocker", text: "Data migration is blocked. Raj owns it, due 25 Oct.", sourceId: "s2", snippet: "Raj will migrate the data by 25 Oct.", confidence: "verified" },
  { id: "c5", type: "Risk", text: "The payment API key has not been transferred to the new owner.", sourceId: "s2", snippet: "the payment API key has not been transferred to the new owner", confidence: "verified" },
  { id: "c6", type: "Next action", text: "Deployment has no owner. Someone must be assigned.", sourceId: "s3", snippet: "Deployment - owner unassigned.", confidence: "verified", note: "No reason is recorded for why it is unassigned." },
  { id: "c7", type: "Decision", text: "Deployment will be done on Vercel.", sourceId: "", snippet: "", confidence: "unverified", note: "No source supports this. Treated as an assumption." },
  { id: "c8", type: "Risk", text: "Admin credentials are stored in the old notes file and must be moved.", sourceId: "s4", snippet: "The admin credentials are kept in the old notes file, please move them.", confidence: "verified", confidential: true },
  { id: "c9", type: "Contact", text: "For server access, contact the college IT head, Mr. Verma.", sourceId: "s4", snippet: "contact the college IT head, Mr. Verma", confidence: "verified", confidential: true },
];
