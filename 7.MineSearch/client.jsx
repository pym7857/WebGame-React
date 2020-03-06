// 불러오기 
const React = require('react');
const ReactDOM = require('react-dom');
const { hot } = require('react-hot-loader/root');

import MineSearch from './MineSearch';

const Hot = hot(MineSearch);

ReactDOM.render(<Hot />, document.querySelector('#root'));