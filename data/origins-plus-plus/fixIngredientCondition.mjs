import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyIngredientCondition(obj) {
	if (typeof obj !== "object") return false;
	return obj.type === "origins:ingredient";
}

function fixIngredientCondition(obj) {
	if (typeof obj !== "object") return false;
	let fixed = false;
	if ("id" in obj.ingredient) {
		obj.ingredient.item = obj.ingredient.id;
		obj.ingredient.id = undefined;
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
