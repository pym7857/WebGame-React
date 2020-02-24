const path = require('path'); 

module.exports = {
    name: 'gugudan-setting',
    mode: 'development',
    devtool: 'eval', 
    resolve: {
        extensions: ['.js', '.jsx'], 
    },
    
    entry: { // 입력 
        app: ['./client'], 
    },
    module : { // loader
        rules: [{
            test: /\.jsx?/,
            loader: 'babel-loader',
            options: {
                presets: [ // presets는 plugin들의 모음집
                    ['@babel/preset-env', {
                        targets: {
                            browsers: ['> 1% in KR'], // github/browserslist
                        },
                        debug: true,
                    }], 
                    '@babel/preset-react'
                ], 
                plugins: [],
            },
        }],
    },
    plugins: [

    ],
    output: { // 출력 
        path: path.join(__dirname, 'dist'), // path.join() : 경로를 합쳐줌 ( __dirname: 현재폴더(=lecture) + dist폴더 )
                                            // 실제 dist의 경로 : C:\ReactTutorial\dist (=복잡)
        filename : 'app.js',
    },
};