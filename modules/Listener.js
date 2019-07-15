//@ts-check

/**@type {LISTENER} */
export class Listener {
  /**
   * @param {object} props 
   * @param {Type} props.type
   * @param {Callback} props.callback
   * @param {CgId} props.cgId - for CG components with click event. Needs to be ID
   * @param {Keys} props.keys
   */
  constructor(props) {
    this.type = props.type;
    this.callback = props.callback;
    this.cgId = props.cgId;
    this.keys = props.keys;
  }

}

/** @typedef {String} Type */
export const LISTENERS = {
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  KEYPRESS: 'keypress',
  CLICK: 'click',
  FOCUSIN: 'focusin',
  MOUSEUP: 'mouseup',
  MOUSEDOWN: 'mousedown',
  MOUSEMOVE: 'mousemove',
  DRAGSTART: 'dragstart',
  INPUT: 'input'
};

/**
 * @typedef {function} Callback
 * @typedef {string } CgId - required for all non-click events
 * @typedef {Array<string>|null} Keys - required for all keyboard events
 * 
 * @typedef {object} LISTENER
 * @prop {Callback} callback
 * @prop {Type} type
 * @prop {CgId} cgId
 * @prop {Keys} keys
 */
