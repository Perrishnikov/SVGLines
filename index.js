
//@ts-check

import Editor from './modules/Editor.js';

window.onload = function() {
  fetch('./data/settings.json')
    .then(response => response.json())
    .then(json => json)
    .then(settingState => {

      fetch('./data/line.json')
        .then(response => response.json())
        .then(json => json)
        .then(defaultState => {
          const solidState = Object.assign({}, settingState, defaultState);

          const e = new Editor({
            state: solidState,
            id: document.querySelector('#app'),
          });
          e.setState(solidState);
          
          return e
        }).then(e => {
          //add all the event listeners once the DOM is ready
          e.addDOMListeners();
          console.log(e.registeredListeners);
        })

    });
};
