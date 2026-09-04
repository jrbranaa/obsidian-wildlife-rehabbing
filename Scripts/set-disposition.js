// QuickAdd user script: Set Disposition
// Pick a disposition for the active patient note; branch into follow-up prompts
// and stamp the matching frontmatter fields.

const DISPOSITIONS = ["in care", "released", "transferred", "died", "euthanized", "DOA"];
const LOCATIONS_FOLDER = "Locations";
const LOCATION_TEMPLATE = "Templates/New Location.md";

module.exports = async (params) => {
  const { app, quickAddApi } = params;
  const { Notice } = params.obsidian;

  const file = app.workspace.getActiveFile();
  if (!file || file.extension !== "md") {
    new Notice("Set Disposition: open a patient note first.");
    return;
  }

  const disp = await quickAddApi.suggester(DISPOSITIONS, DISPOSITIONS);
  if (!disp) return;

  const today = window.moment().format("YYYY-MM-DD");

  let date = "";
  if (disp !== "in care") {
    date = await quickAddApi.inputPrompt(`Date for "${disp}"`, "YYYY-MM-DD", today);
    if (date === undefined || date === null) return;
    date = date.trim() || today;
  }

  const pickLocation = async (header) => {
    const NEW = "＋ New location…";
    const KEEP = "— leave unchanged —";
    const names = app.vault.getMarkdownFiles()
      .filter((f) => f.path.startsWith(LOCATIONS_FOLDER + "/"))
      .map((f) => f.basename)
      .sort((a, b) => a.localeCompare(b));

    const options = [...names, NEW, KEEP];
    const choice = await quickAddApi.suggester(options, options, header);
    if (choice === undefined || choice === null) return undefined; // cancelled
    if (choice === KEEP) return null;                              // don't touch
    if (choice !== NEW) return choice;

    const newName = await quickAddApi.inputPrompt("New location name");
    if (!newName || !newName.trim()) return undefined;
    const name = newName.trim();
    const path = `${LOCATIONS_FOLDER}/${name}.md`;
    if (!app.vault.getAbstractFileByPath(LOCATIONS_FOLDER)) {
      await app.vault.createFolder(LOCATIONS_FOLDER);
    }
    if (!app.vault.getAbstractFileByPath(path)) {
      let body = "---\nname: \nkind: \naddress: \ncoordinates: \nhabitat: \nnotes: \n---\n\n## Notes\n";
      const tpl = app.vault.getAbstractFileByPath(LOCATION_TEMPLATE);
      if (tpl) body = await app.vault.read(tpl);
      body = body.replace(/^name:.*$/m, `name: ${name}`);
      await app.vault.create(path, body);
    }
    return name;
  };

  let site;
  if (disp === "released")    site = await pickLocation("Release site");
  if (disp === "transferred") site = await pickLocation("Transferred to");
  if (site === undefined && (disp === "released" || disp === "transferred")) return; // cancelled

  await app.fileManager.processFrontMatter(file, (fm) => {
    fm.disposition = disp;

    if (disp === "in care") {
      fm.departure_date = null;
      fm.release_date = null;
      fm.release_site = null;
      fm.transferred_to = null;
      return;
    }

    fm.departure_date = date;
    fm.release_date = disp === "released" ? date : null;

    if (disp === "released") {
      fm.transferred_to = null;
      if (site) fm.release_site = `[[${site}]]`;
    } else if (disp === "transferred") {
      fm.release_site = null;
      if (site) fm.transferred_to = `[[${site}]]`;
    } else {
      fm.release_site = null;
      fm.transferred_to = null;
    }
  });

  new Notice(`${file.basename} → ${disp}${date ? " (" + date + ")" : ""}`);
};
