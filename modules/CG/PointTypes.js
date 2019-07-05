//@ts-check

import ControlGroup from './_ControlGroup.js';
import Listener from '../Listener.js';
import { Button, Range, CheckBox } from './_Components.js';

/**
 * @typedef {import('../Editor').State} State
 * @typedef {import('../CORE').PointType} PointType
 * @typedef {import('../CORE').CORE} CORE
 * @typedef {import('../CORE').Line} Line
 * @typedef {import('../CORE').Point} Point
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

    this.OPTIONS = {
      POINTYPES: 'pointTypes',
      ARCTYPE: 'arcTypes',
      FLAG: 'flag',
      CLOSEPATH: 'closePath',
    };

    this.setState = props.setState;
    this.getState = props.getState;
    this.CORE = props.CORE;
  }

  listeners = () => {
    return [
      new Listener({
        type: 'click',
        callback: this.handleButtonClick,
        cgId: this.selector,
        keys: null
      }),
      new Listener({
        type: 'ondragstart',
        callback: this.handleInputDrag,
        cgId: this.selector,
        keys: null
      }),
      new Listener({
        type: 'mouseup',
        callback: this.handleClicks,
        cgId: this.selector,
        keys: null
      })
    ];
  }


  handleInputDrag = (e) => {
    /**@type {State} */
    const { lines, activePointIndex, activeLineIndex } = this.getState();
    const activeLine = lines[activeLineIndex];
    const activePoint = activeLine.points[activePointIndex];

    /**@type {HTMLElement} */
    const type = e.target.closest(`[data-type]`);

    if (type) {
      /**@type {string} - {"laf"|"sf"|"rot"|"rx"|"ry"} */
      const action = type.dataset.action ? type.dataset.action : '';

      switch (type.dataset.type) {
        case this.OPTIONS.ARCTYPE:
          this.CORE.setArcParam({
            lines,
            activePoint,
            action,
            value: e.target.value
          });
          break;

        default:
          console.log(`Hello World!`);
          break;
      }
    }
  }


  handleClicks = (e) => {
    /**@type {State} */
    const { lines, activePointIndex, activeLineIndex } = this.getState();
    const activeLine = lines[activeLineIndex];
    const activePoint = activeLine.points[activePointIndex];

    /**@type {HTMLElement} */
    const type = e.target.closest(`[data-type]`);

    if (type) {
      /**@type {string} - {"laf"|"sf"|"rot"|"rx"|"ry"} */
      const action = type.dataset.action ? type.dataset.action : '';
      const value = type.dataset.value; //boolean or number

      switch (type.dataset.type) {
        case this.OPTIONS.ARCTYPE:
          this.CORE.setArcParam({
            lines,
            activePoint,
            action,
            value: e.target.value
          });
          break;
        case this.OPTIONS.CLOSEPATH:
          this.toggleClosePath();
          break;
        case this.OPTIONS.FLAG:
          this.CORE.setArcParam({ lines, activePoint, action });
          break;
        case this.OPTIONS.POINTYPES:
          this.CORE.setPointType(value); //checked or no
          break;

        default:
          console.log(`Hello World!`);
          break;
      }
    }
  }


  handleButtonClick = (event) => {
    /**@type {HTMLElement} */
    const buttonClick = event.target.closest('button');

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


  getArc = ({ activePoint, grid, w, h }) => {
    return `
    <div class="control-row">
      ${CheckBox({
        dataType: this.OPTIONS.FLAG,
        dataAction: 'laf',
        value: activePoint.a.laf ? activePoint.a.laf : 0, //0|1
        name: 'Large Sweep',
        info:'Determines if the arc should be greater than or less than 180 degrees; direction arc will travel around circle.'
      })}
      ${CheckBox({
        dataType: this.OPTIONS.FLAG,
        dataAction: 'sf',
        value: activePoint.a.sf ? activePoint.a.sf : 0, //0|1
        name: 'Sweep',
        info: 'Should arc begin moving at positive angles or negative ones.'
      })}
    </div>

    <div class="control-row">
      ${Range({
        dataType: this.OPTIONS.ARCTYPE,
        dataAction: 'rx',
        value: activePoint.a.rx,
        name: 'X Radius',
        min: 0,
        max: w,
        step: grid.size,
      })}
    </div>
    <div class="control-row">
      ${Range({
        dataType: this.OPTIONS.ARCTYPE,
        dataAction: 'ry',
        value: activePoint.a.ry,
        name: 'Y Radius',
        min: 0,
        max: h,
        step: grid.size,
      })}
    </div>
    <div class="control-row">
      ${Range({
        dataType: this.OPTIONS.ARCTYPE,
        dataAction: 'rot',
        value: activePoint.a.rot,
        name: 'Rotation',
        min: 0,
        max: 360,
        step: 1,
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
    const { lines, activeLineIndex, activePointIndex, grid, w, h } = state;

    // must have a line
    if (lines.length > 0) {

      /**@type {Line} */
      const activeLine = lines[activeLineIndex];
      /**@type {Point} */
      const activePoint = activeLine.points[activePointIndex];
      console.log(activeLine);
      console.log(activePoint);

      /**@type {PointType} */
      let pointType = 'l'; //default

      if (activePoint.q) {
        console.log(`Hello Active Q`);
        pointType = 'q';
      } else if (activePoint.c) {
        console.log(`Hello Active C!`);
        pointType = 'c';
      } else if (activePoint.a) {
        console.log(`Hello Active A!`);
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
        <input data-type="${this.OPTIONS.POINTYPES}" type="radio" name="points" data-value="${ c.value }" ${ c.checked ? 'checked' : ''} id="" class="form-radio-points" ${activePointIndex === 0 && c.value !== 'l' ?' disabled' : ''}>
        <label class="choices-label">${ c.name }</label>   `;
      }).join('');

      // const step = grid.snap ? grid.size : 1;

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
                dataType: this.OPTIONS.CLOSEPATH,
                value: activeLine.closePath,
                name: 'Close Path'
              })}
            </div>
            
            ${pointType === 'a' ? this.getArc({activePoint, grid, w, h}) : ''}
            
            <div class="control-row">
            Press Meta and click to add Point
            <br>Press Shift-Meta to add new Line 
            </div>
            <div class="control-row button-row">
            ${Button({
              dataAction:'removePoint',
              name:'Remove Point',
            })}
            ${Button({
              dataAction:'undoPoint',
              name:'Undo Remove',
            })}
            ${Button({
              dataAction: 'resetPoint',
              name: 'Reset Point'
            })}
            </div>  
          </div>
        `
      });
    }
  }
}
