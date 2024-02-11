import antfu from '@antfu/eslint-config'

export default antfu({
  includes: [
    'src/**/*',
  ],
  ignores: [
    'test/inputs/**',
    'test/outputs/**',
  ],
  typescript: true,
})
