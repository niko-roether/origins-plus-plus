import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyRecipe(obj, key) {
	if (typeof obj[key] !== "object") return false;
	return key == "recipe" && ("key" in obj[key] || "ingredients" in obj[key]);
}

function fixRecipeKey(obj) {
	let fixed = false;
	for (const sym in obj.key ?? {}) {
		if ("id" in obj.key[sym]) {
			obj.key[sym].item = obj.key[sym].id;
			obj.key[sym].id = undefined;
			fixed = true;
		}
	}
	for (const ingredient of obj.ingredients ?? []) {
		if ("id" in ingredient) {
			ingredient.item = ingredient.id;
			ingredient.id = undefined;
			fixed = true;
		}
	}
	return fixed;
}

function fixRecursive(obj) {
	if (typeof obj !== "object") return false;

	let fixed = false;
	if (Array.isArray(obj)) {
		for (const item of obj) {
			fixed = fixRecursive(item) || fixed;
		}
		return fixed;
	}


	for (const key in obj) {
		if (isProbablyRecipe(obj, key)) {
			fixed = fixRecipeKey(obj[key]) || fixed;
		} else {
			fixed = fixRecursive(obj[key]) || fixed;
		}
	}
	return fixed;
}

for (const path of paths) {
	const data = JSON.parse(fs.readFileSync(path));
	if (fixRecursive(data)) {
		fs.writeFileSync(path, JSON.stringify(data, null, 2));
	}
}

