import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 20;

const RE = /^[A-Za-z0-9._-]{1,100}\/[A-Za-z0-9._-]{1,100}$/;
const one = (s, n) => String(s || "").replace(/\s+/g, " ").trim().slice(0, n);

function gh(path) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "HandoverTrail", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = "Bearer " + process.env.GITHUB_TOKEN;
  return fetch((process.env.GITHUB_API_BASE || "https://api.github.com") + path, { headers });
}
const fail = (error, status) => NextResponse.json({ error }, { status });

// Imports recent commits, issues and pull requests of a PUBLIC repository as two sources.
export async function GET(req) {
  const repo = (new URL(req.url).searchParams.get("repo") || "").trim().replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").replace(/\/$/, "");
  if (!RE.test(repo)) return fail("Enter a public repository as owner/name, for example vercel/next.js.", 400);
  let c, i;
  try { [c, i] = await Promise.all([gh(`/repos/${repo}/commits?per_page=30`), gh(`/repos/${repo}/issues?state=all&per_page=20`)]); }
  catch (e) { return fail("Could not reach GitHub. Please try again.", 502); }
  for (const r of [c, i]) {
    if (r.status === 404) return fail("Repository not found, or it is private. Only public repositories can be imported.", 404);
    if (r.status === 403 || r.status === 429) return fail("GitHub is limiting requests right now. Please wait a few minutes and try again.", 429);
  }
  if ((!c.ok && c.status !== 409) || !i.ok) return fail("GitHub returned an error. Please try again.", 502);
  const commits = c.status === 409 ? [] : await c.json();
  const issues = await i.json();
  const commitLines = (Array.isArray(commits) ? commits : []).map((x) => `- ${one(x.commit?.author?.date, 10)} ${one(x.commit?.author?.name, 40)}: ${one((x.commit?.message || "").split("\n")[0], 160)} (${x.html_url})`);
  const issueLines = (Array.isArray(issues) ? issues : []).map((x) => `- #${x.number} [${x.state}] ${x.pull_request ? "Pull request" : "Issue"} by ${one(x.user?.login, 40)}: ${one(x.title, 160)}${x.body ? " - " + one(x.body, 200) : ""} (${x.html_url})`);
  if (!commitLines.length && !issueLines.length) return fail("This repository has no commits or issues to import.", 404);
  const sources = [];
  if (commitLines.length) sources.push({ id: "gh-commits", title: `Commit history (${repo})`, confidential: false, text: commitLines.join("\n").slice(0, 12000) });
  if (issueLines.length) sources.push({ id: "gh-issues", title: `Issues and pull requests (${repo})`, confidential: false, text: issueLines.join("\n").slice(0, 12000) });
  return NextResponse.json({ repo, sources });
}
