const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  stylistic: true, // enable stylistic formatting rules
  typescript: true,
  vue: true,
  jsonc: false,
  yml: false,
  ignores: [
    'public/**/*',
  ],
}, {
  rules: {
    'no-console': 'off',
    'no-alert': 'off',
    'node/prefer-global/process': 'off',
    'unused-imports/no-unused-vars': 'off',
    'new-cap': 'off',
    'ts/no-this-alias': 'off',
    'no-restricted-globals': 'off',
  },
})
