<%*
// New Patient — run with Templater "Create new note from template"
// or via the QuickAdd "New Patient" command.
const name = await tp.system.prompt("Patient name");
const species = await tp.system.suggester(
  ["Fox Squirrel", "Western Gray Squirrel", "California Ground Squirrel",
   "Humboldt's Flying Squirrel", "Douglas Squirrel", "Chipmunk", "Other"],
  ["Fox Squirrel", "Western Gray Squirrel", "California Ground Squirrel",
   "Humboldt's Flying Squirrel", "Douglas Squirrel", "Chipmunk", ""]);
const sex = await tp.system.suggester(["male", "female", "unknown"], ["male", "female", "unknown"]);
const disposition = await tp.system.suggester(
  ["in care", "DOA", "died", "euthanized", "transferred", "released"],
  ["in care", "DOA", "died", "euthanized", "transferred", "released"]);
const intake = await tp.system.prompt("Intake date", tp.date.now("YYYY-MM-DD"));
const age = await tp.system.prompt("Intake age (e.g. 5 weeks)", "");
const year = intake.slice(0, 4);
await tp.file.move(`/${year}/${name}`);
-%>
---
name: <% name %>
species: <% species %>
sex: <% sex %>
disposition: <% disposition %>
intake_date: <% intake %>
rescue_date: <% intake %>
transfer_in_date:
transfer_from:
departure_date:
release_date:
intake_age: <% age %>
departure_age:
id:
release_cage:
release_site:
transferred_to:
transfer_out_date:
siblings:
cagemates:
group:
other:
---

> [!log-actions] Log Actions
> `BUTTON[pt-weight, pt-feeding, pt-med, pt-note, pt-disposition, pt-menu]`

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
