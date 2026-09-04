# Automation Setup

One-time setup for the add-patient / log-weight / log-medication workflows.
Do this on desktop; everything works on mobile afterward.

---

## 1. Activate the plugins

The three plugins are already installed in `.obsidian/plugins/` with their
config, and QuickAdd is pre-seeded with the five commands. You just need to
let Obsidian load them:

1. **Fully quit and reopen Obsidian** (on mobile: swipe it closed and reopen).
2. Settings → **Community plugins**. If it says Restricted Mode is on, click
   **Turn on community plugins**.
3. Confirm **Templater**, **QuickAdd**, and **Meta Bind** show as enabled.
   Toggle them on if not.

Versions installed: Templater 2.25.0, QuickAdd 2.24.2, Meta Bind 1.5.1. Update
them anytime from Settings → Community plugins → Check for updates.

Already configured for you:
- Templater + core Templates folder → `Templates/`
- Templater "trigger on new file creation" → on
- QuickAdd → the five commands in Section 2

If QuickAdd's commands are missing or misbehave, delete
`.obsidian/plugins/quickadd/data.json`, restart, and rebuild them by hand from
Section 2.

---

## 2. QuickAdd choices (reference — already configured)

These are already built and registered as commands. This table is the spec to
rebuild from if needed.

The four capture choices are set to **Capture to active file** — run them while
the patient's note is open (which is how the in-note buttons work, Section 3).
`Capture To` / `{{VALUE:patient}}` is the fallback if no note is open.

A sixth choice, **Patient Actions** (type: Multi), bundles all of them into one
menu — give *that* a single hotkey instead of six.

### New Patient — type: Template

| Setting | Value |
| --- | --- |
| Template Path | `Templates/New Patient.md` |
| File Name Format | off (the template renames/moves itself) |
| Open the file | on |

### Log Weight — type: Capture

| Setting | Value |
| --- | --- |
| Capture format | on → `\| {{DATE:YYYY-MM-DD}} \| {{VALUE:weight}} \|  \|` |
| Insert after | on → `## Weight` |
| └ Insert at end of section | on |
| Prepend / Task / Open file | off |

### Log Feeding — type: Capture

| Setting | Value |
| --- | --- |
| Capture format | `\| {{DATE:YYYY-MM-DD}} \| {{VALUE:qty}} \| {{VALUE:formula}} \| {{VALUE:feedings}} \|  \|` |
| Insert after | `## Feeding` |
| └ Insert at end of section | on |

### Log Medication — type: Capture

| Setting | Value |
| --- | --- |
| Capture format | `\| {{DATE:YYYY-MM-DD}} \| {{VDATE:time,HH:mm}} \| {{VALUE:drug}} \| {{VALUE:dose}} \| {{VALUE:route}} \| {{VALUE:note}} \|` |
| Insert after | `## Medications` |
| └ Insert at end of section | on |

### Add Note — type: Capture

| Setting | Value |
| --- | --- |
| Capture To | `{{VALUE:patient}}` |
| Capture format | `{{DATE:YYYY-MM-DD}}: {{VALUE:note}}` + newline |
| Insert after | `## Notes` |
| └ Insert at end of section | **off** (newest note goes on top) |

---

## 3. In-note action buttons (Meta Bind)

Every patient note has a **Log Actions** bar right under the properties:

> ┌─ LOG ACTIONS ────────────────┐
> │ `Weight` `Feeding` `Med` `Note` `⋯` │
> └──────────────────────────────┘

Each runs the matching QuickAdd command against the note you're in — so a patient
visit is: open the note → tap **Weight** → type `142` → done. `⋯` opens the full
**Patient Actions** menu (the place to add Release / Transfer / etc. later).

How it's wired:
- Meta Bind → Settings → **Button Templates** holds 5 templates (`pt-weight`,
  `pt-feeding`, `pt-med`, `pt-note`, `pt-menu`), each a `command` action calling
  a QuickAdd choice.
- The note contains a `> [!log-actions] Log Actions` callout wrapping one line,
  `` `BUTTON[pt-weight, pt-feeding, pt-med, pt-note, pt-menu]` `` — edit the
  templates once, every note updates.
- The callout box + button styling come from the CSS snippet
  `.obsidian/snippets/patient-buttons.css` (enabled in Settings → Appearance →
  CSS snippets). Tweak the `--callout-color` / sizes there.
- To add an action later: new QuickAdd choice → add it to the Patient Actions
  Multi → (optionally) new button template + add its id to the `BUTTON[...]` line
  in `Templates/New Patient.md`, then re-run the bulk insert.

If the buttons show as literal `` `BUTTON[...]` `` text: confirm Meta Bind is
enabled.

### Optional: mobile toolbar

Settings → Toolbar → add **Patient Actions** (one entry, fans out to all six).

---

## 4. Option fields (species / sex / disposition)

These live in plain frontmatter and are edited in the **Properties panel** like
any other property.

- **At intake** the New Patient command prompts for species, sex, and disposition
  with pick-lists (Templater suggesters), so new notes start with valid values.
- **Later changes** (e.g. disposition → released) are typed/picked in the
  Properties panel, or via a future "Set …" action on the `⋯` menu.
- Allowed values — keep these consistent:
  - `species`: Fox Squirrel · Western Gray Squirrel · California Ground Squirrel ·
    Humboldt's Flying Squirrel · Douglas Squirrel · Chipmunk
  - `sex`: male · female · unknown
  - `disposition`: in care · released · died · euthanized · transferred · DOA

There is no native Obsidian dropdown for a plain property; a real Properties-panel
dropdown would need a niche plugin (Custom Selectors) — not currently installed.

## 5. Dashboard

`Patients.base` (root of the vault) opens with tabs: **In care**, **Released**,
**Did not survive**, **All patients**. Requires Obsidian 1.9+ (Bases is core, no
plugin needed). Bookmark it (Bookmarks core plugin) for one-tap access.

---

## 6. Housekeeping still to do

- Work through `Normalization Review.md` and delete it when done.
- Verify the dosing numbers in `Protocols/Medications/*` against your vet.
- The medication reference files carry `concentration_mg_ml` and `dose_mg_kg_*`
  in frontmatter — once the numbers are confirmed we can add a "calculate dose
  from current weight" step to the Log Medication command.
