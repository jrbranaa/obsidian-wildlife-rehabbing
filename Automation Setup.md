# Automation Setup

One-time setup for the add-patient / log-weight / log-medication workflows.
Do this on desktop; everything works on mobile afterward.

---

## 1. Install the plugins

Settings → **Community plugins** → turn on → **Browse**:

1. **Templater** (SilentVoid13) — install, enable.
2. **QuickAdd** (Christian B. B. Houmann) — install, enable.
3. **Meta Bind** (mProjectsCode) — install, enable. Powers the frontmatter
   dropdowns. Default settings are fine; make sure "Enable syntax highlighting"
   and the inline-field rendering options are on.

### Templater settings

- **Template folder location:** `Templates`
- **Trigger Templater on new file creation:** ON
- Under **Folder Templates** (optional): none needed.

### Core "Templates" plugin

Settings → Templates → **Template folder location:** `Templates` (so both engines agree).

---

## 2. Load the QuickAdd configuration (fast path)

1. Close Obsidian.
2. Copy `Templates/quickadd-data.json` from this vault over
   `.obsidian/plugins/quickadd/data.json` (overwrite).
3. Reopen Obsidian. The five commands below appear in the command palette.

If the fast path misbehaves, delete that `data.json`, restart, and build the
choices by hand using **Section 3**.

---

## 3. QuickAdd choices (manual build / reference)

Settings → QuickAdd → add each choice, then click the ⚡ to register it as a
command, then assign a hotkey or add it to the mobile toolbar.

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

## 4. Mobile toolbar

On the phone: Settings → Toolbar → add the five QuickAdd commands. Now a patient
visit is: open toolbar → *Log Weight* → type the number → done.

`Capture To: {{VALUE:patient}}` shows a fuzzy picker of every note — start typing
the patient's name. (All patient names are unique across years, so this resolves
cleanly.)

---

## 5. Frontmatter dropdowns (Meta Bind)

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

## 6. Dashboard

`Patients.base` (root of the vault) opens with tabs: **In care**, **Released**,
**Did not survive**, **All patients**. Requires Obsidian 1.9+ (Bases is core, no
plugin needed). Bookmark it (Bookmarks core plugin) for one-tap access.

---

## 7. Housekeeping still to do

- Work through `Normalization Review.md` and delete it when done.
- Verify the dosing numbers in `Protocols/Medications/*` against your vet.
- The medication reference files carry `concentration_mg_ml` and `dose_mg_kg_*`
  in frontmatter — once the numbers are confirmed we can add a "calculate dose
  from current weight" step to the Log Medication command.
