//@ts-check

import ControlGroup from './ControlGroup.js';
import Listener from '../Listener.js';
import { Button } from '../Controls.Wrappers.js';

/**
 * @typedef {import('../Editor.Controls').LocalState["ACTIVE"]} Active
 * @typedef {import('../Editor.Controls').LocalState} LocalState
 * @typedef {import('../Editor.Controls').Icon} Icon
 */

/**
 * Control Group for manipulating Lines
 * @class LineFunctions
 * @extends {ControlGroup}
 */
export default class LineFunctions extends ControlGroup {
  constructor(props) {
    super();

    this.name = 'Line Functions';
    this.id = 'lineFunctions';
    this.selector = `#${this.id}`;
    this.addLine = props.addLine;
    this.removeLine = props.removeLine;
    this.resetLine = props.resetLine;
  }

  /**
   * Place a Listener on the whole component
   */
  listeners() {
    return new Listener({
      caller: this.name,
      selector: this.selector,
      type: 'click',
      callback: this.handleClick.bind(this)
    });
  }

  handleClick(e) {
    /** @type {LocalState['HELP']} */
    const action = e.target.dataset.action;
    // console.log(`${this.name}: data-action: ${action}`);

    switch(action){
      case 'resetLine': this.resetLine();
      break;
      case 'addLine': this.addLine();
      break;
      case 'removeLine': this.removeLine();
      break;
    }
  }


  render() {
    return super.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control-row">
        ${Button({
          action: 'resetLine',
          name: 'Reset Line'
        })}
        ${Button({
          action:'addLine',
          name:'Add Line',
        })}
        ${Button({
          action:'removeLine',
          name:'Remove Line',
        })}
      </div>
      `
    });
  }
}
