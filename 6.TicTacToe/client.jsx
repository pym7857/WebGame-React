// 불러오기 
const React = require('react');
const ReactDOM = require('react-dom');
const { hot } = require('react-hot-loader/root');

import TicTacToe from './TicTacToe';

const Hot = hot(TicTacToe);

ReactDOM.render(<Hot />, document.querySelector('#root'));