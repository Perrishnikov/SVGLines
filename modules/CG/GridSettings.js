//@ts-check


import ControlGroup from './xControlGroup.js';
import { Listener, LISTENERS } from '../Listener.js';
import { Button, Range, CheckBox } from './xComponents.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**
 * TODO: //Move methods from Editor Grid in here.
 * Editor.Main.js handles displaying the grid
 * @class 
 * @extends {ControlGroup}
 */
export default class GridSettings extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   * @param {import('../Editor').Validate} props.validate
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Grid Settings:';
    this.id = `gridSettings`;
    this.selector = `#${this.id}`;

    this.validate = props.validate;
    this.setState = props.setState;
    this.getState = props.getState;

    this.OPTIONS = {
      SHOW_GRID: 'showGrid',
      SHOW_NUMBERS: 'showNum',
      INC_STEPS: 'incSteps',
      DEC_STEPS: 'decSteps',
      SET_GRIDSIZE: 'gridSize',
      GRIDSIZE_ID: 'gridSizeId'
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
        callback: this.handleInput, //dont need to bid
        cgId: this.selector, //or key - dont need both
        keys: null
      }),
    ];
  }

  /**
   * @param {State['grid']} grid
   */
  toggleGrid(grid) {
    grid.show = !grid.show;
    this.setState({ grid });
  }

  /**
   * @param {State['grid']} grid
   */
  toggleNumbers(grid) {
    grid.numbers = !grid.numbers;
    this.setState({ grid });
  }

  handleSteps = (upOrDown) => {
    const { grid } = this.getState();

    console.log(grid);
    if (upOrDown == 'inc') {
      grid.steps++;
    } else {
      if (grid.steps >= 2)
        grid.steps--;
    }

    this.setState({ grid });
  }

  updateGidSize = () => {
    const { grid } = this.getState();

    const newSize = document.querySelector(`#${this.OPTIONS.GRIDSIZE_ID}`).textContent;
console.log(newSize);
    console.log(`newSize: ${newSize}`);

    if (
      this.validate.isNotEmpty(newSize) &&
      this.validate.isNumber(newSize) &&
      // this.validate.isNotSame(newSize, grid.size) &&
      this.validate.isLessThan(newSize, 400) &&
      this.validate.isGreaterThan(newSize, 1)
    ) {
      grid.size = newSize;

      this.setState({ grid });
    } else {
      console.error('else');

      // this.toggleErrorMessage();
    }
  }

  /**@param {Event} e */
  handleInput = (e) => {
    /**@type {State} */
    const { grid } = this.getState();
    const action = e.target.closest(`[data-action]`);
    const dataset = action ? action.dataset.action : null;
    // const value = action ? action.value : null;
    // console.dir(e.target);
    // console.log(`value: ${value}`);
    // console.log(dataset);

    switch (dataset) {
      case this.OPTIONS.SHOW_GRID:
        this.toggleGrid(grid);
        break;
      case this.OPTIONS.SHOW_NUMBERS:
        this.toggleNumbers(grid);
        break;
      case this.OPTIONS.INC_STEPS:
        this.handleSteps('inc');
        break;
      case this.OPTIONS.DEC_STEPS:
        this.handleSteps('dec');
        break;
      case this.OPTIONS.SET_GRIDSIZE:
        this.updateGidSize();
        break;
      default:
        break;
    }
  }

  /**
   * param {object} props
   * @param {State} state
   * @returns {string} HTML to render
   */
  render = (state) => {
    const { grid } = state;

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">

        <div class="control-row">
        ${CheckBox({
          dataType: 'show',
          dataAction: this.OPTIONS.SHOW_GRID,
          value: grid.show,
          name: 'Show Grid',
          info:'Show Grid'
        })}
        </div>
        <div class="tag-row">
          <div style="line-height:24px" class="line-tag" id="${this.OPTIONS.GRIDSIZE_ID}" contenteditable="true" >${grid.size}</div>
          <label> Grid Size : ${grid.size}px</label>
          
          ${Button({
            dataAction: this.OPTIONS.SET_GRIDSIZE,
            name:'Update Size',
          })}
        </div>

        <div class="control-row">
        ${CheckBox({
          dataType: 'show',
          dataAction: this.OPTIONS.SHOW_NUMBERS,
          value: grid.numbers,
          name: 'Show Numbers',
          info:'Show Numbers'
        })}
        </div>

        <div class="control-row">
        <label style="margin-right: 12px">Steps: ${state.grid.steps}</label>

        ${Button({
          dataAction: this.OPTIONS.INC_STEPS,
          name:'Step +',
          info: ''
        })}
        ${Button({
          dataAction: this.OPTIONS.DEC_STEPS,
          name:'Step -',
          info: ''
        })}
        </div>
      
      </div>
      `
    });
  }
}
