//@ts-check

import ControlGroup from './_ControlGroup.js';
import Listener from '../Listener.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**
 * Export
 * @class 
 * @extends {ControlGroup}
 */
export default class Export extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Export';
    this.id = 'export';
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
        type: 'click',
        callback: this.handleClick,
        cgId: this.selector,
        keys: null
      }),
    ];
  }

  handleClick = (e) => {
    console.log(`Replace ${this.selector} click`);
  }


  /**
   * param {object} props
   * @param {State} state
   * @returns {string} HTML to render
   */
  render = (state) => {


    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">

        <div class="tag-row">
          checkboxes for export options:<br>
          line id's<br>
          tags<br>
        </div>
      
      </div>
      `
    });
  }
}
