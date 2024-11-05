import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyEntityGroupCondition(obj) {
	if (typeof obj !== "object") return false;
	return ("group" in obj && obj.type === "origins:entity_group") || ("tag" in obj && obj.type == "origins:in_tag");
}

function fixEntityGroupCondition(obj) {
	if (typeof obj !== "object") return false;
	let fixed = false;
	if (obj.type !== "origins:in_tag") {
		obj.type = "origins:in_tag"
		fixed = true;
	}
	if ("group" in obj) {
		console.warn("Assuming group is valid tag: " + obj.group);
		obj.tag = obj.group;
		obj.group = undefined;
		fixed = true;
	}
	return fixed;
}

function fixRecursive(obj) {
	if (typeof obj !== "object") return false;

	if (isProbablyEntityGroupCondition(obj)) {
		return fixEntityGroupCondition(obj);
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
