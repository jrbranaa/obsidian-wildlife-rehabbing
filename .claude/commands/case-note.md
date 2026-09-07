---
description: Summarize this rehab conversation into a case note and write it to the Obsidian vault
---

You are appending to Captain's Obsidian wildlife rehab vault based on the conversation that just happened in this session. This vault's schema and conventions are already established — follow them exactly, do not invent new fields or sections.

## Step 1 — Identify the case
From the conversation, determine:
- The patient's name as used in the vault.
- Whether this is a NEW case or a CONTINUATION of an existing one.
- If it's a new patient and no name was given, ask the user for one before creating a file.

## Step 2 — Find the note
Patient notes live at `<Year>/<Name>.md` (e.g. `2026/Casey.md`) — one file per intake year. There is no `Cases/` folder.
- Search all `20??/*.md` for a note whose `name:` frontmatter or filename matches.
- If found: open it and note its current `disposition` and other frontmatter — this is a CONTINUATION.
- If not found: this is a NEW case. Ask the user for the intake year if it wasn't stated, then create `<Year>/<Name>.md`.

## Step 3 — Frontmatter (new notes only)
Use this vault's exact 17-key schema — do not add, rename, or drop keys:

```yaml
---
name:
species:
sex:
disposition: in care
intake_date:
rescue_date:
departure_date:
release_date:
intake_age:
departure_age:
id:
release_cage:
release_site:
transferred_to:
siblings:
cagemates:
other:
---
```

- `species`: prefer the vault's controlled list where it applies — Fox Squirrel, Western Gray Squirrel, California Ground Squirrel, Humboldt's Flying Squirrel, Douglas Squirrel, Chipmunk — otherwise the closest accurate species name.
- `disposition`: controlled values only — `in care | released | died | euthanized | transferred | DOA`. Default `in care` for a new intake unless the conversation says otherwise.
- Leave a field blank if the conversation didn't cover it — don't guess or infer.

Immediately after the frontmatter, add the standard action-button line so the note matches every other patient note:

```
> [!log-actions] Log Actions
> `BUTTON[pt-weight, pt-feeding, pt-med, pt-note, pt-disposition, pt-menu]`
```

Then the standard section headers, in this order, all empty except `## Notes` (filled in Step 4):

```
## Notes

## Weight

| Date | Weight (g) | Notes |
| ---- | ---------- | ----- |

## Feeding

| Date | Time | Formula Qty | Formula | Feedings | Notes |
| ---- | ---- | ----------- | ------- | -------- | ----- |

## Medications

| Date | Time | Drug | Dose | Route | Notes |
| ---- | ---- | ---- | ---- | ----- | ----- |
```

## Step 4 — Write the narrative
Under `## Notes`, append a new dated entry — do not overwrite or remove anything already there:

```
### <today's date, YYYY-MM-DD>
- <clinical findings / assessment / reasoning discussed>
- <treatment or protocol decisions and rationale>
- <open questions or vet follow-ups flagged>
```

Match the terseness and terminology already used in `## Notes` if prior entries exist — don't restate history that's already there.

## Step 5 — Structured data
If the conversation gave a specific weight, feeding, or medication event with enough detail to log (date, value/dose, route), add it as a new row in the matching table (`## Weight` / `## Feeding` / `## Medications`) instead of restating it in prose. If the conversation was general discussion with no discrete loggable event, skip this — don't fabricate rows.

## Step 6 — What to skip
Pleasantries, tool narration, and anything not clinically or logistically relevant to this animal's care.

## Step 7 — Confirm
After writing the file, tell the user in one or two lines:
- Which file was created or updated (path)
- A one-sentence summary of what was added

Do not just print the note content in chat — actually write it to the file.
