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
rebuild from if needed. Assign hotkeys or toolbar slots as you like.

### New Patient — type: Template

| Setting | Value |
| --- | --- |
| Template Path | `Templates/New Patient.md` |
| File Name Format | off (the template renames/moves itself) |
| Open the file | on |

### Log Weight — type: Capture

| Setting | Value |
| --- | --- |
| Capture To | `{{VALUE:patient}}` |
| Capture format | on → `\| {{DATE:YYYY-MM-DD}} \| {{VALUE:weight}} \|  \|  \|  \|  \|` |
| Insert after | on → `## Log` |
| └ Insert at end of section | on |
| Prepend / Task / Open file | off |

### Log Feeding — type: Capture

| Setting | Value |
| --- | --- |
| Capture To | `{{VALUE:patient}}` |
| Capture format | `\| {{DATE:YYYY-MM-DD}} \|  \| {{VALUE:qty}} \| {{VALUE:formula}} \| {{VALUE:feedings}} \|  \|` |
| Insert after | `## Log` |
| └ Insert at end of section | on |

### Log Medication — type: Capture

| Setting | Value |
| --- | --- |
| Capture To | `{{VALUE:patient}}` |
| Capture format | `\| {{DATE:YYYY-MM-DD}} \| {{VDATE:time,HH:mm}} \| {{VALUE:drug}} \| {{VALUE:dose}} \| {{VALUE:route}} \| {{VALUE:weight}} \| {{VALUE:note}} \|` |
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

## 3. Mobile toolbar

On the phone: Settings → Toolbar → add the five QuickAdd commands. Now a patient
visit is: open toolbar → *Log Weight* → type the number → done.

`Capture To: {{VALUE:patient}}` shows a fuzzy picker of every note — start typing
the patient's name. (All patient names are unique across years, so this resolves
cleanly.)

---

## 4. Frontmatter dropdowns (Meta Bind)

Each patient note has a collapsed **Fields** callout right under the properties
with dropdowns for **Species**, **Sex**, and **Disposition**. Pick a value and
the frontmatter property updates — these are the only allowed values.

- The other option-based-but-freeform fields (`intake_age`, dates, contacts)
  stay as plain text.
- If the dropdowns render as literal `` `INPUT[...]` `` text: check Meta Bind is
  enabled, and that quoting inside `option("...")` survived (some older Meta Bind
  builds want single quotes).
- To constrain a *new* option field later, add a line to the callout in
  `Templates/New Patient.md` and re-run the bulk-insert.

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
