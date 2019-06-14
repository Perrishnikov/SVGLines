//@ts-check

/**
 * @typedef {Listener} this
 * @typedef {string} caller - string. Name this Caller.
 * @typedef {'document' | string} selector - HTML object to add the listener to.
 * @typedef {'keydown'|'click'|'keyup'|'focusin'} type
 * @typedef {function} callback
 * @typedef {string } cgId - required for all non-click events
 * @typedef {string} key - required for all keyboard events
 */
export default class Listener {
  /**
   * @param {object} props 
   * @param {caller} [props.caller]
   * @param {selector} props.selector
   * @param {type} props.type
   * @param {callback} props.callback
   * @param {object} [props.wrappedCallback] -optional
   * @param {string} props.cgId - for CG components with click event. Needs to be ID
   * @param {Array<string>} [props.key]
   */
  constructor(props) {
    this.caller = props.caller;
    this.selector = props.selector;
    this.type = props.type;
    this.callback = props.callback;
    this.cgId = props.cgId;
    this.key = props.key;
  }

}
