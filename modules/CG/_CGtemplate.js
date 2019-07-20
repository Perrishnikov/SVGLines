//@ts-check

import ControlGroup from './xControlGroup.js';
import {Listener, LISTENERS} from '../Listener.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**
 * //TODO: Replace Descriptions
 * @class 
 * @extends {ControlGroup}
 */
export default class Template extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'TODO:'; //Friendly
    this.id = ''; //camelCase
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
          <h1>Template</h1>
        </div>
      
      </div>
      `
    });
  }
}
