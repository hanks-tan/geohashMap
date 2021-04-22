module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    node: true,
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'v/vue/valid-v-for': 0,
    'no-control-regex': 0,
    'quotes': [1, 'single'],
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'semi': [2, 'never'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': ['error', 2],
    'eqeqeq': [0, 'always'],
    'standard/object-curly-even-spacing': [0, 'either'],
    'no-use-before-define': 1,
    'no-const-assign': 2,
    'no-undef': 2,
    'no-unused-vars': [1, { 'vars': 'all', 'args': 'after-used' }],
    'no-cond-assign': 2,// 禁止在条件表达式中使用赋值语句
    'no-extra-boolean-cast': 2,// 禁止不必要的bool转换
    'no-extra-parens': 2,// 禁止非必要的括号
    'no-extra-semi': 2,// 禁止多余的冒号
    'no-inline-comments': 0,// 禁止行内备注
    'no-multi-spaces': 2,// 不能用多余的空格
    'no-irregular-whitespace': 2,// 不能有不规则的空格
    'no-multiple-empty-lines': [1, { 'max': 2 }],// 空行最多不能超过2行
    'no-undef-init': 2,// 变量初始化时不能直接给它赋值为undefined
    'arrow-parens': 2,// 箭头函数用小括号括起来
    'arrow-spacing': 2,// =>的前/后括号
    'spaced-comment': 2,// 注释风格要不要有空格什么的
    'space-infix-ops': 2, // 操作符周围空格
    'key-spacing': [2, { 'beforeColon': false, 'afterColon': true }],// 对象字面量中冒号的前后空格
    'space-before-function-paren': ['error', 'always'],
  }
}