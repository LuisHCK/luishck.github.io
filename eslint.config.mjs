import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import globals from 'globals'
import * as astroParser from 'astro-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
    js.configs.recommended,
    ...astro.configs['flat/recommended'],
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
        files: ['**/*.{js,mjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
]
