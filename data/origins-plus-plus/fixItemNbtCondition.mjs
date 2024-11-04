import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyIngredientCondition(obj) {
	if (typeof obj !== "object") return false;
	return (obj.type === "origins:nbt" || obj.type === "origins:custom_data" || obj.type === "minecraft:custom_data" || obj.type === "apoli:custom_data" || obj.type === "custom_data" || obj.type === "apoli:nbt" || obj.type === "apoli::nbt") && "nbt" in obj;
}

function fixIngredientCondition(obj) {
	if (typeof obj !== "object") return false;
	let fixed = false;
	if (obj.type !== "apoli::nbt") {
		obj.type = "apoli::nbt";
		fixed = true;
	}
	return fixed;
}

function fixRecursive(obj) {
	if (typeof obj !== "object") return false;

	if (isProbablyIngredientCondition(obj)) {
		return fixIngredientCondition(obj);
	}

	let fixed = false;
	if (Array.isArray(obj)) {
		for (const item of obj) {
			fixed ||= fixRecursive(item);
		}
		return fixed;
	}


	for (const key in obj) {
		fixed ||= fixRecursive(obj[key]);
	}
	return fixed;
}

for (const path of paths) {
	const data = JSON.parse(fs.readFileSync(path));
	if (fixRecursive(data)) {
		fs.writeFileSync(path, JSON.stringify(data, null, 2));
	}
}
