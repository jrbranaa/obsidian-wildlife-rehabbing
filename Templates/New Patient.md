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
const intake = await tp.system.prompt("Intake date", tp.date.now("YYYY-MM-DD"));
const age = await tp.system.prompt("Intake age (e.g. 5 weeks)", "");
const year = intake.slice(0, 4);
await tp.file.move(`/${year}/${name}`);
-%>
---
name: <% name %>
species: <% species %>
sex: <% sex %>
disposition: in care
intake_date: <% intake %>
rescue_date: <% intake %>
departure_date:
release_date:
intake_age: <% age %>
departure_age:
id:
release_cage:
address_found:
circumstances:
treatment_provided:
food_water_provided:
updates_desired:
contact_name:
contact_phone:
contact_text_ok:
contact_email:
siblings:
cagemates:
other:
---

## Notes

## Log

| Date | Weight (g) | Formula Qty | Formula | Feedings | Notes |
| ---- | ---------- | ----------- | ------- | -------- | ----- |

## Medications

| Date | Time | Drug | Dose | Route | Weight (g) | Notes |
| ---- | ---- | ---- | ---- | ----- | ---------- | ----- |
