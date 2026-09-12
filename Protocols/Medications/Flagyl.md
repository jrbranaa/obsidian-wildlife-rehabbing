---
drug: Flagyl (metronidazole)
drug_class: antibacterial/antifungal
on_hand: true
concentration_mg_ml: 50
dose_mg_kg_low:
dose_mg_kg_high:
route: PO
frequency: BID
source: Squirrel Medication Dosage Chart (prior formulary, pre-2026 SWR chart)
---

> [!warning] Dose figure back-calculated, not explicitly printed
> The source chart's printed "Dose" line for this table only clearly shows Dex's
> 2 mg/kg; Flagyl's own mg/kg figure wasn't legibly printed alongside it. Working
> backward from the chart's dosing-table volumes against its stated
> concentration (**250 mg / 5 mL = 50 mg/mL**) implies roughly **40 mg/kg BID**
> — that math checks out against every weight row, but it's a **reconstruction,
> not a directly-read number**. Confirm before relying on it if precision
> matters (e.g. a fragile or very small patient).

## Use

Antibacterial/antifungal, bactericidal (kills bacteria as it tries to grow).
Used for **Trichomoniasis or giardiasis in raptors, pigeons and doves** per
this formulary — its squirrel-specific use case is less clear from this chart
(the manual separately lists Flagyl as the treatment for suspected **Giardia**
in squirrels, following a positive fecal test — see [[Diarrhea or Soft Stool]]).

## Dosing

- **~40 mg/kg** (back-calculated, see warning above), PO, BID.
- Formulation: **50 mg/mL** (250 mg reconstituted in 5 mL water).
- **Do not use on severely debilitated, pregnant, or nursing animals.**

### Dose from weight (at 50 mg/mL, ~40 mg/kg — back-calculated)

| Weight | Dose |
| ------ | ---- |
| 50 g   | 0.04 mL |
| 100 g  | 0.08 mL |
| 200 g  | 0.16 mL |
| 300 g  | 0.24 mL |
| 500 g  | 0.40 mL |
| 1000 g | 0.80 mL |

## Cautions

- Pills made to order — protect from light/heat, **refrigerate once
  reconstituted**.
- Not for severely debilitated, pregnant, or nursing animals.
- Confirm the back-calculated dose before use (see warning above).

## History

Log each dose in the patient's **## Medications** table (drug = `Flagyl`).
Reserve for a **confirmed** Giardia case (positive fecal) per
[[Diarrhea or Soft Stool]] — not an empiric first choice the way [[Baycox]]/
[[Albon]] are for coccidia.
