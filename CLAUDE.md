# CLAUDE.md — Xiaoyu Ye Personal Site (Job-Search Deliverable)

This file governs any Claude Code session working on this repo. Read it fully before writing code. This is not a portfolio for portfolio's sake — it is **evidentiary material for a job search and O-1 visa narrative**. Every design decision should be checked against that job, not against "does this look cool."

---

## 0. What this site is actually for

- Primary audience: hiring managers / recruiters who spend **2–3 seconds** on first impression before deciding whether to keep reading.
- Secondary audience: immigration attorneys / O-1 evaluators who need **quantifiable, verifiable evidence** (Red Dot Award, named project, measurable outcomes).
- Two applicant tracks converge here: **Spatial Computing / XR Design** (primary, ~50% weight) and **Healthcare UX / Systems Design** (secondary, ~25% weight). The homepage must present ONE strong unified identity, then branch — never a carousel, never split 50/50 on the hero.
- Flagship asset: **Breezy** — Red Dot Award–winning healthcare telemetry system (Bluetooth hardware + iOS app), currently being upgraded into a spatial computing / AR case study. This is the anchor. Lead with it.

Before touching any visual, ask: *does this make it easier for a skimming recruiter to verify "this person is exceptional" in under 5 seconds?* If not, cut it.

---

## 1. Hard bans — "vibe coding" tells to actively design against

The reference screenshots in `/design-references/avoid/` (SaaS AI-agent landing page, DeFi/crypto landing page) are **anti-patterns**, not inspiration. They represent generic AI-generated startup aesthetics. Specifically banned:

- **Purple/magenta/violet gradients** of any kind — no `#7C3AED`, no purple-to-pink blends, no "AI product" gradient blobs or auroras. This is the single most recognizable vibe-coding tell and is non-negotiable to avoid.
- Glowing/blurred gradient orbs floating in dark backgrounds as filler decoration.
- Glassmorphism used decoratively rather than functionally (frosted panels with no purpose).
- Generic default type stacks: no Inter/Poppins/Manrope used untouched as the *only* typeface with zero pairing thought. (Inter is fine as a body/UI face if deliberately paired with a distinctive display face — it should never be the whole system.)
- Numbered markers (01 / 02 / 03) used as decoration when the content isn't actually a sequence.
- Auto-playing cinematic background video that requires >2–3 seconds of watching to mean anything (per our discussion: recruiters won't watch it — any motion must communicate in a single glance/first frame).
- Excessive scroll-triggered animation stacked on every element — motion should be one orchestrated moment, not ambient noise everywhere.
- Stock "cyberpunk city / holographic human" concept art used as decoration instead of real project evidence. If spatial design is shown, it must be **real Breezy work**, not generic AI-generated atmosphere art.

If a proposed component resembles either reference screenshot in palette or composition, revise it before writing code.

---

## 2. Design North Star

- **Tone**: precision instrument, not startup marketing site. Think: the visual register of Apple Vision Pro / Rhino-Grasshopper technical documentation crossed with an award case-study — not a SaaS landing page.
- **Palette** (define concrete hex values before building, do not drift from them mid-build): dark-neutral base (near-black, not pure `#000`), one restrained accent color drawn from Breezy's actual brand/UI (not an arbitrary "tech accent"), a warm neutral for body text on dark. No purple. No neon rainbow gradients.
- **Typography**: pair a distinctive display face (used with restraint — headline sizes only) with a clean, highly legible body/UI face, plus a monospace or utility face for data labels/captions (fits the "hardware telemetry" identity). State the actual font choices explicitly in the plan before implementation — do not default to whatever ships in the starter template.
- **Hero**: one strong asset, not a carousel. Preferred: a short (3–5s), silent, looping clip or animated sequence built from **real Breezy spatial-demo material** (AR panel float, telemetry visualization) — not stock footage, not generated concept art. Static fallback: a real Breezy render/screenshot with headline + Red Dot Award credential visible above the fold, no scrolling required to see it.
- **Structure below the fold**: branch into two tracks (Spatial/XR case studies vs. Healthcare UX case studies) rather than trying to make every visitor read everything.
- **Motion**: deliberate, not decorative. One signature interaction is worth more than ten small hover effects.

---

## 3. Responsive requirements (hard requirement, not optional polish)

- Design and test at minimum: **375px** (mobile), **768px** (tablet), **1440px** (desktop). Do not treat mobile as an afterthought — many recruiters will open the link from a phone via LinkedIn or email.
- Hero content (credential + CTA) must be fully legible without horizontal scroll or cut-off text at 375px.
- Any looping video/animation in the hero must have a lightweight mobile fallback (static image or reduced file size) — do not ship a heavy desktop video asset to mobile connections.
- Verify touch target sizes (min ~44px) on mobile for any nav/CTA elements.
- Verify keyboard focus states are visible (accessibility floor, not optional).

---

## 4. Content & copy rules

- Every claim on the page should be either **verifiable** (award name, project name, quantified outcome) or removed. No filler marketing language ("passionate about creating delightful experiences").
- Lead with nouns a recruiter can act on: award name, company/context, the specific problem solved, the measurable outcome.
- Write from the reader's side: what they'll learn by clicking through, not how impressive the system architecture is.
- No generic "About Me" mission-statement paragraph competing with the hero for attention — that content, if it exists, lives further down the page.

---

## 5. Process — before declaring anything "done"

1. State the plan first: palette (named hex values), type pairing, layout concept (ASCII wireframe is fine), and the one signature element — before writing code.
2. Cross-check the plan against Section 1's ban list explicitly. If any part resembles a default AI-generated pattern, revise and note what changed.
3. Build.
4. **Take a screenshot (or render check) of the actual output at both a mobile and desktop width before calling the task complete.** Do not assume the code is correct — verify visually.
5. Re-check against this file's bans one more time after building, since gradients/purple accents sometimes creep in via default component libraries (shadcn defaults, Tailwind gradient utilities, etc.) — audit any imported UI library's default theme before use.
6. Report back what was verified (screenshots, breakpoints checked), not just "done."

---

## 6. Reference material

- `/design-references/avoid/` — the two vibe-coding examples explicitly to avoid in palette and composition.
- Prior design discussion established: dark, evidence-first hero > oversized personal headshot; real project motion > generic concept art; single unified identity + branching architecture > carousel; no purple/violet gradients under any circumstance.
