//@ts-check

import ControlGroup from './_ControlGroup.js';
import Listener from '../Listener.js';
import { Button, Range, CheckBox } from './_Components.js';
import { Line } from '../CORE.js';

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

    const toggleClose = e.target.closest('[data-action="closePath"]');

    if (toggleClose) {
      this.toggleClosePath();
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


  toggleClosePath = () => {
    /**@type {State} */
    const { activeLineIndex, lines } = this.getState();

    let activeLine = lines[activeLineIndex];
    activeLine.closePath = !activeLine.closePath;

    this.setState({ lines });
  }


  handleArc = (props) => {
    const { activeLine, activePoint } = props;

    return `
    <div class="control-row">
      ${CheckBox({
        action: 'largeSweep',
        value: activeLine.closePath,
        name: 'Large Sweep'
      })}
    </div>
    `;

  }


  /**
   * param {object} props
   * @param {State} state
   * @returns {string} HTML to render
   */
  render = (state) => {
    const { lines, activeLineIndex, activePointIndex } = state;

    // must have a line
    if (lines.length > 0) {

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

      //TODO: make these constants somewhere else
      const options = [
        { name: 'L', value: 'l', checked: pointType == 'l' },
        { name: 'Q', value: 'q', checked: pointType == 'q' },
        { name: 'C', value: 'c', checked: pointType == 'c' },
        { name: 'A', value: 'a', checked: pointType == 'a' }
      ];

      const choices = options.map(c => {
        return `
        <input data-action="${this.setPointType}" type="radio" name="points" data-value="${ c.value }" ${ c.checked ? 'checked' : ''} id="" class="form-radio-points">
        <label class="choices-label" for="">${ c.name }</label>   `;
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
              ${CheckBox({
                action: 'closePath',
                value: activeLine.closePath,
                name: 'Close Path'
              })}
            </div>
            
            ${pointType == 'a' ? 
            this.handleArc({activeLine, activePoint}) : 
            ''}
            
            <div class="control-row">
            Press Meta and click to add Point
            <br>Press Shift-Meta to add new Line 
            </div>
            <div class="control-row button-row">
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
}
