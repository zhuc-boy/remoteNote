module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [ // 自动按需引入组件 style属性自定义主题
      'import',
      { libraryName: 'vant', libraryDirectory: 'es', style: true },
      'vant'
    ]
  ]
};
