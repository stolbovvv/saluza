import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

/**
 * @see https://eslint.org/docs/latest/use/configure/
 */
export default defineConfig([
	{
		ignores: ['node_modules', 'public', 'build', 'dist', '**/*.min.*'],
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: { js, import: importPlugin, prettier: prettierPlugin },
		extends: [js.configs.recommended],
		rules: {
			'prettier/prettier': 'warn',
			'sort-imports': [
				'error',
				{
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
					memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
				},
			],
			'import/order': [
				'error',
				{
					alphabetize: { order: 'asc', caseInsensitive: true },
					groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object'],
					pathGroups: [
						{
							pattern: '@/**',
							group: 'internal',
							position: 'after',
						},
					],
					'newlines-between': 'always',
				},
			],
			'no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
		},
	},
]);
