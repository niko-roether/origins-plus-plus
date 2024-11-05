import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyOrCondition(obj) {
	if (typeof obj !== "object") return false;
	return "conditions" in obj && (obj.type === "origins:or" || obj.type == "origins:any_of");
}

function fixOrCondition(obj) {
	if (typeof obj !== "object") return false;
	let fixed = false;
	if (obj.type !== "origins:any_of") {
		obj.type = "origins:any_of"
		fixed = true;
	}
	fixed = fixRecursive(obj.conditions) || fixed;
	return fixed;
}

function fixRecursive(obj) {
	if (typeof obj !== "object") return false;

	if (isProbablyOrCondition(obj)) {
		return fixOrCondition(obj);
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
