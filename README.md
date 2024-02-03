# prettier-plugin-slidev

A [Prettier](https://prettier.io/) plugin for [Slidev](https://sli.dev/).

## Install

```bash
npm i -D prettier prettier-plugin-slidev
```

Currently, it requires https://github.com/slidevjs/slidev/pull/1268 to run correctly. So you should install `@slidev/parser` and `@slidev/types` from https://github.com/KermanX/slidev/tree/frontmatter-raw :

```sh
```

### Activate the plugin

Create or modify your [prettier configuration file](https://prettier.io/docs/en/configuration) to activate the plugin:

```json
{
  "overrides": [
    {
      "files": ["slides.md", "pages/*.md"],
      "options": {
        "parser": "slidev",
        "plugins": ["prettier-plugin-slidev"]
      }
    }
  ]
}
```

Note that only specifying `plugins` is not enough, because Slidev and common Markdown files share the same file extension `.md`.
