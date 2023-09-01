#!/usr/bin/env tsx
import meow from "meow";
import logSymbols from "log-symbols";
import _languages, { type Language } from "linguist-languages";

const cli = meow(`
	Usage
	  $ gfm-lang <language or alias> […]

	Examples
	  $ gfm-lang markdown js 'NPM Config' asdf

	  ${logSymbols.info} Markdown - markdown, md, pandoc
	  ${logSymbols.info} js (JavaScript) - javascript, js, node
	  ${logSymbols.info} NPM Config - npm-config, npmrc
	  ${logSymbols.error} asdf
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
const { flags: { help: helpShortFlag } } = cli;

if (input.length === 0 || helpShortFlag) {
	cli.showHelp(0);
}

const formatName = (name: string) => name.toLowerCase().replaceAll(" ", "-");

type Languages = Array<[string, Language]>;

const languages: Languages = Object.entries(_languages).map(([name, language]) => [name.toLowerCase(), language]);
const languageNames = new Map(languages);
const languageAliases = new Map(languages.flatMap(([_, language]) => [
	...(language.aliases?.map(alias => [alias, language]) ?? []),
	[formatName(language.name), language],
] as Languages));

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
