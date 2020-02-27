// 불러오기 
const React = require('react');
const ReactDOM = require('react-dom');
const { hot } = require('react-hot-loader/root');

import RSP from './RSP';

const Hot = hot(RSP);

ReactDOM.render(<Hot />, document.querySelector('#root'));