import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function probabyHasItemCondition(obj) {
	if (typeof obj !== "object") return false;
	return "item_condition" in obj;
}

function fixIngredientCondition(obj) {
	if (typeof obj !== "object") return false;
	let fixed = false;
	if ("nbt" in obj.item_condition) {
		obj.item_condition.custom_data = obj.item_condition.nbt;
		obj.item_condition.nbt = undefined;
		fixed = true;
	}
	return fixed;
}

function fixRecursive(obj) {
	if (typeof obj !== "object") return false;

	if (probabyHasItemCondition(obj)) {
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
