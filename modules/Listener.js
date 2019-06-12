//@ts-check

/**
 * @typedef {Listener} this
 * @typedef {string} caller - string. Name this Caller.
 * @typedef {'document' | string} selector - HTML object to add the listener to.
 * @typedef {'keydown'|'click'|'keyup'|'focusin'} type
 * @typedef {function} callback
 */
export default class Listener {
  /**
   * @param {object} props 
   * @param {caller} [props.caller]
   * @param {selector} props.selector
   * @param {type} props.type
   * @param {callback} props.callback
   */
  constructor(props) {
    this.caller = props.caller;
    this.selector = props.selector;
    this.type = props.type;
    this.callback = props.callback;
  }

}
