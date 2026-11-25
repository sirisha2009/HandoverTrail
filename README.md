# HandoverTrail
### Don't Let Critical Knowledge Leave With People.

**Evidence-linked. Permission-aware. Human-verified knowledge handover.**

Built solo by **Sirisha Arora** 

When an employee leaves a team, their knowledge shouldn't leave with them. Yet critical decisions, technical context, unresolved issues and project dependencies are often scattered across notes, tasks, conversations and repositories.

**HandoverTrail transforms scattered project activity into a structured, evidence-backed knowledge handover.**

It uses AI to reconstruct project knowledge, verifies every quoted piece of evidence against its original source, flags uncertainty and contradictions, and keeps a human in control of every approval. The incoming team member receives only approved, non-confidential information.

**Live Product:** https://handovertrail.vercel.app  
**Demo:** https://handovertrail.vercel.app/demo  
**Source Code:** https://github.com/sirisha2009/HandoverTrail

---

## 1. The Problem

When someone leaves a project or organisation, teams often struggle with:

- Lost context behind important technical decisions.
- Unclear ownership of tasks and responsibilities.
- Unresolved blockers and dependencies.
- Scattered information across repositories and documentation.
- Missing contacts and next steps.
- Confidential information being shared with people who shouldn't access it.

Traditional handovers depend heavily on manually written documents and the availability of the departing employee.

HandoverTrail addresses this problem by turning existing project activity into a traceable, reviewable and permission-aware handover.

## 2. How HandoverTrail Works

The platform follows a seven-stage workflow.

**01 — Connect Sources**

Start with the built-in synthetic project, paste project notes (up to 30,000 characters), or import a public GitHub repository.

GitHub import supports commits, issues and pull requests.

**02 — Reconstruct Project Knowledge**

The Google Gemini API analyses the available sources and extracts structured claims covering:

- Decisions
- Owners
- Blockers
- Risks
- Next actions
- Important contacts

**03 — Verify Every Claim**

HandoverTrail does not blindly trust AI-generated information.

Every extracted quote is re-checked on the server against the original source text.

- Verified: The exact quoted text exists in the source.
- Unverified: The supporting evidence cannot be located.
- Conflicting: Contradictory information has been identified.

Every claim retains its source reference, allowing reviewers to inspect the original evidence.

**04 — Ask the Leaver**

The system identifies missing context, such as unresolved questions, missing owners and unexplained decisions.

It generates targeted follow-up questions for the departing team member.

Their answers are added as new claims and explicitly marked as first-hand statements.

**05 — Human Review and Approval**

The project lead reviews every claim using its supporting evidence.

Each claim can be:
- Approved
- Edited
- Rejected

Publishing requires all claims to have a resolved review status, with no pending claims remaining.

**06 — Securely Publish and Share**

The project lead publishes a handover version and generates a signed share link.

Before generating the link, the server filters out:
- Confidential claims
- Rejected claims
- Pending claims

HMAC-SHA256 signatures protect the shared payload against tampering. Share-link revocation is supported through the backend API.

**07 — Receive and Acknowledge**

The incoming team member opens the shared handover, reviews the approved information and acknowledges receipt.

---

## 3. What's New in Round 3?

Three major improvements were committed in Round 2 and delivered in Round 3.

| Improvement | What was delivered |
|---|---|
| Leaver gap questions | Targeted questions that identify missing project context and capture first-hand answers. |
| Real GitHub integration | Import of public repositories, including commits, issues and pull requests, with source references. |
| Persistence and access control | Supabase-backed saved versions, authentication, role selection and an audit log. |

Additional improvements include:

- Updated Gemini model identifiers.
- Automatic model fallback and timeout handling.
- Structured API error responses.
- Improved rate-limit handling.
- Offline sample workflow for uninterrupted evaluation.
- Resolved routing and file-naming issues.

## 4. Technical Architecture

HandoverTrail uses a server-controlled pipeline to ensure that AI-generated information is checked before it becomes part of a published handover.

| Layer | Implementation |
|---|---|
| Frontend | Next.js 14, React 18 |
| AI processing | Google Gemini API |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Source integration | GitHub API |
| Evidence verification | Custom server-side verification logic |
| Secure sharing | Node.js Crypto, HMAC-SHA256 |
| Landing page | Three.js |
| Deployment | Vercel |
| Version control | GitHub |

### Processing Pipeline

1. **Source ingestion:** Project information is collected from synthetic data, user-provided notes or public GitHub repositories.
2. **AI extraction:** The server sends source material to Gemini with structured extraction instructions.
3. **Evidence verification:** `verify.js` checks each extracted quote against the original source.
4. **Gap analysis:** `/api/gaps` identifies missing context and generates follow-up questions.
5. **Human review:** The project lead reviews and resolves every claim.
6. **Version persistence:** Published handovers and audit events are stored in Supabase.
7. **Secure sharing:** `/api/share` filters claims, signs the payload and generates a shareable link.
8. **Joiner access:** `/handover/[token]` validates the signature and displays the permitted information.

## 5. Key Engineering Decisions

**AI is an assistant, not the source of truth.**

The application distinguishes between AI-generated interpretations and verifiable evidence. A claim is marked Verified only when server-side code finds its exact quoted text in the original source.

**Security is enforced server-side.**

The confidential flag is inherited from the original source rather than trusted from the AI response. Confidential claims are removed before a share link is generated.

**Prompt injection is treated as a security concern.**

Imported source material is treated as data, not instructions. The model is explicitly instructed to ignore commands embedded within source content.

**Human approval remains mandatory.**

AI-generated claims are not treated as organisational truth until a human reviews and approves them.

**Failure should not interrupt the workflow.**

The application implements model fallbacks, timeouts, structured error handling and an offline sample experience to handle Gemini API rate limits and service interruptions.

**Sharing must be tamper-evident.**

HMAC-SHA256 signatures are used to detect modifications to shared payloads.

## 6. Testing and Validation

The application has undergone manual end-to-end testing on its live Vercel deployment, along with crafted-input testing.

| Test scenario | Result |
|---|---|
| Generate claims from the sample project | Passed |
| Highlight exact supporting source evidence | Passed |
| Approve, edit and reject claims | Passed |
| Prevent publishing with pending claims | Passed |
| Identify contradictory claims | Passed |
| Exclude confidential and rejected claims from sharing | Passed |
| Reject altered or tampered share links | Passed |
| Reject fabricated quotes and missing sources | Passed |
| Handle API rate limits with offline fallback | Passed |
| Generate and answer leaver gap questions | Passed |
| Import public GitHub repository data | Passed |
| Persist published versions across refreshes | Passed |
| Record approval and publishing actions in the audit log | Passed |
| Handle empty input, oversized input and repeated publishing attempts | Passed |

*Note: Structured user studies with external teams have not yet been conducted.*

## 7. Known Limitations

Transparency is an important part of the product.

Current limitations include:

- The share-link revocation functionality exists in the backend API, but a revoke button is not yet available in the interface.
- Joiner acknowledgement is displayed with a timestamp but is not yet recorded in the audit log.
- A visual comparison between saved handover versions is not yet available.
- Stateless share links support a maximum of 25 items, with up to 200 characters per item.
- GitHub import currently supports public repositories only and is subject to unauthenticated API rate limits.
- Conflict detection and gap analysis depend on the AI model and require human review.
- The free Gemini API tier may impose rate limits during periods of heavy usage.

## 8. Roadmap

**Next**
- Add a share-link revocation interface.
- Build an audit-log viewer.
- Record joiner acknowledgements.
- Introduce side-by-side version comparisons.

**Short Term**
- Build a chronological decision timeline.
- Support private GitHub repositories through OAuth.
- Add source exclusion filters.

**Medium Term**
- Integrate Slack, Jira and email.
- Introduce organisation-level workspaces and permissions.
- Enable PDF and Word exports.

**Long Term**
- Scheduled knowledge snapshots before employee offboarding.
- Team-level knowledge concentration analytics.
- Accessibility improvements and structured user studies.

## 9. Privacy and Responsible AI

- The built-in demonstration uses entirely synthetic project data.
- Users are advised to provide only authorised text and public repositories.
- API keys and signing secrets are stored in encrypted Vercel environment variables and are not exposed in the client bundle or committed to GitHub.
- AI-generated claims remain subject to human approval.
- Unverified information and contradictions are explicitly surfaced.
- Database access controls and server-side filtering protect confidential information during sharing.

## 10. AI Assistance Disclosure

Significant parts of the initial code scaffolding and documentation drafts were produced with AI assistance from Claude (Anthropic) and Google Gemini.

The solo participant directed the product concept, implemented features, integrated the services, debugged API handling, deployed the application and performed end-to-end testing.

The Google Gemini API is also used within the application for claim extraction and gap analysis.

The built-in demonstration uses entirely synthetic data.

---

**Built for a simple principle: Critical knowledge should survive team transitions.**

*HandoverTrail — Preserve the context. Verify the evidence. Protect the knowledge.*
