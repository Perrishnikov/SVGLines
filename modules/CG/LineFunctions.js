//@ts-check

import ControlGroup from './xControlGroup.js';
import Listener from '../Listener.js';
import { Button } from './xComponents.js';

/**
 * @typedef {import('../CORE').CORE} CORE
 */

/**
 * Control Group for manipulating Lines
 * @class LineFunctions
 * @extends {ControlGroup}
 */
export default class LineFunctions extends ControlGroup {
  /**
   * 
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   * @param {CORE} props.CORE
   */
  constructor(props) {
    super();
    this.name = 'Line Functions';
    this.id = 'lineFunctions';

    this.CORE = props.CORE;
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
        case 'undoLine':
          this.undoLine();
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

  undoLine() {
    console.log(`addLine`);
  }

  removeLine() {
    this.CORE.removeActiveLine();
  }

  render() {
    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control-row button-row">
        ${Button({
          dataAction:'removeLine',
          name:'Remove Line',
        })}
        ${Button({
          dataAction:'undoLine',
          name:'Undo Remove',
        })}
        ${Button({
          dataAction: 'resetLine',
          name: 'Reset Line'
        })}
      </div>
      `
    });
  }
}
