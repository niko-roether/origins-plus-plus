import fs from "node:fs";

const jsonFiles = fs.globSync("**/*.json");

for (const path of jsonFiles) {
	const data = JSON.parse(fs.readFileSync(path));
	const actions = data?.entity_action?.actions;
	if (!actions) continue;
	for (const action of actions) {
		if (typeof action.effect?.effect === "string") {
			action.effect.id = action.effect.effect;
			action.effect.effect = undefined;
		}
		if (typeof action.effect?.is_ambient === "boolean") {
			action.effect.is_ambient = undefined;
			/*
			action.effect.ambient = action.effect.is_ambient;
			action.effect.is_ambient = false;
			*/
		}
	}
	fs.writeFileSync(path, JSON.stringify(data, null, "\t"));
}
