//@ts-check

import Editor from './modules/Editor.js';

window.onload = function() {
  fetch('./data.json')
    .then(response => response.json())
    .then(json => json)
    .then(state => {

      const e = new Editor({
        state: state,
        id: document.querySelector('#app'),
        // mainId: document.querySelector('.ad-Container-main'),
        // controlId: document.querySelector('.ad-Container-controls')  
      });

      e.render();
      // console.log(store.dispatch(changeName('ee')));
    });
};
