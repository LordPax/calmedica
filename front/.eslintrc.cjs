module.exports = {
    root: true,
    extends: ['eslint:recommended', 'prettier', 'next/core-web-vitals'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    env: {
        node: true,
        es2024: true,
    },
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
        indent: ['error', 4, { SwitchCase: 1 }],
        quotes: ['warn', 'single', { avoidEscape: true }],
        semi: ['error', 'always'],
    },
};
