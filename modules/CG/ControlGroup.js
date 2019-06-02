//@ts-check
//import { Listener } from '../Listener.js';

export default class ControlGroup {
  constructor(props) {}

  listeners() {
    console.error(`ControlGroup Super, Must Override`);
  }

  wrapper(html) {
    return `
    <div> Super </div>
    ${html}
    `;
  }
}
