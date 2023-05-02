/**
 * TypeScript base config (without React or Jest)
 *
 * See README.md for usage
 */

module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': [
    'google'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint',
    'only-warn',
  ],
  'ignorePatterns': [
    '**/*.generated.ts',
    '**/react-app-env.d.ts',
    '**/*.typegen.ts',
  ],
  'rules': {
    'max-len': ['error', { 'code': 180, 'ignorePattern': 'd="([\\s\\S]*?)"' }],
    'camelcase': ['off'],
    'valid-jsdoc': ['off'],
    'require-jsdoc': ['off'],
    'react/prop-types': ['off'],
    'react/display-name': ['off'],
    'new-cap': ['error', { 'capIsNewExceptions': ['^@'] }],
    'comma-dangle': ['error', {
      'functions': 'only-multiline',
      'arrays': 'only-multiline',
      'objects': 'only-multiline',
      'imports': 'only-multiline',
      'exports': 'only-multiline',
    }],
    'operator-linebreak': ['error', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
    'arrow-parens': ['off'],

    // TypeScript

    // Enforce consistent indentation
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/indent.md
    // note you must disable the base rule as it can report incorrect errors
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2, { 'MemberExpression': 1, 'SwitchCase': 1 }],

    // Enforce consistent spacing inside braces.
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/object-curly-spacing.md
    // note you must disable the base rule as it can report incorrect errors
    'object-curly-spacing': 'off',
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],

    // Disallows non-null assertions using the ! postfix operator.
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Require consistent spacing around type annotations.
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/type-annotation-spacing.md
    '@typescript-eslint/type-annotation-spacing': 'warn',

    // Disallow unnecessary semicolons
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-extra-semi.md
    // note you must disable the base rule as it can report incorrect errors
    'no-extra-semi': 'off',
    '@typescript-eslint/no-extra-semi': ['error'],

    // Turn off disallowing the use of the any type
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-explicit-any.md
    '@typescript-eslint/no-explicit-any': 'off',

    // Disallow unused variables
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unused-vars.md
    // note you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true, 'varsIgnorePattern': '[_]' }],

    // Ensures there are spaces around infix operators
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/space-infix-ops.md
    // note you must disable the base rule as it can report incorrect errors
    'space-infix-ops': 'off',
    '@typescript-eslint/space-infix-ops': ['error', { 'int32Hint': false }],
  },
};
