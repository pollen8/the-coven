/**
 * React eslint base config without jest
 * Extends from the TypeScript config
 *
 * See README.md for usage
 *
 * Some rules are commented out because they are too strict
 * but we may want to re-introduce them in future
 */

module.exports = {
  'extends': [
    'plugin:react/recommended',
    'react-app',
    './typescript',
    'plugin:react/jsx-runtime',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
  },
  'plugins': [
    'react',
  ],
  'rules': {
    // Removed this rule as it's broken for React classes and
    // is already handled by TypeScript
    'no-invalid-this': 'off',

    // Specify whether double or single quotes should be used in JSX attributes
    // https://eslint.org/docs/rules/jsx-quotes
    'jsx-quotes': [1, 'prefer-double'],

    // Enforce boolean attributes notation in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
    'react/jsx-boolean-value': ['error', 'never', { always: [] }],

    // Enforce or disallow spaces inside of curly braces in JSX attributes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
    // 'react/jsx-curly-spacing': ['error', 'never', { allowMultiline: false }],


    // Enforce PascalCase for user-defined JSX components
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
    'react/jsx-pascal-case': ['error', {
      allowAllCaps: true,
      ignore: [],
    }],

    // Warn when using dangerous JSX properties
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
    'react/no-danger': 'warn',

    // Enforce spacing around jsx equals signs prop="value"
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
    'react/jsx-equals-spacing': [2, 'never'],

    // Prevent problem with children and props.dangerouslySetInnerHTML
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
    'react/no-danger-with-children': 'warn',

    // Enforce linebreaks in curly braces in JSX attributes and expressions.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
    'react/jsx-curly-newline': ['error', {
      multiline: 'consistent',
      singleline: 'consistent',
    }],

    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/self-closing-comp': [1, {
      'component': true
    }],
    'react/no-unstable-nested-components': ['error', {
      allowAsProps: true,
    }],
    'object-property-newline': [2, { allowAllPropertiesOnSameLine: true }],
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxBOF': 0 }],

    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-max-props-per-line': [
      2,
      { maximum: 1, when: 'multiline' },
    ],
    'react/jsx-indent-props': [2, 2],
    'react/jsx-closing-bracket-location': [
      2,
      'tag-aligned',
    ],
  },
};
