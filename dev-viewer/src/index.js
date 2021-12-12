import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter } from "react-router-dom"
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const initialState = {
	value: 0
}

function reducer(state = initialState, action) {
  switch (action.type) {
		case 'add': {
			return {
				...state,
				value: state.value + 1
			}
		}
		case 'del': {
			return {
				...state,
				value: state.value - 1
			}
		}
		case 'reset': {
			return {
				...state,
				value: 0
			}
		}
		default:
			return state
	}
  // const key = action.key;
  // const val = action.val;
  // console.log(key,val)
  // if (action.type === 'add') {
  //   stateMap.set(key, val);
  //   return state;
  // } else if (action.type === 'del') {
  //   stateMap.delete(key);
  //   return state;
  // } else {
  //   return state;
  // }
}

let store = createStore(reducer);

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
      <Provider store={store}>
        <App/>
      </Provider>
  </BrowserRouter>
  // </React.StrictMode>
  ,document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
