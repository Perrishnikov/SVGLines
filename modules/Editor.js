//@ts-check
import Controls from './Editor.Controls.js';
import Main from './Editor.Main.js';
import Listener from './Listener.js';

/**
 * Misc
 * @typedef {HTMLElement} Element
 * @typedef {{x:number,y:number}} Coords
 * @typedef {0 | 1 } Anchor
 * @typedef {MouseEvent} E
 * @typedef {'l'|'q'|'c'|'a'} PointType
 * @typedef {Array<string>} Tags
 */

/**
 * Line
 * @typedef {Object} Line
 * @property {Array<{x:number,y:number, q?:{x:number,y:number}, c?:Array<{x:number,y:number}, {x:number,y:number}>, a?:{rx:number,ry:number,rot:number,laf:number,sf: number}}>} points
 * @property {Array<string>} tags
 * @property {string} id
 */

/**
 * State
 * @typedef {Object} State
 * @property {Anchor | boolean} draggedCubic
 * @property {boolean} draggedQuadratic
 * @property {boolean} draggedPoint
 * @property {boolean} ctrl
 * @property {boolean} shift
 * @property {number} activeLineIndex 
 * @property {number} activePointIndex  
 * @property {Line[]} lines
 * @property {Tags} tags
 * @property {string} name
 * @property {number} w
 * @property {number} h
 * @property {{snap: boolean, size: number,show: boolean}} grid
 * @property {Array<*>} lineRules
 */

/**
 * Editor
 * @typedef {Editor} this
 * @property {Id} id
 * property {State} state
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
    // document.addEventListener('keydown', this.handleKeyDown, true);
    // document.addEventListener('keyup', this.handleKeyUp, false);
    //TODO: Test
    this.registeredListeners = [
      new Listener({
        // caller: 'Editor',
        selector: 'document',
        type: 'keydown',
        callback: this.handleKeyDown
      }), new Listener({
        caller: 'Editor',
        selector: 'document',
        type: 'keyup',
        callback: this.handleKeyUp
      }),
    ];

    /**@type {Element} */
    const mainId = document.querySelector('#main');
    this.main = new Main(this, mainId);

    // const controlId = document.querySelector('#controls');
    /**type {Element} */
    this.controls = new Controls(this);

    //trigger the everything render()
    //I am now calling render from index.js
    // this.setState(props.state);
  }

  /************************ LISTENERS STUFF */
  registerListener(listener) {
    // console.log(listener);

    if (Array.isArray(listener)) {
      listener.forEach(one => {
        this.registeredListeners.push(one);
      });

    } else {
      this.registeredListeners.push(listener);
    }

    // console.log(`listener registered: ${listener.caller} ${listener.type}`);
  }

  addDOMListeners() {
    // console.log(`Hello addDOMListeners!`);

    this.registeredListeners.forEach(listener => {
      const { selector, type, callback, caller } = listener;
      // console.log(listener);

      if (selector == 'document') {
        document.addEventListener(type, callback);
        // console.dir(document);
      } else {
        //TODO: validate this ...ALL
        // const el = document.createElement(element);
        const el = document.querySelectorAll(selector);
        el.forEach(l => l.addEventListener(type, callback));
      }
    });
  }

  //**************************************** */

  //TEST METHODS FOR CG.LINEFUNCTIONS()
  resetLine(){
    console.log(`resetLine`);
  }

  addLine(){
    console.log(`addLine`);
  }

  removeLine(){
    console.log(`removeLine`);
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

    //If Enter is pressed in the Add Tag Div CONTROLS -> LINES
    if (e.key === 'Enter' && document.activeElement.id === 'newTagText') {
      // handle the Add Tag
      this.controls.handleAddTag(e.target);
    }

    //If Enter is pressed in the LineId Div CONTROLS -> LINE
    if (e.key === 'Enter' && document.activeElement.id === 'lineId') {
      // handle the Add Tag
      this.controls.handleLineIdUpdate(e.target);
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
      const newState = {
        state: this.getState(), // Cloned
      };

      this.render(newState);
    });

  }


  /**
   * Called from handleMouseMove
   * calls setState()
   * @param {Coords} coords
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
   * @param {Coords} coords
   * @param {State["draggedCubic"]} anchor
   */
  setCubicCoords = (coords, anchor) => {
    // console.log('setCubicCoords');
    const { activePointIndex, lines, activeLineIndex } = this.getState();

    //Is normally false, but set to 0|1 depending on the active anchor
    if (typeof anchor === 'string') {

      lines[activeLineIndex].points[activePointIndex].c[anchor].x = coords.x;
      lines[activeLineIndex].points[activePointIndex].c[anchor].y = coords.y;

      this.setState({ lines });
    }
  }

  /**
   * Called from handleMouseMove
   * calls setState()
   * @param {Coords} coords
   */
  setQuadraticCoords = (coords) => {
    const { activePointIndex, lines, activeLineIndex } = this.getState();

    lines[activeLineIndex].points[activePointIndex].q.x = coords.x;
    lines[activeLineIndex].points[activePointIndex].q.y = coords.y;

    this.setState({ lines });
  }


  /**
   * @param {E} e 
   * @returns {Coords}
   */
  getMouseCoords = (e) => {
    const { grid } = this.getState();
    const rect = this.main.id;
    const top = rect.getBoundingClientRect().top;

    let x = e.pageX;
    let y = e.clientY - top;

    if (grid.snap) {
      x = grid.size * Math.round(x / grid.size);
      y = grid.size * Math.round(y / grid.size);
    }

    // console.log(`x:${x}, y:${y}`);
    return { x, y };
  }

  /**
   * Pass in a line's points. Returns the path
   * @param {object} points
   * @returns {string} - a single path
   */
  generatePath = (points) => {
    // let { points, closePath } = props;
    let d = '';

    points.forEach((p, i) => {
      if (i === 0) {
        // first point
        d += 'M ';
      } else if (p.q) {
        // quadratic
        d += `Q ${ p.q.x } ${ p.q.y } `;
      } else if (p.c) {
        // cubic
        d += `C ${ p.c[0].x } ${ p.c[0].y } ${ p.c[1].x } ${ p.c[1].y } `;
      } else if (p.a) {
        // arc
        d += `A ${ p.a.rx } ${ p.a.ry } ${ p.a.rot } ${ p.a.laf } ${ p.a.sf } `;
      } else {
        d += 'L ';
      }

      d += `${ p.x } ${ p.y } `;
    });

    // if (closePath) { d += 'Z'; }

    return d;
  }

  /**
   * passed to Editor.Main
   * @param {E} e 
   */
  handleMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { ctrl, shift, draggedCubic, draggedQuadratic, draggedPoint } = this.getState();

    //TESTING -> shows mouse coords
    // const { grid } = this.getState();
    // const rect = this.main.id;
    // const top = rect.getBoundingClientRect().top;
    // // const x = e.clientX + rect.scrollLeft;
    // const x = e.pageX;
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
        // console.log(`setPoint`);
        this.setPointCoords(this.getMouseCoords(e));
      } else if (draggedQuadratic) {
        // console.log(`setQuad`);
        this.setQuadraticCoords(this.getMouseCoords(e));
      } else if (draggedCubic !== false) {
        // console.log(`setCubic: ${draggedCubic}`);
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
   * @param {E} e
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
   * @param {E} e
   */
  setGridSnap = (e) => {
    let { grid } = this.getState();
    grid.snap = e.target.checked;

    this.setState({ grid });
  };


  /**
   * Grid
   * calls setState()
   * @param {E} e
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
    console.log(`Editor Render called`);
    this.id.innerHTML = `
    ${this.main.render(props)}
    ${this.controls.render(props)}
    `;

  }
}


/** 
 * Interface to render to a DOM
 * @param {{state:State}} props
 */
Editor.DOMRender = (props) => {};
