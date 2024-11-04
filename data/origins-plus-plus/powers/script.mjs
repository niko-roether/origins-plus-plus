import fs from "node:fs";
import { randomUUID } from "node:crypto";

const paths = fs.globSync("./**/*.json");

function fixModifier(obj) {
	if (typeof obj !== "object") return false;
	let fixed = false;
	if (!("id" in obj)) {
		obj.id = `origins-plus-plus:${randomUUID().replace(/-/g, "_")}`;
		fixed = true;
	}
	switch (obj.operation) {
		case "addition":
			obj.operation = "add_value";
			fixed = true;
			break;
		case "multiply_base":
			obj.operation = "add_multiplied_base";
			fixed = true;
			break;
		case "multiply_total":
			obj.operation = "add_multiplied_total";
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
			fixed ||= fixRecursive(item);
		}
		return fixed;
	}


	for (const key in obj) {
		if (key == "modifier" && typeof obj[key] == "object") {
			fixed ||= fixModifier(obj[key]);
		} else {
			fixed ||= fixRecursive(obj[key]);
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
