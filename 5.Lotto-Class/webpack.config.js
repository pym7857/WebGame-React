// 웹팩은 이 파일(webpack.config.js) 하나로 모든게 돌아간다.

const path = require('path'); // path 불러오기 

module.exports = {
    mode: 'development', // 실서비스: production
    devtool: 'eval', // 빠르게 하겠다. 
    resolve: {
        extensions: ['.js', '.jsx'], // 해당 확장자만 search 하겠다.
    },
    
    /* 입력부분에서는 client와 WordRelay class 부분을 넣는다. (둘을 합쳐서 app.js로 만들것) */
    entry: { // 입력 
        app: ['./client'], // client.jsx가 이미 WordRelay를 불러오고 있기 때문에, 얘만 적어줌 
    },

    module : { // entry에 있는 파일을 읽고, 거기에 module을 적용한 후, output에 뺀다.
        rules: [{
            test: /\.jsx?/, // js와 jsx파일에 rule을 적용하겠다 (= 정규표현식)
            loader: 'babel-loader', // babel-loader 적용 하겠다.
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
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    'react-hot-loader/babel',
                ],
            },
        }],
    },

    output: { // 출력 
        path: path.join(__dirname, 'dist'), // path.join() : 경로를 합쳐줌 ( __dirname: 현재폴더(=lecture) + dist폴더 )
                                            // 실제 dist의 경로 : C:\ReactTutorial\dist (=복잡)
        filename : 'app.js',
    },
};