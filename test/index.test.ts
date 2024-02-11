import * as fs from 'node:fs'
import * as prettier from 'prettier'

import { describe, expect, it } from 'vitest'

import Slidev from '../src'

async function format(src: string, options: prettier.Options = {}) {
  return await prettier.format(src, {
    parser: 'slidev',
    plugins: [Slidev],
    ...options,
  })
}

describe('format', () => {
  const files = fs.readdirSync('./test/inputs')
  const configs = fs.readdirSync('./test/configs')
  for (const file of files) {
    const src = fs.readFileSync(`./test/inputs/${file}`, 'utf-8')
    for (const configFile of configs) {
      const config = JSON.parse(
        fs.readFileSync(`./test/configs/${configFile}`, 'utf-8'),
      )
      it(`should format ${file} in config ${configFile} correctly`, async () => {
        expect(await format(src, config)).toMatchFileSnapshot(
          `./outputs/${file.slice(0, -3)}_${configFile.slice(0, -5)}.md`,
        )
      })
    }
  }
})
