import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import react from 'eslint-plugin-react'
import globals from 'globals'
import * as astroParser from 'astro-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
    js.configs.recommended,
    ...astro.configs['flat/recommended'],
    ...[
        react.configs.flat.recommended,
        react.configs.flat['jsx-runtime'],
    ].map((config) => ({ ...config, files: ['**/*.jsx'] })),
    {
        ignores: ['dist/**', '.astro/**', 'node_modules/**'],
    },
    {
        files: ['**/*.astro'],
        languageOptions: {
            parser: astroParser,
            parserOptions: {
                parser: {
                    ts: tsParser,
                    js: 'espree',
                },
            },
        },
    },
    {
        files: ['**/*.{js,jsx,mjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'react/prop-types': 'off',
        },
    },
]
