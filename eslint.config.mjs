// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import mochaPlugin from "eslint-plugin-mocha";

export default tseslint.config(
  eslint.configs.recommended,
  mochaPlugin.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'warn',
      '@typescript-eslint/array-type': ['warn', { default: 'array-simple', readonly: 'generic' }],
      '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'no-public' }],
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-shadow': ['warn', { ignoreTypeValueShadow: true }],
      '@typescript-eslint/no-unnecessary-type-arguments': 'warn',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/prefer-regexp-exec': 'warn',
      '@typescript-eslint/typedef': ['warn', {
        parameter: true,
        propertyDeclaration: true
      }],
      '@typescript-eslint/unified-signatures': 'warn',

      camelcase: 'warn',
      'comma-spacing': 'warn',
      'constructor-super': 'warn',
      'eqeqeq': ['warn', 'smart'],
      'guard-for-in': 'warn',
      'id-blacklist': ['warn', 'any', 'Number', 'number', 'String', 'string', 'Boolean', 'boolean', 'Undefined', 'undefined'],
      'id-match': 'warn',
      'new-parens': 'warn',
      'no-bitwise': 'warn',
      'no-caller': 'warn',
      'no-cond-assign': 'warn',
      'no-duplicate-imports': 'warn',
      'no-empty': 'warn',
      'no-extra-bind': 'warn',
      'no-extra-boolean-cast': 'warn',
      'no-case-declarations': 'warn',
      'no-constant-condition': 'warn',
      'no-irregular-whitespace': 'warn',
      'no-new-wrappers': 'warn',
      'no-prototype-builtins': 'warn',
      'no-throw-literal': 'warn',
      'no-trailing-spaces': 'warn',
      'no-undef-init': 'warn',
      'no-unexpected-multiline': 'warn',
      'no-unused-labels': 'warn',
      'no-useless-escape': 'warn',
      'no-var': 'warn',
      'no-void': ['warn', { allowAsStatement: true }],
      'prefer-const': 'warn',
      'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'sort-imports': 'warn',
      'spaced-comment': ['warn', 'always', { exceptions: ['*-'], markers: ['/'] }],
      'use-isnan': 'warn',
      'valid-typeof': ['warn', { requireStringLiterals: true }],
    },
  },
);
