//@ts-check
import Controls from './Editor.Controls.js';
import Main from './Editor.Main.js';
import { CORE, Line } from './CORE.js';




/**
 * Editor
 * @typedef {object} editor
 * @property {Element} editor.id
 * @property {State} editor.state
 * @property {Main} editor.main
 * @property {Controls} editor.controls
 * @property {Array<Listener>} editor.registeredListeners
 * @property {CORE} editor.core
 */
export default class Editor {
  /**
   * @constructor
   * @param {{state:State,id:Element}} props
   */
  constructor(props) {
    /**@type {editor["id"]} */
    this.id = props.id;

    /**@type {editor["state"]} */
    this.state = props.state; //Just set the state without render...

    /**@type {editor["registeredListeners"]} */
    this.registeredListeners = [];

    /**@type {editor["core"]} */
    this.CORE = new CORE(this);

    /**@type {editor["main"]} */
    this.main = new Main(this);

    /**@type {editor["controls"]} */
    this.controls = new Controls(this);

    this.CORE.mainId = this.main.id; //assign this to CORE to avoid side effects
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
    }).then(() => {
      const newState = {
        state: this.getState(), // Cloned
      };

      this.render(newState);
    });
  }




  /**
   * Grid
   * calls setState()
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
 * State
 * @typedef {Object} State
 * @property {import('./CORE').Anchor | boolean} draggedCubic
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
 * @property {Array<*>} lineRules
 */

 /**
 * Misc
 * typedef {HTMLElement} Element
 * typedef {{x:number,y:number}} Coords
 * @typedef {import('./Listener').default} Listener
 */