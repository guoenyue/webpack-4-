const path = require("path");
//将js自动插入模版页面
const htmlWebpackPlugin=require("html-webpack-plugin");
//提取css或其他文本注入到生成后的模版,注意当使用wp4+的时候，安装请使用@next.否则安装下来不支持wp4版本,
//并且有的资料说使用新的mini-css-extract-plugin插件替换
//资料地址:https://segmentfault.com/a/1190000014247030
const extractTextWebpackPlugin=require("extract-text-webpack-plugin");
//使用mini-css-extract-plugin
const miniCssExtract=require("mini-css-extract-plugin");
//webpack
const webpack=require("webpack");

const config = {
    devtool:"source-map",
    mode:"development",
    entry:{
        index:"./app/js/index.js"
    },
    output:{
        path:path.resolve(__dirname,"dist/"),
        filename:"js/[name].[hash:8].js",
        publicPath:"/",
        chunkFilename:"[name].[chunkhash:8].js"
    },
    module:{
        rules:[
            {
                test:/\.js/i,
                exclude:/node_modules/,
                use:{
                    loader:"babel-loader",
                    options:{
                        presets:["es2015"]
                    }
                }
            },
            {
                test:/\.css/i,
                use:[miniCssExtract.loader,"css-loader","postcss-loader"]
                //以下是使用extract-text-webpack-plugin的设置情况
                // use:extractTextWebpackPlugin.extract({
                //     fallback:"style-loader",
                //     use:"css-loader!postcss-loader"
                //     //这里使用了postcss-loader，顺序必须放成style-loader->css-loader->postcss-loader这种
                //     //并且在webpack.config.js的同级别配置目录中还需要编写postcss的配置文件，postcss.config.js
                //     //需要同时安装autoprefixer
                // })
            },
            {
                test:/\.(jpg|png|gif|svg)/,
                //use:"url-loader?limit=2500&name=[hash:8].[name].[ext]&outputPath=images"
                use:{
                    loader:"url-loader",
                    query:{
                        limit:2500,
                        name:'[hash:8].[name].[ext]',
                        outputPath:"images"
                    }
                }
            },
            {
                test:/\.html/i,
                use:{
                    loader:"html-withimg-loader"
                }
            }
        ]
    },
    plugins:[
        //这里注意一下，html-webpack-plugin跟html-loader/html-withimg-loader会在解析html冲突，导致html中不可以使用ejs模版
        //也不能在模版页读到htmlWebpackPlugin（固定的全局变量），暂时没有兼容的解决方案
        new htmlWebpackPlugin({
            title:"webpack",
            template:"./app/views/index.tmpl.html",
            filename:"./index.html",
            inject:"body",
            minify:true
        }),
        //使用extract-text-webpack-plugin的配置
        // new extractTextWebpackPlugin({
        //     filename:"./css/[name].css"
        // }),
        //使用mini-css-extract-plugin的配置
        new miniCssExtract({
            filename: "./css/[name].[chunkhash:8].css",
            chunkFilename: "[id].css"
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve:{
        extensions:[".js",".css"]
    },
    devServer:{
        port:"4200",
        host:"127.0.0.1",
        contentBase:path.resolve(__dirname,"dist"),
        hot:true
    }
};

module.exports=config;