const path = require('path');

module.exports = {
  chainWebpack(config) {
    config.externals({
      react: 'React',
      'react-dom': 'ReactDOM',
    });

    config.devServer.historyApiFallback({
      rewrites: [{ from: /.*/, to: '/index.html' }],
    });

    // 别名设置
    config.resolve.alias.set('@/cmpt', path.join(__dirname, 'src', 'components'));
    config.resolve.alias.set('@', path.join(__dirname, 'src'));
  },
  babelPlugins: [
    ['babel-plugin-import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }, 'ant'],
    ['babel-plugin-import', { libraryName: '@jxkang/web-cmpt', libraryDirectory: 'lib', style: true }, '@jxkang/web-cmpt'],
  ],
  plugins: [

  ],
  builderDone() {
    console.log('打包完成...');
  },
};
