//@ts-check
import Controls from './Editor.Controls.js';
import Main from './Editor.Main.js';
import CORE from './CORE.js';

// import Listener from './Listener.js';

/**
 * Misc
 * @typedef {HTMLElement} Element
 * @typedef {{x:number,y:number}} Coords
 * @typedef {0 | 1 } Anchor
 * @typedef {MouseEvent} E
 * @typedef {'l'|'q'|'c'|'a'} PointType
 * @typedef {Array<string>} Tags
 * @typedef {import('./Listener').default} Listener
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
 * @property {State} state
 * @property {Main} main
 * @property {Controls} controls
 * @property {Main} main
 */
export default class Editor {
  /**
   * @constructor
   * @param {{state:State,id:Element}} props
   */
  constructor(props) {
    this.id = props.id;

    this.state = props.state; //Just set the state without render...

    this.registeredListeners = [
      //   new Listener({
      //     // caller: 'Editor',
      //     // selector: 'document',
      //     type: 'keydown',
      //     callback: this.handleKeyDown,
      //     cgId: null,
      //     key: ['Alt', 'Shift', 'Meta'],
      //   }),
      //   new Listener({
      //     // caller: 'Editor',
      //     // selector: 'document',
      //     type: 'keyup',
      //     callback: this.handleKeyUp,
      //     cgId: null,
      //     key: [null],
      //   }),
      //   new Listener({
      //     // caller: 'Editor',
      //     // selector: 'document',
      //     type: 'click',
      //     callback: (e) => {
      //       console.log(`Editor Click`);
      //     },
      //     cgId: null,
      //     key: null
      //   }),
    ];

    /** type {Element} */
    // const mainId = document.querySelector('#main');
    this.main = new Main(this);

    // const controlId = document.querySelector('#controls');
    /**type {Element} */
    this.controls = new Controls(this);

    this.CORE = new CORE();

  }

  /************************ LISTENERS STUFF */
  /**
   * Registers each Listener with Editor.registeredListenrs[]
   * @param {Listener|Array<Listener>} listener 
   */
  registerListener(listener) {
    // console.log(listener);

    if (Array.isArray(listener)) {
      listener.forEach(one => {
        this.registeredListeners.push(one);
      });

    } else {
      this.registeredListeners.push(listener);
    }

    // console.log(`listener registered:`);
    // console.log(listener);
  }

  /**
   * Called from index.js
   * Adds all registeredListers to DOM after all HTML is ready
   * Im doing this so the events are completely modularized.
   * Only key events that a CG asks for are sent to it.
   */
  addDOMListeners() {
    // console.log(`Hello addDOMListeners!`);
    /** List of unique event types for all Listners - 'keydown', ... 
     * @type {Set<string>}
     */
    let keypressTypes = new Set();

    /** List of all Listeners
     * @type {Array<Listener>}
     */
    let keyListeners = [];

    this.registeredListeners.forEach(listener => {
      /**@type {Listener} */
      const { type, callback, keys, cgId } = listener;

      if (['keydown', 'keypress'].includes(type)) {

        if (listener.keys) {
          keypressTypes.add(type);
          keyListeners.push(listener);
        } else {
          console.error(`Keys required for cgId '${listener.cgId}'`);

        }


      } else if (['click', 'focusin', 'mouseup', 'mousedown', 'mousemove', 'keyup'].includes(type)) {
        // @ts-ignore
        document.addEventListener(type, event => {
          /**@type {HTMLElement} */
          const cg = event.target.closest(cgId);

          //if the closeset location finds this id, go.
          if (cg) {
            return callback(event);
          }

        });
      } else {
        console.error(`Error on Event for '${listener.type}'`);
      }
    });

    /** After all the keypressTypes is done, add those listeners... */
    [...keypressTypes].forEach(type => {

      document.addEventListener(type, event => {

        /**If the event type and pressed key match, call all Listeners callback */
        keyListeners.forEach(listener => {
          // console.log(listener);
          if (event.type === listener.type && listener.keys) {

            listener.keys.forEach(key => {

              if (event.key === key) {
                console.log(`Key "${key}" called for ${listener.cgId}`);
                return listener.callback(event);
              }

            });
          }
        });
      });
    });
  }

  //**************************************** */

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
      // console.log(this.getState());
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
    const rect = document.querySelector('#main');
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
