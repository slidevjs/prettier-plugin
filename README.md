# prettier-plugin-slidev

A [Prettier](https://prettier.io/) plugin for [Slidev](https://sli.dev/).

## Install

```bash
npm i -D prettier prettier-plugin-slidev
```

### Activate the plugin

Create or modify your [prettier configuration file](https://prettier.io/docs/en/configuration) to activate the plugin:

```json
{
  "plugins": ["prettier-plugin-slidev"]
}
```

If only some of the Markdown files are the slides, you can configure the plugin to only format the slides:

```json
{
  "overrides": [
    {
      "files": "slides/*.md",
      "options": { "parser": "slidev" }
    }
  ]
}
```
