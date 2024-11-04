import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyFeedAction(obj) {
	if (typeof obj !== "object") return false;
	return obj.type === "origins:or" || obj.type == "origins:any_of";
}

function fixDamageAction(obj) {
	if (typeof obj !== "object") return false;
	let fixed = false;
	if (obj.type !== "origins:any_of") {
		obj.type = "origins:any_of"
		fixed = true;
	}
	return fixed;
}

function fixRecursive(obj) {
	if (typeof obj !== "object") return false;

	if (isProbablyFeedAction(obj)) {
		return fixDamageAction(obj);
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
