#!/usr/bin/env tsimp
import meow from "meow";
import logSymbols from "log-symbols";
import { formatName, languageNames, languageAliases } from "./helpers.js";

const cli = meow(`
	Usage
	  $ gfm-lang <language or alias> […]

	Examples
	  $ gfm-lang markdown js 'NPM Config' asdf

	  ℹ Markdown - markdown, md, pandoc
	  ℹ js (JavaScript) - javascript, js, node
	  ℹ NPM Config - npm-config, npmrc
	  ✖ asdf
`, {
	importMeta: import.meta,
	description: false,
	flags: {
		help: {
			type: "boolean",
			shortFlag: "h",
		},
	},
});

const input = cli.input.map(input => input.toLowerCase());

if (input.length === 0) {
	cli.showHelp(0);
}

for (const name of input) {
	const language = languageNames.get(name) ?? languageAliases.get(formatName(name));

	if (language) {
		const title = name === language.name.toLowerCase() ? language.name : `${name} (${language.name})`;
		const aliases = [formatName(language.name), ...language.aliases ?? []];

		console.log(`${logSymbols.info} ${title} - ${aliases.join(", ")}`);
		continue;
	}

	console.log(`${logSymbols.error} ${name}`);
}
