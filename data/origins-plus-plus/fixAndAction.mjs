import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyAndAction(obj) {
	if (typeof obj !== "object") return false;
	if (!("actions" in obj)) return false;
	return obj.type === "origins:and" || obj.type == "origins:all_of";
}

function fixRecursive(obj) {
	if (typeof obj !== "object") return false;

	let fixed = false;
	if (Array.isArray(obj)) {
		for (const item of obj) {
			fixed ||= fixRecursive(item);
		}
		return fixed;
	}


	for (const key in obj) {
		if (isProbablyAndAction(obj[key])) {
			obj[key] = obj[key].actions;
			fixed = true;
			continue;
		}
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
