//@ts-check

/**
 * @typedef {Listener} this
 * @typedef {string} caller - string. Name this Caller.
 * @typedef {'document' | string} selector - HTML object to add the listener to.
 * @typedef {function} callback
 * @typedef {string } cgId - required for all non-click events
 * @typedef {Array<string>|null} keys - required for all keyboard events
 */
export class Listener {
  /**
   * @param {object} props 
   * param {caller} [props.caller]
   * param {selector} props.selector
   * @param {Type} props.type
   * @param {callback} props.callback
   * @param {cgId} props.cgId - for CG components with click event. Needs to be ID
   * @param {keys} props.keys
   */
  constructor(props) {
    // this.caller = props.caller;
    // this.selector = props.selector;
    this.type = props.type;
    this.callback = props.callback;
    this.cgId = props.cgId;
    this.keys = props.keys;
  }

}

/**
 * typedef {'keydown'|'click'|'keyup'|'focusin'|'mouseup'|'onchange'|'mousedown'|'mousemove'|'ondragstart'} type
  * @typedef {*} Type
*/
export const LISTENERS = {
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  CLICK: 'click',
  FOCUSIN: 'focusin',
  MOUSEUP: 'mouseup',
  MOUSEDOWN: 'mousedown',
  MOUSEMOVE: 'mousemove',
  ONDRAGSTART: 'ondragstart',
  ONCHANGE: 'onchange'
};
