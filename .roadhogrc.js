// const path = require('path');

export default {
  entry: "src/index.js",
  extraBabelPlugins:[
    "transform-runtime",
    "transform-decorators-legacy",
    "transform-class-properties",
    ["import", { "libraryName": "antd-mobile", "libraryDirectory": "lib", "style": true }]
  ],
  extraPostCSSPlugins: [
    require('autoprefixer')({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
    }),
    //该配置用于手机端使用
    require('postcss-pxtorem')({
      rootValue: 100,
      propWhiteList: []
    })
  ],
  env:{
    development: {
      extraBabelPlugins: [
        "dva-hmr"
      ]
    },
    production: {}
  },
  externals:{
    "g2": "G2",
    "g-cloud": "Cloud",
    "g2-plugin-slider": "G2.Plugin.slider"
  },
  ignoreMomentLocale:true,
  theme: "./src/theme.js",

  proxy: {
    "/api": {
      // target: "http://jsonplaceholder.typicode.com/",// 正式服务器地址
      target: "http://127.0.0.1:9002/",// 正式服务器地址
      changeOrigin: true,
      secure: false,
      pathRewrite: { "^/api": "" }
    }
  }
}
