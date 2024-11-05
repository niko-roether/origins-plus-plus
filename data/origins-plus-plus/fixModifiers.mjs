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
	if ("value" in obj) {
		obj.amount = obj.value;
		obj.value = undefined;
		fixed = true;
	}

	let isAttrMod = "attribute" in obj;

	switch (obj.operation) {
		case "addition":
		case "add_value":
		case "add_total_early":
			obj.operation = isAttrMod ? "add_value" : "add_total_early";
			fixed = true;
			break;
		case "multiply_base":
		case "multiply_base_additive":
		case "add_multiplied_base":
			obj.operation = isAttrMod ? "add_multiplied_base" : "multiply_base_additive";
			fixed = true;
			break;
		case "multiply_total":
		case "multiply_total_additive":
		case "add_multiplied_total":
			obj.operation = isAttrMod ? "add_multiplied_total" : "multiply_total_additive";
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
		if (key == "modifiers" && Array.isArray(obj[key])) {
			for (let i = 0; i < obj[key].length; i++) fixed ||= fixModifier(obj[key][i]);
		} else if ((key == "modifier" || key == "modifiers") && typeof obj[key] == "object") {
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
