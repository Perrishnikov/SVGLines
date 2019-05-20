//@ts-check
import Controls from './Editor.Controls.js';
import Main from './Editor.Main.js';

/**
 * Misc
 * @typedef {HTMLElement} Element
 * @typedef {{x:number,y:number}} coords
 * @typedef {0 | 1 | boolean} anchor
 * @typedef {MouseEvent} e 
 */

/**
 * Line
 * @typedef {Object} Line
 * @property {Array<{x:number,y:number, q?:{x:number,y:number}, c?:{[{x:number,y:number}]}, a?:{rx:number,ry:number,rot:number,laf:number,sf: number}}>} points
 * @property {Array<string>} tags
 */

/**
 * State
 * @typedef {Object} State
 * @property {boolean} draggedCubic
 * @property {boolean} draggedQuadratic
 * @property {boolean} draggedPoint
 * @property {boolean} ctrl
 * @property {boolean} shift
 * @property {number} activeLineIndex 
 * @property {number} activePointIndex  
 * @property {Line[]} lines
 * @property {Array<string>} tags
 * @property {string} name
 * @property {number} w
 * @property {number} h
 * @property {{snap: boolean, size: number,show: boolean}} grid
 */

/**
 * Editor
 * @typedef {Editor} this
 * @property {Id} id
 * property {State} state
 * @property {Main} main
 * @property {Controls} controls
 * @property 
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
    // console.log(`handleKeyDown: ${e.key}`);

    if (e.key === 'Alt' || e.key === 'Meta') {
      // console.log('meta');
      this.setState({ ctrl: true });
    }
    if (e.key === 'Shift') {
      // console.log('shift');
      this.setState({ shift: true });
    }

    //If Enter is pressed in the Add Tag Div
    if (e.key === 'Enter' && document.activeElement.id === 'newTagText') {
      // handle the Add Tag
      this.controls.handleAddTag(e.target);
    }

  }


  handleKeyUp = (e) => {
    //need to account for text entry
    // if (!this.getState().focusText) {
    // console.log(`handleKeyUp`);
    if (this.getState().ctrl === true) {
      this.setState({ ctrl: false });
    }
    if (this.getState().shift === true) {
      this.setState({ shift: false });
    }
    // }
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
    const { activePointIndex, lines, activeLineIndex } = this.getState();

    lines[activeLineIndex].points[activePointIndex].x = coords.x;
    lines[activeLineIndex].points[activePointIndex].y = coords.y;

    this.setState({ lines });
  }

  /**
   * Called from handleMouseMove
   * calls setState()
   * @param {coords} coords
   * @param {anchor} anchor
   */
  setCubicCoords = (coords, anchor) => {
    // console.log('setCubicCoords');
    // console.log(anchor);
    const { activePointIndex, lines, activeLineIndex } = this.getState();

    // if (anchor) {
    lines[activeLineIndex].points[activePointIndex].c[anchor].x = coords.x;
    lines[activeLineIndex].points[activePointIndex].c[anchor].y = coords.y;

    this.setState({ lines });
    // }
  }

  /**
   * Called from handleMouseMove
   * calls setState()
   * @param {coords} coords
   */
  setQuadraticCoords = (coords) => {
    const { activePointIndex, lines, activeLineIndex } = this.getState();

    lines[activeLineIndex].points[activePointIndex].q.x = coords.x;
    lines[activeLineIndex].points[activePointIndex].q.y = coords.y;

    this.setState({ lines });
  }


  /**
   * @param {e} e 
   * @returns {coords}
   */
  getMouseCoords = (e) => {
    const { grid } = this.getState();
    const rect = this.main.id;
    const top = rect.getBoundingClientRect().top;

    let x = e.clientX + rect.scrollLeft;
    let y = e.clientY - top;

    if (grid.snap) {
      x = grid.size * Math.round(x / grid.size);
      y = grid.size * Math.round(y / grid.size);
    }

    // console.log(`x:${x}, y:${y}`);
    return { x, y };
  }


  /**
   * passed to Editor.Main
   * @param {e} e 
   */
  handleMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { ctrl, shift, draggedCubic, draggedQuadratic, draggedPoint } = this.getState();

    //TESTING -> shows mouse coords
    // const { grid } = this.getState();
    // const rect = this.main.id;
    // const top = rect.getBoundingClientRect().top;

    // const x = e.clientX + rect.scrollLeft;
    // const y = e.clientY - top;
    // const rx = grid.size * Math.round(x / grid.size);
    // const ry = grid.size * Math.round(y / grid.size);

    // document.querySelector('#coords').innerText = `
    // Screen X/Y: ${e.screenX}, ${e.screenY}
    // Client X/Y: ${e.clientX}, ${e.clientY}
    // Page X/Y: ${e.pageX}, ${e.pageY}
    // X/Y: ${x}, ${y}
    // rounded: ${rx}, ${ry}
    // top:${top}! scrollLeft:${rect.scrollLeft}!`;

    if (!ctrl && !shift) {
      if (draggedPoint) {
        console.log(`setPoint`);
        this.setPointCoords(this.getMouseCoords(e));
      } else if (draggedQuadratic) {
        console.log(`setQuad`);
        this.setQuadraticCoords(this.getMouseCoords(e));
      } else if (draggedCubic !== false) {
        console.log(`setCubic`);
        this.setCubicCoords(this.getMouseCoords(e), draggedCubic);
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
    let { grid, w, h } = this.getState();
    let v = this.positiveNumber(e.target.value);
    const min = 1;
    const max = Math.min(w, h);

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
    let { grid } = this.getState();
    grid.snap = e.target.checked;

    this.setState({ grid });
  };


  /**
   * Grid
   * calls setState()
   * @param {e} e
   */
  setGridShow = (e) => {
    let { grid } = this.getState();
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
