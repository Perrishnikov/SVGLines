//@ts-check

import ControlGroup from './xControlGroup.js';
import Listener from '../Listener.js';
import { Button, CheckBox } from './xComponents.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**
 * Export
 * @class 
 * @extends {ControlGroup}
 */
export default class Export extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Export';
    this.id = 'export';
    this.selector = `#${this.id}`;

    this.setState = props.setState;
    this.getState = props.getState;

    /**@type {Number} */
    this.toggleNumber = 0; //used for toggle     
    /**@type {Array<String>} */
    this.choices = ['JSON', 'String']; //or String
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
        callback: this.handleClick,
        cgId: this.selector,
        keys: null
      }),
    ];
  }

  handleClick = (e) => {
    /**@type {HTMLElement} */
    const toggleContainer = e.target.closest('#toggle-container');

    if (toggleContainer) {

      //toggle the choice index
      this.toggleNumber = this.toggleNumber === 0 ? 1 : 0;

      [...toggleContainer.children].forEach(kid => {

        if (kid.dataset.value) {
          kid.dataset.value = '';
        } else {
          kid.dataset.value = 'active';
        }

      });
    }


    /**@type {HTMLElement} */
    const buttonClick = event.target.closest('button');

    if (buttonClick) {
      switch (buttonClick.dataset.action) {
        case 'export':
          this.export(this.choices[this.toggleNumber]);
          break;
        default:
          console.error('Couldnt find button');
      }
    }
  }

  export = (choice) => {
    let source = '';

    console.log(`choice: ${choice}`);
    if (choice === 'JSON') {
      source = JSON.stringify(this.getState().lines, null, ' ');
      // console.log(source);
    } else if (choice === 'String') {
      source = document.querySelector('.ad-SVG').innerHTML;
    }

    /** Write the Pipeified text to the source box and copy it to clipboard */
    navigator.clipboard.writeText(source)
    .then(function() {
      /* clipboard successfully set */
    }, function() {
      /* clipboard write failed */
    });
  }


  /**
   * param {object} props
   * @param {State} state
   * @returns {string} HTML to render
   */
  render = (state) => {

    const stringOptions = `
    <div class="control-row button-row">
        <p>String; id, tags, </p>
    </div> 
    `;

    const jsonOptions = `
    <div class="control-row button-row">
        <p>json; grid</p>
    </div> 
    `;

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">

        <div class="tag-row">
          
          <div id="exportContainer">
            <div class="inner-container">
              ${this.choices.map(choice => {
                return `
                <div class="toggle">
                  <p>${choice}</p>
                </div>
                `;
              }).join('')}
            </div>
            
            <div class="inner-container" id="toggle-container">
              ${this.choices.map((choice, index) => {
                return `
                <div data-value="${index === this.toggleNumber ? 'active' : ''}" class="toggle">
                  <p>${choice}</p>
                </div>
                `;
              }).join('')}          
            </div>

          </div>
          
        </div>

        ${this.choices[this.toggleNumber] === 'String' ? stringOptions : jsonOptions}

        <div class="control-row button-row">
        ${Button({
          dataAction: 'export',
          name: `export`,
          info: 'Copy to clipboard'
        })}
        </div> 
      
      
      </div>
      `
    });
  }
}
