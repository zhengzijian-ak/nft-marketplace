// 导入所需的插件和配置
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import airbnb from 'eslint-config-airbnb';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default [
  {
    // 环境配置
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    settings: {
        react: {
          version: 'detect'
        }
    },
    plugins: {
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...airbnb.rules
    }
  },
  {
    // 重写规则配置
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-console': 0,
      'jsx-a11y/label-has-associated-control': 0,
      'no-nested-ternary': 0,
      'consistent-return': 0,
      'no-alert': 0,
      'react/jsx-no-constructed-context-values': 0,
      'import/extensions': 0,
      'react/prop-types': 0,
      'linebreak-style': 0,
      'react/state-in-constructor': 0,
      'import/prefer-default-export': 0,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function'
        }
      ],
      'max-len': [
        2,
        550
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1
        }
      ],
      'no-underscore-dangle': [
        'error',
        {
            allow: [
              '_d',
              '_dh',
              '_h',
              '_id',
              '_m',
              '_n',
              '_t',
              '_text'
            ]
        }
      ],
      'object-curly-newline': 0,
      'react/jsx-filename-extension': 0,
      'react/jsx-one-expression-per-line': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'jsx-a11y/alt-text': 0,
      'jsx-a11y/no-autofocus': 0,
      'jsx-a11y/no-static-element-interactions': 0,
      'react/no-array-index-key': 0,
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: [
            'Link'
          ],
          specialLink: [
            'to',
            'hrefLeft',
            'hrefRight'
          ],
          aspects: [
            'noHref',
            'invalidHref',
            'preferButton'
          ]
        }
      ]
    }
  }
];