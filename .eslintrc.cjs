module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'unused-imports', 'simple-import-sort'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
      overrides: [
        {
            files: ['**/*.js?(x)', '*.ts?(x)', '**/*.ts?(x)', '*.js?(x)'],
            rules: {
                'unused-imports/no-unused-imports': 'error',
                'simple-import-sort/imports': 'error',
                'simple-import-sort/exports': 'error',
                'react-hooks/exhaustive-deps': ['warn'],
                '@typescript-eslint/no-unused-vars': [
                    'warn', // or "error"
                    {
                        argsIgnorePattern: '^_',
                        varsIgnorePattern: '^_',
                        caughtErrorsIgnorePattern: '^_',
                    },
                ],
            },
        },
      ]
}
