//@ts-check
import Controls from './Editor.Controls.js';
import Main from './Editor.Main.js';
import CORE from './CORE.js';

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
 * @property {Array<Listener} registerListener
 */
export default class Editor {
  /**
   * @constructor
   * @param {{state:State,id:Element}} props
   */
  constructor(props) {
    this.id = props.id;

    /**@type {State} */
    this.state = props.state; //Just set the state without render...

    /** @type {Array<Listener>} */
    this.registeredListeners = [];

    this.CORE = new CORE(this);

    this.main = new Main(this);
    this.CORE.mainId = this.main.id;
    this.controls = new Controls(this);


  }


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
      const { type, callback, cgId } = listener;

      if (['keydown', 'keypress', 'keyup'].includes(type)) {

        if (listener.keys) {
          keypressTypes.add(type);
          keyListeners.push(listener);

        } else if (type === 'keyup') {

          document.addEventListener('keyup', event => {
            // console.log(`Hello World!`);
            return callback(event);
          });

        } else {
          console.error(`Keys required for cgId '${listener.cgId}'`);
        }

      } else if (['click', 'focusin', 'mouseup', 'mousedown', 'mousemove'].includes(type)) {
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
                // console.log(`Key "${key}" called for ${listener.cgId}`);
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
    });
  }




  /**
   * Grid
   * calls setState()
   * @param {E} e
   * //TODO: move to Grid CG
   */
  setGridSize = (e) => {
    let { grid, w, h } = this.getState();
    let v = this.CORE.positiveNumber(e.target.value);
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
   * //TODO: move to Grid CG
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
   * TODO: move to Grid CG
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
