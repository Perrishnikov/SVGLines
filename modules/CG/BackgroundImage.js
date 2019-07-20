//@ts-check

import ControlGroup from './xControlGroup.js';
import { Listener, LISTENERS } from '../Listener.js';
import { Button, Range, CheckBox } from './xComponents.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**
 * Editor.Main.js handles displaying the image
 * @class BackgroundImage
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
      OPAC: 'Opacity',
      OPAC_ID: 'bgImageOpac',
      OPAC_SEL: '#bgImageOpac',
      LEFT: 'X Axis',
      LEFT_ID: 'bgImageX',
      LEFT_SEL: '#bgImageX',
      TOP: 'Y Axis',
      TOP_ID: 'bgImageY',
      TOP_SEL: '#bgImageY'
    };

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
        cgId: this.OPTIONS.OPAC_SEL,
        keys: null
      }),
      new Listener({
        type: LISTENERS.INPUT,
        callback: this.handleInput,
        cgId: this.OPTIONS.LEFT_SEL,
        keys: null
      }),
      new Listener({
        type: LISTENERS.INPUT,
        callback: this.handleInput,
        cgId: this.OPTIONS.TOP_SEL,
        keys: null
      }),
    ];
  }


  /**@param {Event} e */
  handleInput = (e) => {
    /**@type {State} */
    const { background } = this.getState();
    const action = e.target.closest(`[data-action]`);
    const dataset = action.dataset.action;
    const value = action.value;

    switch (dataset) {
      case this.OPTIONS.OPAC:
        this.handleOpactiy(background, value);
        break;
      case this.OPTIONS.LEFT:
        this.handleLeft(background, value);
        break;
      case this.OPTIONS.TOP:
        this.handleTop(background, value);
        break;
      default:
        break;
    }
  }

  /**  
   * @param {State['background']} background
   * @param {number} value
   */
  handleTop(background, value) {
    const main = document.querySelector('#main img');
    main.style.top = value;

    background.top = value;
    this.setState({ background });
  }

  /**  
   * @param {State['background']} background
   * @param {number} value
   */
  handleLeft(background, value) {
    const main = document.querySelector('#main img');
    main.style.left = value;

    background.left = value;
    this.setState({ background });
  }

  /**  
   * @param {State['background']} background
   * @param {number} value
   */
  handleOpactiy(background, value) {
    const main = document.querySelector('#main img');
    main.style.opacity = value;

    background.opacity = value;
    this.setState({ background });
  }


  /**@param {Event} e */
  handleClick = (e) => {
    /**@type {HTMLElement} */
    const buttonClick = event.target.closest('button');
    const action = e.target.closest(`[data-action]`);
    const dataset = action ? action.dataset : null;

    if (buttonClick) {
      switch (buttonClick.dataset.action) {
        case 'addImage':
          console.log('add Image');
          break;
        default:
          console.error('Couldnt find button');
      }
    } else if (dataset.action == 'showBgImage') {
      /**@type {State} */
      const { background } = this.getState();

      background.show = !background.show;
      this.setState({ background });
      // console.dir(type);
    }
  }

  addBackgroundImage() {
    /**@type {State} */
    const { background } = this.getState();
  }

  /**
   * param {object} props
   * @param {State} [state]
   * @returns {string} HTML to render
   */
  render = (state) => {
    const { background } = state;

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">

        <div class="control-row button-row">
        ${Button({
          dataAction:'addImage',
          name:'Add Image',
          info: 'Not Implemented'
        })}
        </div>

        <div class="control-row">
        ${CheckBox({
          dataType: 'show',
          dataAction: 'showBgImage',
          value: background.show,
          name: 'Show Background Image',
          info:'Do you want to see the background image?'
        })}
        </div>

        <div class="control-row">
          ${Range({
            dataType: 'bgImage',
            dataAction: this.OPTIONS.OPAC,
            name: this.OPTIONS.OPAC,
            value: background.opacity,
            min: 0,
            max: 1,
            step: .1,
            id: this.OPTIONS.OPAC_ID
          })}
        </div>
        <div class="control-row">
          ${Range({
            dataType: 'bgImage',
            dataAction: this.OPTIONS.LEFT,
            name: this.OPTIONS.LEFT,
            value: background.left,
            min: -100,
            max: 100,
            step: 10,
            id: this.OPTIONS.LEFT_ID
          })}
        </div>
        <div class="control-row">
          ${Range({
            dataType: 'bgImage',
            dataAction: this.OPTIONS.TOP,
            name: this.OPTIONS.TOP,
            value: background.top,
            min: -100,
            max: 100,
            step: 10,
            id: this.OPTIONS.TOP_ID
          })}
        </div>
      
      </div>
      `
    });
  }
}
