require('@reskript/config-lint/patch');

module.exports = {
    extends: require.resolve('@reskript/config-lint/config/eslint'),
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    rules: {
        // close some rules
        'react/jsx-no-bind': 'off',
        // open some rules
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
    },
};
