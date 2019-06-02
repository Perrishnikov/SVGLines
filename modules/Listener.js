//@ts-check

/**
 * @typedef {Listener} this
 * @typedef {string} caller
 * @typedef {string} selector
 * @typedef {'keydown'|'click'|'keyup'} type
 * @typedef {function} callback
 */
export class Listener {

  /**
   * 
   * @param {object} props 
   * @param {caller} props.caller
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
