//@ts-check

import ControlGroup from './xControlGroup.js';
import {Listener, LISTENERS} from '../Listener.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**

 * @extends {ControlGroup}
 */
export default class Info extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Info'; //Friendly
    this.id = 'info'; //camelCase
    this.selector = `#${this.id}`;

    this.setState = props.setState;
    this.getState = props.getState;
  }

  /**
   * Place a Listener on the whole component
   * Dont need to bind this 
   * @returns {Listener | Array<Listener>}
   */
  listeners = () => {
    return [
      new Listener({
        type: LISTENERS.CLICK,
        callback: this.handleClick, //dont need to bid
        cgId: this.selector, //or key - dont need both
        keys: null
      }),
    ];
  }

  /**@param {Event} e */
  handleClick = (e) => {
    console.log(`Replace ${this.id} click`);
    throw new Error('Method not implemented.');
  }


  /**
   * param {object} props
   * @param {State} state
   * @returns {string} HTML to render
   */
  render = (state) => {
    // Insert the variables here

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">

        <div class="tag-row">
          What does this do?
        <ul>
        <li>Create SVG Lines cmd-shift-L</li>
        <li>Add metadata to Lines</li>
        <li>and/or</li>
        <li>Create Points cmd-shift-P</li>
        <li>Add metadata to Points</li>
        <li>and/or</li>
        <li>Create Relations between Points, Lines, and Points and Lines (M - M) cmd-shift-R</li>
        <li>Export to string or json</li>
        </ul>
          <h1>Template</h1>
        </div>
      
      </div>
      `
    });
  }
}
