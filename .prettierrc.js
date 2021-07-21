module.exports = {
  printWidth: 80, //限制每行字符个数
  tabWidth: 2, //指定每个缩进级别的空格数
  useTabs: false, //使用制表符而不是空格缩进
  semi: true, //在语句末尾打印分号
  singleQuote: false, //使用单引号而不是双引号
  trailingComma: "es5", //多行时尽可能打印尾随逗号
  bracketSpacing: true, //在对象文字中的括号之间打印空格
  arrowParens: "always", //始终给箭头函数的参数加括号
  htmlWhitespaceSensitivity: "css", //指定HTML文件的全局空格敏感度
  endOfLine: "auto", //检测换行符类型，如果出现大量换行符报错，可以修改为auto不检测
};
