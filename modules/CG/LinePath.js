//@ts-check

import ControlGroup from './_ControlGroup.js';
import Listener from '../Listener.js';

/**
 * @typedef {import('../Editor').State} State
 * @typedef {import('../CORE').PointType} PointType
 * @typedef {import('../CORE').CORE} CORE
 */
/**
 * @class LinePath
 * @extends {ControlGroup}
 */
export default class LinePath extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   * @param {CORE} props.CORE
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Line Path';
    this.id = 'linePath';
    this.selector = `#${this.id}`;


    this.CORE = props.CORE;
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
        callback: this.handleClick, //dont need to bid
        cgId: this.selector, //or key - dont need both
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
    // Insert the variables here
    const activeLine = state.lines[state.activeLineIndex];

    const path = `d="${this.CORE.generatePath(
      activeLine.points, activeLine.closePath
      )}"`;

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">

        <div class="tag-row">
          < ${path.toString()}/>          
        </div>
      
      </div>
      `
    });
  }
}
