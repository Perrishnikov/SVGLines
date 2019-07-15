//@ts-check

import ControlGroup from './xControlGroup.js';
import { Listener, LISTENERS } from '../Listener.js';
import { Button, Range, CheckBox } from './xComponents.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**
 * //TODO: Replace Descriptions
 * @class 
 * @extends {ControlGroup}
 */
export default class BackgroundImage extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Background Image';
    this.id = `backgroundImage`;
    this.selector = `#${this.id}`;

    this.setState = props.setState;
    this.getState = props.getState;

    this.OPTIONS = {
      TRANSP: 'Transparency',
      TRANSP_ID: '#bgImageTrans'
    };

    this.bgImageAlpha = 1;
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
      new Listener({
        type: LISTENERS.INPUT,
        callback: this.handleInput,
        cgId: this.OPTIONS.TRANSP_ID,
        keys: null
      }),
    ];
  }

  /**@param {Event} e */
  handleInput = (e) => {

    const type = e.target.closest(`[data-type]`);

    this.bgImageAlpha = type.value;

    const svg = document.querySelector('.ad-SVG');
    svg.setAttribute('style', `opacity: ${type.value}`);
    // console.log(type.value);


  }

  /**@param {Event} e */
  handleClick = (e) => {
    console.log(`Replace ${this.id} click`);
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

        <div class="control-row button-row">
        ${Button({
          dataAction:'addImage',
          name:'Add Image',
        })}
        </div>

        <div class="control-row">
          ${Range({
            dataType: 'bgImage',
            dataAction: this.OPTIONS.TRANSP,
            name: this.OPTIONS.TRANSP,
            value: this.bgImageAlpha,
            min: 0,
            max: 1,
            step: .1,
            id: 'bgImageTrans'
          })}
        </div>
      
      </div>
      `
    });
  }
}
