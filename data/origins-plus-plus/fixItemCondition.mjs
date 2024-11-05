import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyItemCondition(obj, key) {
	if (typeof obj[key] !== "object") return false;
	if (key !== "item_condition") return false;
	return true;
}

function fixItemCondition(obj) {
	let fixed = false;
	switch (obj.type) {
		case "origins:nbt":
			obj.type = "origins:custom_data";
			fixed = true;
			break;
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
		if (isProbablyItemCondition(obj, key)) {
			fixed = fixItemCondition(obj[key]) || fixed;
			continue;
		}
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
