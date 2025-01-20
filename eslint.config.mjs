import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '.idea/',
      '.vscode/',
      '.DS_Store',
    ],
  },
  pluginJs.configs.recommended,
  prettierConfig,
  {
    plugins: { tailwindcss: tailwindcssPlugin },
    rules: {
      // Prefer const over let for variables that are never reassigned
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: true,
        },
      ],
      'no-unused-vars': [
        'error',
        {
          vars: 'all', // Check all variables
          args: 'after-used', // Check function arguments only if they are used after their declaration
          ignoreRestSiblings: true, // Ignore rest siblings in object destructuring
          varsIgnorePattern: '^_', // Ignore variables prefixed with _
          argsIgnorePattern: '^_', // Ignore arguments prefixed with _
        },
      ],
      'tailwindcss/classnames-order': 'warn', // Warn if classes are not ordered logically
      'tailwindcss/no-custom-classname': 'off',
    },
  },
];
