# HandoverTrail

Evidence-linked, permission-aware knowledge handover. When a team member leaves, HandoverTrail turns scattered project activity (notes, tasks, chats) into a handover where every claim links to its source, uncertainty is flagged, a human approves it, and the incoming person only sees what they are allowed to see.

Built solo for the CodePuneThinkers Hackathon (Round 2).

**Live demo:** https://handovertrail.vercel.app (open `/demo`, no sign-in needed)

## How it works

1. **Connect:** load the built-in synthetic project, or paste your own notes (synthetic or permissioned text only).
2. **Reconstruct:** the Gemini API extracts decisions, owners, blockers, risks, next actions and contacts as structured claims.
3. **Verify:** the server re-checks each quoted snippet against the real source text. Not found means Unverified. Contradictions are flagged Conflicting.
4. **Review:** the project lead approves, edits or rejects every claim, with the exact evidence highlighted.
5. **Handover:** the lead creates a signed share link. The server includes only approved, non-confidential claims. The joiner opens it and acknowledges receipt.

## Try it (3 minutes)

1. Open `/demo`, choose **Project lead**, click **Generate handover**.
2. Click a claim to see its highlighted source. Approve, edit or reject each claim.
3. Click **Publish handover**, then **Create share link for the joiner**, then **Open joiner view**.
4. Check that confidential, rejected and pending claims are missing, then click **Acknowledge receipt**.

## Tech stack

Next.js 14 and React 18 (pages and API routes), Google Gemini API (claim extraction), three.js (landing-page scene), Node crypto HMAC-SHA256 (signed links), Vercel (hosting), GitHub.

## Run it yourself

```
npm install
GEMINI_API_KEY=your_key npm run dev
```

Optional environment variables: `GEMINI_MODEL` (preferred model name), `SHARE_SECRET` (signing secret for share links; falls back to the API key).
Never commit your API key.

## Design decisions

- The AI is not trusted: "Verified" means code found the quote in the source.
- Permissions are enforced on the server: the confidential flag comes from the source, and the share endpoint removes those claims before a link exists.
- No database in Round 2: nothing is stored on the server, and sharing is stateless through signed links.

## Known limitations

- No login yet (planned). Anyone can open `/demo`, but they only see their own session data.
- Handover version numbers live in the browser session only.
- Share links carry the data and are limited to 25 items of 200 characters each.
- Conflict detection depends on the AI model and is always reviewed by a human.

## Roadmap (Round 3)

1. Gap questions for the leaver, whose answers become new evidence-linked claims.
2. Real GitHub repository import with citations to commits and issues.
3. Persistent versions, login with roles, an audit log and revocable share links.

## AI assistance disclosure

Significant parts of the code and documents were produced with AI assistance (Claude by Anthropic). The participant directed the product, integrated, deployed and tested it. Claim extraction in the product uses the Google Gemini API. Demo data is entirely synthetic.
