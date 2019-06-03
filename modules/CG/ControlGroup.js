//@ts-check
//import { Listener } from '../Listener.js';

export default class ControlGroup {
  constructor() {}

  listeners() {
    console.error(`ControlGroup Super, Must Override`);
  }

  wrapper(props) {
    const {html, title, id} = props;
    
    return `
    <div id="${id}" class="control-group">
      <span class="control-group-title">${title}</span>
      ${html}
    </div>
    `;
  }
}
