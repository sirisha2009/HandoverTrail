# Handover Trail

**Evidence-linked, permission-aware knowledge handover.**  
Built for the **CodePune Thinkers Hackathon** (Round 3 Finalist — Top 50) by **Sirisha Arora** (`HandoverTrail`).

- **Live Product:** [https://handovertrail.vercel.app](https://handovertrail.vercel.app) (Demo at `/demo`)
- **Judge Demo Account:** `judge.demo@handovertrail.dev` Password: 123456 (Sign-up is also open)

---

## Overview

When a team member leaves a project, critical context gets scattered across meeting notes, tasks, chat logs, and repositories. **Handover Trail** ingests authorized project sources, reconstructs structured claims (decisions, owners, blockers, risks, next actions, and contacts), and anchors every claim to an exact quote in the original source.

- **Zero Blind Trust:** Server-side verification re-checks every AI-extracted quote against the actual source text. Unmatched quotes are flagged as `Unverified`, and contradictions are flagged as `Conflicting`.
- **Gap Capture:** Targeted questions surface missing owners, reasons, or open context for the departing member to answer as first-hand claims.
- **Controlled Sharing:** A human lead reviews, edits, approves, or rejects every claim. The server strips all confidential, rejected, and pending items before generating a tamper-evident **HMAC-SHA256** share link for the incoming team member.

---

## Key Features

- **Multi-Source Ingestion:** Built-in synthetic project, paste-your-own-notes (up to 30,000 characters), and public GitHub repository import (commits, issues, and pull requests with direct source URLs).
- **Evidence-Linked Extraction:** Powered by Google Gemini (`gemini-3.8-flash` with fallback to `gemini-3.5-flash`) to extract structured claims with exact source citations.
- **Server-Side Verification (`verify.js`):** Independently validates quotes against source text, coerces unknown types, flags conflicts, and enforces source-level confidentiality flags.
- **Targeted Gap Questions (`/api/gaps`):** Identifies missing context and turns the leaver's answers into verified first-hand claims.
- **Human-in-the-Loop Review:** Approve, edit, or reject claims in an interactive evidence workspace; publishing requires zero pending claims.
- **Role-Based Access & Persistence:** Authenticated `Project Lead` and `Joiner` roles backed by Supabase Auth & Postgres, with saved handover versions (`My handovers`) and an audit log of review actions.
- **Signed Share Links (`/api/share`):** Generates HMAC-SHA256 signed URLs containing only approved, non-confidential claims, plus joiner receipt acknowledgement.
- **Resilient Failure Handling:** Per-model timeouts, 503 retries, clean JSON error boundaries, and a built-in **offline sample fallback** so evaluation never dead-ends on free-tier API rate limits.

---

## Quick Judge Walkthrough (~3 Minutes)

1. Open `/demo`, sign in (e.g., `judge.demo@handovertrail.dev`), and select **Project lead**.
2. Click **Generate handover** on the sample project, paste your own notes, or import a public GitHub repo (such as `sirisha2009/HandoverTrail`). *(If the AI service is rate-limited, click **Show the offline sample instead** to continue seamlessly.)*
3. Click any claim or **View source** to inspect the exact highlighted quote in the original document.
4. Click **Find gaps** and answer a prompt to add a first-hand claim.
5. Approve, edit, or reject all claims, then click **Publish handover**.
6. Generate a share link, open the joiner view in a new tab/window to verify confidential and rejected items are stripped, and click **Acknowledge receipt**.
7. Visit **My handovers** to view saved versions.

---

## Tech Stack

- **Framework:** Next.js 14 / React 18 (App Router & API Routes)
- **AI Models:** Google Gemini API (`gemini-3.8-flash`, `gemini-3.5-flash`)
- **Database & Auth:** Supabase (PostgreSQL, Row-Level Security, Auth)
- **Security:** Node `crypto` (HMAC-SHA256 signed payloads & server-side permission filtering)
- **Frontend Visuals:** Three.js (3D interactive landing page)
- **Deployment:** Vercel

---

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/sirisha2009/HandoverTrail.git](https://github.com/sirisha2009/HandoverTrail.git)
   cd HandoverTrail
