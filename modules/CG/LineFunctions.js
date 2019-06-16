//@ts-check

import ControlGroup from './_ControlGroup.js';
import Listener from '../Listener.js';
import { Button } from './_Components.js';

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
    // this.selector = `#${this.id}`;
  }

  /**
   * Place a Listener on the whole component
   */
  listeners() {
    return new Listener({
      type: 'click',
      callback: this.handleClick.bind(this),
      cgId: '#lineFunctions',
      keys: null
    });
  }

  /**param {EventTarget} e*/
  handleClick(e) {
    /** @type {HTMLElement} */
    const dataAction = e.target.closest('[data-action]');

    // console.log(`${this.name}: data-action: ${action}`);
    if (dataAction) {
      const action = dataAction.dataset.action;

      switch (action) {
        case 'resetLine':
          this.resetLine();
          break;
        case 'addLine':
          this.addLine();
          break;
        case 'removeLine':
          this.removeLine();
          break;
      }
    }

  }

  resetLine() {
    console.log(`resetLine`);
  }

  addLine() {
    console.log(`addLine`);
  }

  removeLine() {
    console.log(`removeLine`);
  }

  render() {
    return this.wrapper({
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
