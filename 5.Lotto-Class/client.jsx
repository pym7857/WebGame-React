// 불러오기 
const React = require('react');
const ReactDOM = require('react-dom');
const { hot } = require('react-hot-loader/root');

import Lotto from './Lotto';

const Hot = hot(Lotto);

ReactDOM.render(<Hot />, document.querySelector('#root'));