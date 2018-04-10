const path = require('path');
const appPath = path.resolve(__dirname, 'example');

module.exports = {
    mode: "development",
    context: appPath,
    entry: {
        main: ['./styles.css', './main.js'],
    },
    output: {
        path: __dirname,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: appPath,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/react",
                            [ "@babel/env", {
                                "targets": {
                                    browsers: '> 1%'
                                }
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                include: appPath,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            }
        ]
    },
    resolve: {
        modules: [appPath, 'node_modules'],
        extensions: ['.js']
   }
}