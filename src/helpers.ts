import _languages, { type Language } from "linguist-languages";

export const formatName = (name: string) => name.toLowerCase().replaceAll(" ", "-");

type Languages = Array<[string, Language]>;

const languages: Languages = Object.entries(_languages).map(([name, language]) => [name.toLowerCase(), language]);

export const languageNames = new Map(languages);

export const languageAliases = new Map(languages.flatMap(([_, language]) => [
	...(language.aliases?.map(alias => [alias, language]) ?? []),
	[formatName(language.name), language],
] as Languages));
