import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

console.log('%cStop!', 'color:red; font-size:60px; font-weight: bold; -webkit-text-stroke: 1px black;');
console.log('%cThis is a browser feature intended for developers. If someone told you to copy and paste something here it is probably a scam and will give them access to your account.', 'font-size: 18px;');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
