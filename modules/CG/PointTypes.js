//@ts-check

import ControlGroup from './_ControlGroup.js';
import Listener from '../Listener.js';
import { Button } from './_Components.js';

/**
 * @typedef {import('../Editor').State} State
 * @typedef {import('../CORE').PointType} PointType
 * @typedef {import('../CORE').CORE} CORE
 */
export default class PointTypes extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   * @param {CORE} props.CORE
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Point Types (i)';
    this.id = 'pointTypes';
    this.selector = `#${this.id}`;

    this.setPointType = 'setPointType';

    this.setState = props.setState;
    this.getState = props.getState;
    this.CORE = props.CORE;
  }

  listeners = () => {
    return [
      new Listener({
        type: 'click',
        callback: this.handleClick,
        cgId: this.selector,
        keys: null
      })
    ];
  }


  handleClick = (e) => {
    /**@type {HTMLElement} */
    const pointOptions = e.target.closest(`[data-action="${this.setPointType}"]`);

    if (pointOptions && pointOptions.dataset.value) {
      this.CORE.setPointType(pointOptions.dataset.value);
    }

    /**@type {HTMLElement} */
    const buttonClick = event.target.closest('button');
    // console.dir(buttonClick);

    if (buttonClick) {
      switch (buttonClick.dataset.action) {
        case 'addPoint':
          this.CORE.addPoint(null);
          break;
        case 'removePoint':
          this.CORE.removeActivePoint();
          break;
        case 'undoPoint':
          console.log('Not implemented');
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
    const { lines, activeLineIndex, activePointIndex } = state;
    const activeLine = lines[activeLineIndex];
    const activePoint = activeLine.points[activePointIndex];

    /**@type {PointType} */
    let pointType = 'l'; //default

    if (activePoint.q) {
      // console.log(`Hello Active Q`);
      pointType = 'q';
    } else if (activePoint.c) {
      // console.log(`Hello Active C!`);
      pointType = 'c';
    } else if (activePoint.a) {
      // console.log(`Hello Active A!`);
      pointType = 'a';
    }

    const options = [
      { name: 'L', value: 'l', checked: pointType == 'l' },
      { name: 'Q', value: 'q', checked: pointType == 'q' },
      { name: 'C', value: 'c', checked: pointType == 'c' },
      { name: 'A', value: 'a', checked: pointType == 'a' }
    ];

    let choices = options.map(c => {
      return `
        <input data-action="${this.setPointType}" type="radio" name="null" data-value="${ c.value }"
        ${ c.checked ? 'checked' : ''} id="" class="form-radio-points">
        <label class="choices-label" for="">${ c.name }</label>
      `;
    }).join('');

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">
        <div class="control-row">
          ${choices}
        </div>
        <div class="control-row">
        Press Meta and click to add Point
        <br>Press Shift-Meta to add new Line 
        </div>
        <div class="control-row">
        ${Button({
          action:'removePoint',
          name:'Remove Point',
        })}
        ${Button({
          action:'undoPoint',
          name:'Undo Remove',
        })}
        ${Button({
          action: 'resetPoint',
          name: 'Reset Point'
        })}
        </div>  
      </div>
      `
    });
  }
}
