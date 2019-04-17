//@ts-check
import { createStore } from './modules/FauxDeux.js';
import reducers from './reducers.js';
import Editor from './modules/Editor.js';

/**
 * @typedef {import('./modules/FauxDeux').Store} Store
 * @typedef {import('./modules/FauxDeux').ActionCreator} ActionCreator
 * */

/**@type {ActionCreator} */
function changeName(text){
  return {type: 'CHANGE_NAME', text};
}

window.onload = function() {
  fetch('./data.json')
    .then(response => response.json())
    .then(json => json)
    .then(state => {

   
      const store = createStore(reducers, state);

      console.log(store.dispatch(changeName('ee')));
    });
};
