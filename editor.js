//@ts-check

import Editor from './modules/Editor.js';

window.onload = function() {
  fetch('./data.json')
    .then(response => response.json())
    .then(json => json)
    .then(state => {
      const e = new Editor({
        state,
        id: document.querySelector('#app'),
      });

      // e.render();
    });
};
