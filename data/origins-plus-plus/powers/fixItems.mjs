import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function isProbablyItem(obj) {
	if (typeof obj !== "object") return false;
	return ("item" in obj || "id" in obj) && ("amount" in obj || "count" in obj || Object.keys(obj).length == 1);
}

function fixItem(obj) {
	if (typeof obj !== "object") return false;
	let fixed = false;
	if ("item" in obj) {
		obj.id = obj.item;
		obj.item = undefined;
		fixed = true;
	}
	if ("amount" in obj) {
		obj.count = obj.amount;
		obj.amount = undefined;
		fixed = true;
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
		if (isProbablyItem(obj[key])) {
			fixed ||= fixItem(obj[key]);
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
