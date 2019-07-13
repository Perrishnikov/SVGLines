//@ts-check

import ControlGroup from './xControlGroup.js';
import {Listener, LISTENERS} from '../Listener.js';
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
    this.CHOICES = ['JSON', 'String']; //or String

    this.OPTIONS = {
      EXPORT_ID: { id: 'exportID', value: 1, name: 'Export ID\'s (JSON)' },
      EXPORT_TAG: { id: 'exportTag', value: 1, name: 'Export Tags (JSON)' },
      EXPORT_Z: { id: 'exportZ', value: 1, name: 'Export Z (JSON)' }
    };
  }

  /**
   * Place a Listener on the whole component
   * Dont need to bind this 
   * @returns {Listener | Array<Listener>}
   */
  listeners = () => {
    return [
      new Listener({
        type: LISTENERS.CLICK,
        callback: this.handleClick,
        cgId: this.selector,
        keys: null
      }),
    ];
  }

  handleClick = (e) => {
    /**
     * JSON or string toggle
     * @type {HTMLElement} 
     */
    const toggleContainer = e.target.closest('#toggle-container');

    if (toggleContainer) {

      //toggle the choice [string | JSON] index
      this.toggleNumber = this.toggleNumber === 0 ? 1 : 0;

      [...toggleContainer.children].forEach(kid => {

        if (kid.dataset.value) {
          kid.dataset.value = '';
        } else {
          kid.dataset.value = 'active';
        }

      });
    }

    /**
     * Export options
     * @type {HTMLElement} 
     */
    const option = e.target.closest(`[data-type="exportOptions"]`);

    if (option) {

      switch (option.dataset.action) {
        case this.OPTIONS.EXPORT_ID.id:
          this.OPTIONS.EXPORT_ID.value = this.OPTIONS.EXPORT_ID.value === 0 ? 1 : 0;
          break;
        case this.OPTIONS.EXPORT_TAG.id:
          this.OPTIONS.EXPORT_TAG.value = this.OPTIONS.EXPORT_TAG.value === 0 ? 1 : 0;
          break;
        case this.OPTIONS.EXPORT_Z.id:
          this.OPTIONS.EXPORT_Z.value = this.OPTIONS.EXPORT_Z.value === 0 ? 1 : 0;
          break;
        default:
          '';
      }
    }

    /**@type {HTMLElement} */
    const buttonClick = event.target.closest('button');

    if (buttonClick) {
      switch (buttonClick.dataset.action) {
        case 'export':
          this.export(this.CHOICES[this.toggleNumber]);
          break;
        default:
          console.error('Couldnt find button');
      }
    }
  }

  export = (choice) => {
    let source = '';
    let lines = this.getState().lines;

    //Filter out id's if unchecked
    if (!this.OPTIONS.EXPORT_ID.value) {
      lines.map(line => {
        delete line.id;
        return line;
      });
    }

    //Filter out tags if unchecked
    if (!this.OPTIONS.EXPORT_TAG.value) {
      lines.map(line => {
        delete line.tags;
        return line;
      });
    }

    //Filter out z if unchecked
    if (!this.OPTIONS.EXPORT_Z.value) {
      lines.map(line => {
        delete line.z;
        return line;
      });
    }

    console.log(`choice: ${choice}`);
    if (choice === 'JSON') {
      source = JSON.stringify(lines, null, ' ');
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
      <div class="control-row">
      ${CheckBox({
        dataType: 'exportOptions',
        dataAction: this.OPTIONS.EXPORT_ID.id,
        value: this.OPTIONS.EXPORT_ID.value,
        name: this.OPTIONS.EXPORT_ID.name,
      })}
      </div>
      <div class="control-row">
      ${CheckBox({
        dataType: 'exportOptions',
        dataAction: this.OPTIONS.EXPORT_TAG.id,
        value: this.OPTIONS.EXPORT_TAG.value,
        name: this.OPTIONS.EXPORT_TAG.name
      })}
      </div>
      <div class="control-row">
      ${CheckBox({
        dataType: 'exportOptions',
        dataAction: this.OPTIONS.EXPORT_Z.id,
        value: this.OPTIONS.EXPORT_Z.value,
        name: this.OPTIONS.EXPORT_Z.name
      })}
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
              ${this.CHOICES.map(choice => {
                return `
                <div class="toggle">
                  <p>${choice}</p>
                </div>
                `;
              }).join('')}
            </div>
            
            <div class="inner-container" id="toggle-container">
              ${this.CHOICES.map((choice, index) => {
                return `
                <div data-value="${index === this.toggleNumber ? 'active' : ''}" class="toggle">
                  <p>${choice}</p>
                </div>
                `;
              }).join('')}          
            </div>

          </div>
          
        </div>

        ${this.CHOICES[this.toggleNumber] === 'String' ? stringOptions : jsonOptions}

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
