//@ts-check
import Controls from './Editor.Controls.js';
import Main from './Editor.Main.js';

/**
 * @typedef {HTMLDivElement} Element
 * @typedef {{x:number,y:number}} coords
 * @typedef {0 | 1} anchor
 * @typedef {MouseEvent} e 
 */

/**
 * @typedef {Object} Line
 * @property {[{x:number,y:number, q?:{x:number,y:number}, c?:{[{x:number,y:number}]}, a?:{rx:number,ry:number,rot:number,laf:number,sf: number}}]} points
 */

/**
 * @typedef {Object} State
 * @property {boolean} draggedCubic
 * @property {boolean} draggedQuadratic
 * @property {boolean} draggedPoint
 * @property {boolean} ctrl
 * @property {number} activeLine 
 * @property {number} activePoint  
 * @property {Line[]} lines
 * @property {string} name
 * @property {number} w
 * @property {number} h
 * @property {{snap: boolean, size: number,show: boolean}} grid
 */

/**
 * @typedef {Editor} this
 * @property {Id} id
 * @property {State} state
 * @property {Main} main
 * @property {Controls} controls
 */
export default class Editor {
  /**
   * @constructor
   * @param {{state:State,id:Element}} props
   */
  constructor(props) {
    this.id = props.id;

    //must be added to document, not Main. Needed in Main, but cant place it in div??
    document.addEventListener('keydown', this.handleKeyDown, true);
    document.addEventListener('keyup', this.handleKeyUp, false);

    /**@type {Element} */
    const mainId = document.querySelector('#main');
    this.main = new Main(this, mainId);

    /**@type {Element} */
    const controlId = document.querySelector('#controls');
    this.controls = new Controls(this, controlId);

    //trigger the everything render()
    this.setState(props.state);
  }


  handleKeyDown = (e) => {
    console.log(`handleKeyDown: ${e.key}`);
    if (e.key === 'Alt' || e.key === 'Meta') {
      this.setState({ ctrl: true });
    }
  }


  handleKeyUp = (e) => {
    console.log(`handleKeyUp`);
    if (this.state.ctrl === true) {
      this.setState({ ctrl: false });
    }
  }


  /**
   * Returns Editor's State
   * @returns {State}
   */
  getState = () => {
    return Object.assign({}, this.state);
  }


  /** 
   * Sets Editor's State
   * @param {object} obj
   * @returns void
   */
  setState = (obj) => {
    new Promise((resolve, reject) => {

      resolve(this.state = Object.assign({}, this.state, obj));
    }).then((state) => {
      const props = {
        state: this.getState(), // Cloned
      };
      this.render(props);
    });

  }


  /**
   * Called from handleMouseMove
   * calls setState()
   * @param {coords} coords
   */
  setPointCoords = (coords) => {
    const { activePoint, lines, activeLine } = this.getState();

    lines[activeLine].points[activePoint].x = coords.x;
    lines[activeLine].points[activePoint].y = coords.y;

    this.setState({ lines });
  }

  /**
   * Called from handleMouseMove
   * calls setState()
   * @param {coords} coords
   * @param {anchor} anchor
   */
  setCubicCoords = (coords, anchor) => {
    const { activePoint, lines, activeLine } = this.getState();

    lines[activeLine].points[activePoint].c[anchor].x = coords.x;
    lines[activeLine].points[activePoint].c[anchor].y = coords.y;

    this.setState({ lines });
  }

  /**
   * Called from handleMouseMove
   * calls setState()
   * @param {coords} coords
   */
  setQuadraticCoords = (coords) => {
    const { activePoint, lines, activeLine } = this.getState();

    lines[activeLine].points[activePoint].q.x = coords.x;
    lines[activeLine].points[activePoint].q.y = coords.y;

    this.setState({ lines });
  }


  /**
   * @param {e} e 
   * @returns {coords}
   */
  getMouseCoords = (e) => {
    // const rect = ReactDOM.findDOMNode(this.refs.svg).getBoundingClientRect()
    const rect = this.id.getBoundingClientRect();
    // console.log(rect);
    // console.log(`e.pageX ${e.pageX}, rect.left ${rect.left}`);
    let x = Math.round(e.pageX - rect.left);
    let y = Math.round(e.pageY - rect.top);

    if (this.state.grid.snap) {
      x = this.state.grid.size * Math.round(x / this.state.grid.size);
      y = this.state.grid.size * Math.round(y / this.state.grid.size);
    }

    return { x, y };
  }


  /**
   * passed to Editor.Main
   * @param {e} e 
   */
  handleMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.state.ctrl) {
      if (this.state.draggedPoint) {
        console.log(`setPoint`);
        this.setPointCoords(this.getMouseCoords(e));
      } else if (this.state.draggedQuadratic) {
        console.log(`setQuad`);
        this.setQuadraticCoords(this.getMouseCoords(e));
      } else if (this.state.draggedCubic !== false) {
        console.log(`setCubic`);
        this.setCubicCoords(
          this.getMouseCoords(e),
          this.state.draggedCubic
        );
      }
    }
  }


  /**
   * Grid
   * Parse a string number
   * @param {string} n 
   * @returns {number}
   */
  positiveNumber(n) {
    let parsed = parseInt(n);

    if (isNaN(parsed) || parsed < 0) { parsed = 0; }

    return parsed;
  }


  /**
   * Grid
   * calls setState()
   * @param {e} e
   */
  setGridSize = (e) => {
    let grid = this.state.grid;
    let v = this.positiveNumber(e.target.value);
    const min = 1;
    const max = Math.min(this.state.w, this.state.h);

    if (v < min) { v = min; }
    if (v >= max) { v = max / 2; }

    grid.size = v;

    this.setState({ grid });
  };


  /**
   * Grid
   * calls setState()
   * @param {e} e
   */
  setGridSnap = (e) => {
    let grid = this.state.grid;
    grid.snap = e.target.checked;

    this.setState({ grid });
  };


  /**
   * Grid
   * calls setState()
   * @param {e} e
   */
  setGridShow = (e) => {
    let grid = this.state.grid;
    grid.show = e.target.checked;

    this.setState({ grid });
  };


  /**
   * @param {{state:State}} props
   * @returns void
   */
  render = (props) => {
    const mainId = document.querySelector('#main');
    mainId.innerHTML = this.main.render(props);

    /**Controls - auto adds listeners */
    const controlId = document.querySelector('#controls');
    controlId.innerHTML = this.controls.render(props);
  }
}


/** 
 * Interface to render to a DOM
 * @param {{state:State}} props
 */
Editor.DOMRender = (props) => {};
