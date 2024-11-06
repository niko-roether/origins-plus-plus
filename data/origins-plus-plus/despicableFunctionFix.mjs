import fs from "node:fs";

const paths = fs.globSync("./**/*.json");

function despicableFunctionFix(cmd) {
	if (typeof cmd !== "string") return null;
	const result = /^((?:execute .* run )?)function ([^ ]+)/.exec(cmd);
	if (!result) return null;
	return `${result[1]}function ${result[2]} {power:"power",resource:"resource"}`
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
		const fix = despicableFunctionFix(obj[key]);
		if (fix) {
			obj[key] = fix;
			fixed = true;
		} else {
			fixed = fixRecursive(obj[key]) || fixed;
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
