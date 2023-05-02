module.exports = {
  'parserOptions': {
    'project': ['./tsconfig.json']
  },

  // Set jest/react versions for testing
  'settings': {
    'jest': {
      'version': 29,
    },
    'react': {
      'version': '18.0',
    },
  },

  'extends': [
    './lint-configs/react',
    'plugin:react/jsx-runtime'
  ],
  rules:{
    // Disabled for now because non-null assertions are needed
    // to work around generated type properties being optional
    // ATLAS-980 - Investigate Issues with Generated Types and Non-Null Assertions
    // https://infosum.atlassian.net/browse/ATLAS-980
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/jsx-max-props-per-line': [1, { 'maximum': 1, }],
    'react/self-closing-comp': [1, {
      'component': true
    }],
    'react/no-unstable-nested-components': ['error', {
      allowAsProps: true,
    }],
    'object-property-newline': [2, {allowAllPropertiesOnSameLine: true}],
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxBOF': 0 }],
		'react/no-unknown-property': ['error', { ignore: ['position', 'geometry', 'transparent', 'alphaTest', 'map', 'attach', 'args'] }],

  }
};
