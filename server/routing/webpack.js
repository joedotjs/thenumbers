import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import { join } from 'path';

export default function (app) {
    const webpackConfig = require(join(__dirname, '../../webpack.config.js'))({dev: true});
    const webpackCompiler = webpack(webpackConfig);
    app.use(devMiddleware(webpackCompiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
    }));
    app.use(hotMiddleware(webpackCompiler));
}