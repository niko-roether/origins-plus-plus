import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyDamageAction(obj) {
	if (typeof obj !== "object") return false;
	return obj.type === "origins:damage";
}

function getDamageTypeForSource(source) {
	switch (source) {
		case "freeze.player":
			return "freeze";
		case "onFire":
			return "on_fire";
		case "inFire":
			return "in_fire";
		case "player":
			return "player_attack";
		case "magic":
			return "magic";
		case "generic":
		case "null":
		case "damage":
			return "generic";
		case "hurt_by_water":
		case "drowning":
			return "drown";
		case "wither":
			return "wither";
		case "cactus":
			return "cactus";
		case "thorns":
			return "thorns";
		case "cramming.player":
			return "cramming";
		case "aggro":
			return "mob_attack";
		default:
			throw new Error(`unmapped damage source: ${source}`);
	}
}

function fixDamageAction(obj) {
	if (typeof obj !== "object") return false;
	let fixed = false;
	if ("source" in obj) {
		obj.damage_type = getDamageTypeForSource(obj.source.name);
		obj.source = undefined;
		fixed = true;
	}
	return fixed;
}

function fixRecursive(obj) {
	if (typeof obj !== "object") return false;

	if (isProbablyDamageAction(obj)) {
		return fixDamageAction(obj);
	}

	let fixed = false;
	if (Array.isArray(obj)) {
		for (const item of obj) {
			fixed = fixRecursive(item) || fixed;
		}
		return fixed;
	}


	for (const key in obj) {
		fixed = fixRecursive(obj[key]) || fixed;
	}
	return fixed;
}

for (const path of paths) {
	const data = JSON.parse(fs.readFileSync(path));
	if (fixRecursive(data)) {
		fs.writeFileSync(path, JSON.stringify(data, null, 2));
	}
}
