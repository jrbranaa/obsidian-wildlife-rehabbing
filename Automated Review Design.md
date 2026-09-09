---
status: design — not yet implemented
tags: [rehab, automation]
---

# Automated Patient Review — Design

Goal: a recurring job that scans patient notes for anything new since the last review and writes **one distilled note for me to read** — findings, flags, questions worth a look. It must never touch patient records itself. Any resulting changes to a patient's actual note happen later, by hand or in a live conversation, after I've read the review and we've discussed it.

## Why this has to run locally, not as a cloud-scheduled agent

Claude Code's built-in scheduled/cloud routines clone a GitHub repo fresh each run. Patient notes in this vault are deliberately **not** in the `obsidian-wildlife-rehabbing` GitHub repo — they're untracked from git on purpose and live here only via Obsidian Sync. A cloud routine would clone an empty set of year folders and see nothing.

So this needs to run as a **local scheduled job** (cron or a systemd timer) that invokes the `claude` CLI headlessly, in this vault directory, on this machine — the same way the Remote Control session already has real filesystem access.

## Trigger mechanism

Headless, non-interactive invocation via `claude -p` (print mode — runs one prompt/command and exits, no chat UI):

```bash
cd "/home/jrbranaa/Documents/Wildlife Rehab" && \
claude -p "/patient-review" \
  --allowedTools "Read,Grep,Glob,Write(./Reviews/**)"
```

Scheduled via crontab, e.g. daily at 7am:

```
0 7 * * * cd "/home/jrbranaa/Documents/Wildlife Rehab" && claude -p "/patient-review" --allowedTools "Read,Grep,Glob,Write(./Reviews/**)" >> "/home/jrbranaa/.local/log/patient-review.log" 2>&1
```

**Key safety property**: `--allowedTools "Read,Grep,Glob,Write(./Reviews/**)"` restricts the entire run to reading anything, but writing *only* inside a `Reviews/` folder — it has no path that lets it touch a year-folder patient note even if something in the prompt went sideways. This should be verified empirically (a dry run against a scratch copy of the vault) before trusting it unattended, since exact allow-list path syntax and whether it fully suppresses permission prompts in `-p` mode needs confirming against the installed Claude Code version.

## Tracking "what's new since last review"

Use a small state file, e.g. `.claude/review-state.json`:

```json
{ "last_reviewed": "2026-09-07" }
```

Every log entry in a patient note (`## Notes`, `## Weight`, `## Feeding`, `## Medications`) is already dated. So "new" = any entry dated after `last_reviewed`, across all `disposition: in care` patients (plus: surface it if a patient's `disposition` itself changed since last review, even if that's the only new thing — e.g. "X was released"). This is more meaningful than comparing file mtimes, since it says *what* changed, not just *that* a file changed.

The command updates `last_reviewed` to today only after successfully writing a review note.

## What gets flagged

Starting set of review criteria — worth revisiting once we see a real review or two:

1. **New clinical notes** — summarize new `## Notes` entries since last review (findings, treatment decisions, reasoning).
2. **Weight gaps/trends** — no weight entry in N days for an in-care patient; a drop or unexpected plateau.
3. **Feeding gaps/trends** — no feeding entries in N days; a volume drop worth a second look.
4. **Medication continuity** — a course that seems to have just stopped with no note explaining why; doses that look overdue given the stated schedule.
5. **Disposition changes** — any patient whose disposition changed since last review.
6. **Open questions** — anything explicitly flagged in Notes as a vet follow-up or open question that hasn't been resolved in a later entry.
7. **New intakes** — patients added since last review, with a one-line intake summary.

Open question: what counts as "too long without an entry" (N days) probably varies by species/age — a rule of thumb here would need my input, not a hardcoded number.

## Output

One new file per run, not an overwritten single note — so the review history itself becomes a trail I can look back on:

```
Reviews/2026-09-14 Patient Review.md
```

Sketch:

```markdown
# Patient Review — 2026-09-14

## Needs a look
- **[[Casey]]**: no weight entry in 9 days; last entry (09-05) noted declining appetite.
- **[[Buckeye]]**: Metacam started 09-10, no follow-up note on response yet.

## FYI
- **[[Astro Pop]]**: released to Lyndi's on 09-12.
- **[[Mr Peanut]]**: new intake 09-13 — fox squirrel, ~4 weeks, minor road-rash.

## Open questions carried over
- **[[Chrissy]]**: vet follow-up on suspected malocclusion, flagged 09-08, no update since.
```

Whether it's grouped by flag type (as above) or by patient is worth deciding once we see it populated with real data — grouped-by-flag is probably better for a quick skim, grouped-by-patient better if I'm about to go check on someone specific.

Skip producing a note (or produce a short "nothing new" one — TBD, see open questions) if there's genuinely nothing since the last run, so daily runs don't spam empty files.

## Open questions before building this

- **Frequency**: daily, weekly, or something else? Daily catches things faster but only matters if there's usually something new each day.
- **Silent runs**: when there's nothing new, skip writing a file entirely, or write a short "nothing new" note so I know the job actually ran?
- **Reviews/ and git**: track `Reviews/` in the GitHub repo, or gitignore it like the patient notes (Obsidian Sync only)? Leaning toward *not* tracking it, to stay consistent with how patient data is already handled.
- **Notification**: is finding the note next time I open Obsidian enough, or do you want a push notification / message when a review runs?
- **Thresholds**: how many days without a weight/feeding entry should actually trigger a flag — probably differs for a days-old intake vs. a stable long-term resident.

## Implementation plan (once the above is settled)

1. Write `.claude/commands/patient-review.md` — the actual distillation prompt, encoding the criteria above.
2. Add `.claude/review-state.json` to track `last_reviewed`.
3. Dry-run manually (`claude -p "/patient-review"` from a terminal) and sanity-check the output before scheduling anything.
4. Add the cron entry (or systemd timer) once the manual runs look right.
5. Decide the `Reviews/` git-tracking question and update `.gitignore` accordingly.
