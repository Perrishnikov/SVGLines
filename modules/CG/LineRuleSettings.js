//@ts-check

import ControlGroup from './xControlGroup.js';
import Listener from '../Listener.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**
 * //TODO: Replace Descriptions
 * @class 
 * @extends {ControlGroup}
 */
export default class LineRuleSettings extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Line Rules';
    this.id = 'lineRules';
    this.selector = `#${this.id}`;

    this.setState = props.setState;
    this.getState = props.getState;
  }

  /**
   * Place a Listener on the whole component
   * Dont need to bind this 
   * @returns {Listener | Array<Listener>}
   */
  listeners = () => {
    return [
      new Listener({
        type: 'click',
        callback: this.handleClick, //dont need to bid
        cgId: this.selector, //or key - dont need both
        keys: null
      }),
    ];
  }

  handleClick = (e) => {
    console.log(`Replace ${this.selector} click`);
  }


  /**
   * param {object} props
   * @param {State} state
   * @returns {string} HTML to render
   */
  render = (state) => {
    const { lineRules } = state;
    const mappedRules = lineRules.map((rule, i) => {
      const { id, name, type, enabled, value, info } = rule;

      switch (type) {
        case 'checkbox':
          return `
          <div class="flex_row">
            <input data-action="lineRules" type="checkbox" name="" value="${id}" ${ enabled ? 'checked' : ''} id="${id}" class="form-radio-points">
            <label class="choices-label" for="">${ name }</label>
          </div>`;
        case 'text':
          return `
          <div class="flex-row">
            <div id="${id}" style="display:inline-block" class="textInput" contenteditable="true" >${value}</div>
            <span style="margin-left:-8px;">${name}</span>
        </div>`;
      }
    }).join('');

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="flex_column">
      ${ mappedRules }
      </div>
      `
    });
  }
}
