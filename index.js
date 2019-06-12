
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

          const ed = new Editor({
            state: solidState,
            id: document.querySelector('#app'),
          });
          ed.setState(solidState);
          
          return ed;
        }).then(ed => {
          //add all the event listeners once the DOM is ready
          ed.addDOMListeners();
          console.log(ed.registeredListeners);
        })

    });
};
