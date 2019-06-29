//@ts-check

//move stuff from Editor.Main here. 


import ControlGroup from './_ControlGroup.js';
import Listener from '../Listener.js';
import { Button, Range, CheckBox } from './_Components.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**
 * 
 * @class 
 * @extends {ControlGroup}
 */
export default class CanvasSettings extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   * @param {import('../Editor').Validate} props.validate
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Canvas Settings';
    this.id = 'canvasSettings';
    this.selector = `#${this.id}`;

    this.C = {
      updateCanvas: 'updateCanvas',
      resetCanvas: 'resetCanvas',
      canvasWidth: 'canvasWidth',
      canvasHeight: 'canvasHeight',
      canvasErrorMess: 'canvasErrorMess'
    };

    this.validate = props.validate;
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
        callback: this.handleClick, //dont need to bind
        cgId: this.selector, //or key - dont need both
        keys: null
      }),
    ];
  }


  toggleErrorMessage = () => {
    const error = document.querySelector(`#${this.C.canvasErrorMess}`);

    if (!error.classList.contains('active'))
      error.classList.add('active');
  }


  updateCanvasDimenstions = () => {
    // const { w, h } = this.getState();

    const newHeight = document.querySelector(`[data-action="${this.C.canvasHeight}"]`).textContent;

    const newWidth = document.querySelector(`[data-action="${this.C.canvasWidth}"]`).textContent;

    if (
      this.validate.isNotEmpty(newHeight) &&
      this.validate.isNumber(newHeight) &&
      // this.validate.isNotSame(newHeight, h.toString()) &&
      this.validate.isLessThan(newHeight, 6) &&
      this.validate.isGreaterThan(newHeight, 2) &&
      this.validate.isNotEmpty(newWidth) &&
      this.validate.isNumber(newWidth) &&
      // this.validate.isNotSame(newWidth, w.toString()) &&
      this.validate.isLessThan(newWidth, 6) &&
      this.validate.isGreaterThan(newWidth, 2)
    ) {
      this.setState({
        h: newHeight,
        w: newWidth,
      });
    } else {
      this.toggleErrorMessage();
    }
  }

  resetCanvasDimenstion = () => {
    //only if the values are different...
  }

  handleClick = (e) => {
    /**@type {HTMLElement} */
    const buttonClick = event.target.closest('button');

    if (buttonClick) {
      switch (buttonClick.dataset.action) {
        case this.C.updateCanvas:
          this.updateCanvasDimenstions();
          break;
        case this.C.resetCanvas:
          this.setState({ w: this.getState().w });
          break;
        default:
          console.error('Couldnt find button');
      }
    }
  }


  /**
   * param {object} props
   * @param {State} state
   * @returns {string} HTML to render
   */
  render = (state) => {
    const { w, h } = state;

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">

        <div class="tag-row">
          <div style="line-height:24px" data-action="${this.C.canvasHeight}" class="line-tag" contenteditable="true" >${h}</div>
          <label> Canvas Height : ${h}px</label>
        </div>

        <div class="tag-row">
          <div style="line-height:24px" data-action="${this.C.canvasWidth}" class="line-tag" contenteditable="true" >${w}</div>
          <label> Canvas Width : ${w}px </label>
        </div>

        <div id="${this.C.canvasErrorMess}" class="tag-row">
          Invalid height or width
        </div>

        <div class="control-row">
        ${CheckBox({
          dataType: '',
          dataAction: '',
          value: false, //0|1
          name: 'TODO: Remove Points outside canvas',
          info: ''
        })}
        </div>

        <div class="control-row button-row">
          ${Button({
            dataAction: this.C.updateCanvas,
            name:'Update Canvas',
          })}
          ${Button({
            dataAction: this.C.resetCanvas,
            name:'Reset Canvas',
          })}
        </div>  
      
      </div>
      `
    });
  }
}
