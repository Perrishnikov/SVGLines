//@ts-check

window.onload = function() {
  fetch('./data.json')
    .then(response => response.json())
    .then(json => json)
    .then(state => {
      

      console.log(state);
    });
};
