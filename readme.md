# gfm-lang-cli

Get the GFM-style aliases for a given language, or vice-versa.

## Install

```sh
npm install --global gfm-lang-cli
```

<details>
<summary>Other Package Managers</summary>

<br />

```sh
yarn global add gfm-lang-cli
```

</details>

## Usage

```txt
$ gfm-lang

  Usage
    $ gfm-lang <language or alias> […]

  Examples
    $ gfm-lang markdown js 'NPM Config' asdf

    ℹ Markdown - markdown, md, pandoc
    ℹ js (JavaScript) - javascript, js, node
    ℹ NPM Config - npm-config, npmrc
    ✖ asdf
```

## Related

- [linguist-languages](https://github.com/ikatyang/linguist-languages) - Linguist `languages.yml` in JSON format.
- [lang-map](https://github.com/jonschlinkert/lang-map) - Get the language associated with a file extension or the extensions associated with a language using the data from GitHub's [Linguist YAML file](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml).
