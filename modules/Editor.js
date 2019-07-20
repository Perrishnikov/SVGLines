//@ts-check
import Controls from './Editor.Controls.js';
import Main from './Editor.Main.js';
import { CORE } from './CORE.js';
import { LISTENERS } from './Listener.js';

/**
 * Validate
 * @typedef {Object} Validate
 * @property {(str1: string ) => boolean} Validate.isNotEmpty
 * @property {(str1: string ) => boolean} Validate.isNumber
 * @property {(str1: string, str2: string ) => boolean} Validate.isNotSame
 * @property {(str1: string, max: number ) => boolean} Validate.isLessThan
 * @property {(str1: string, min: number ) => boolean} Validate.isGreaterThan
 */


/**
 * Editor
 * @typedef {object} editor
 * @property {Element} editor.id
 * @property {State} editor.state
 * @property {Main} editor.main
 * @property {Controls} editor.controls
 * @property {Array<Listener>} editor.registeredListeners
 * @property {CORE} editor.core
 * @property {Validate} editor.validate
 */
export default class Editor {
  /**
   * @constructor
   * @param {{state:State,id:Element}} props
   */
  constructor(props) {

    /** @type {editor["validate"]} */
    this.validate = {
      isNotEmpty: (str1) => {
        const pattern = /\S+/;
        console.assert(pattern.test(str1), `! isNotEmpty`);
        return pattern.test(str1);
      },
      isNumber: (str1) => {
        const pattern = /^\d+$/;
        console.assert(pattern.test(str1), '! isNumber');
        return pattern.test(str1);
      },
      isNotSame: (str1, str2) => {
        console.assert(str1 !== str2, '! isNotSame');
        return str1 !== str2;
      },
      isLessThan: (str1, max) => {
        console.assert(str1.length < max, '! isLessThan');
        return str1.length < max;
      },
      isGreaterThan: (str1, min) => {
        console.assert(str1.length > min, '! isGreaterThan');
        return str1.length > min;
      }
    };

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

      if ([LISTENERS.KEYDOWN, LISTENERS.KEYPRESS, LISTENERS.KEYUP].includes(type)) {

        if (listener.keys) {
          keypressTypes.add(type);
          keyListeners.push(listener);

        } else if (type === LISTENERS.KEYUP) {

          document.addEventListener(type, event => {
            // console.log(`Hello World!`);
            return callback(event);
          });

        } else {
          console.error(`Keys required for cgId '${listener.cgId}'`);
        }

      } else if ([
          LISTENERS.CLICK,
          LISTENERS.FOCUSIN,
          LISTENERS.MOUSEUP,
          LISTENERS.MOUSEDOWN,
          LISTENERS.MOUSEMOVE
        ].includes(type)) {
        document.addEventListener(type, event => {
          /**@type {HTMLElement} */
          const cg = event.target.closest(cgId);
          // console.log(`cgId:${cgId}`);
          //if the closeset location finds this id, go.
          if (cg) {
            return callback(event);
          }

        });

      } else if ([
          LISTENERS.DRAGSTART,
          LISTENERS.INPUT
        ].includes(type)) {

        document
          // document.querySelector(cgId) -- Cant use tis because DOM gets nuked
          .addEventListener(type, event => {
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


  /* VALIDATTION ------------ */

  // validate = (str1, str2 = '') => {
  //   const hello = {
  //     ho
  //     : 'ho'
  //   };

  //   const validation = {
  //     isNotEmpty: function(str1) {
  //       const pattern = /\S+/;
  //       return pattern.test(str1); // returns a boolean
  //     },
  //     isNumber: function(str) {
  //       const pattern = /^\d+$/;
  //       return pattern.test(str); // returns a boolean
  //     },
  //     isSame: function(str1, str2) {
  //       return str1 === str2;
  //     }
  //   };


  //   return this;

  // }



  /* TAGS ---------------------------- */
  addLineTag = () => {}

  removeLineTag = () => {

  }

  /* ID's ----------------------------- */

  /**
   * Gets the next valid Line ID
   * @param {State["lineStartingBasis"]} currentId
   * @return {State["lineStartingBasis"]} - next id
   */
  getLineId = (currentId) => {
    const padLength = currentId.length; // '0001' -> 4'

    let count = parseInt(currentId); // 4
    count++; // 5

    const nextID = count.toString().padStart(padLength, '0'); // '0005'

    return nextID;
  }

  setLineId = () => {

  }

  updateLineId = () => {

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
 * @property {import('./CORE').Line[]} lines
 * @property {Array<string>} tags
 * @property {string} name
 * @property {number} w
 * @property {number} h
 * @property {{snap: boolean, size: number,show: boolean, numbers:boolean, steps:number}} grid
 * @property {Array<*>} lineRules
 * @property {string} lineStartingBasis
 * @property {{show: boolean, opacity: number, left: number, top: number, imagePath: string, size: string}} background
 */

/**
 * Misc
 * typedef {HTMLElement} Element
 * typedef {{x:number,y:number}} Coords
 * @typedef {import('./Listener').Listener} Listener
 */
