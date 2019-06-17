//@ts-check

import ControlGroup from './_ControlGroup.js';
import Listener from '../Listener.js';

/**
 * @typedef {import('../Editor').State} State
 */

/**
 * Line ID
 * @class 
 * @extends {ControlGroup}
 */
export default class LineID extends ControlGroup {
  /**
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Line ID';
    this.id = 'lineId';
    this.selector = `#${this.id}`;

    this.idInput = 'idInput';

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
        type: 'keydown',
        callback: this.updateLineId,
        cgId: this.selector,
        keys: ['Enter'],
      }),
    ];
  }



  /* Keep this around for now */
  setLineId = () => {
    // /**@type {State} */
    // const { lineRules, lines } = this.getState();
    // //returns the value of the first element in the array.value

    // /** @type {string} */
    // const startingLineBasis = lineRules.find(rule => rule.id == 'lineStartingBasis').value;
    // // console.log(`startingLineBasis: ${startingLineBasis}; type: ${typeof(startingLineBasis)} `);
    // const padLength = startingLineBasis.length;

    // let count = parseInt(startingLineBasis);
    // // const parsed = parseInt(startingLineBasis);
    // // if (isNaN(parsed)) { return 0; }

    // const updatedLines = lines.map(line => {

    //   line.id = count.toString().padStart(padLength, '0');
    //   count++;

    //   return line;
    // });

    // // console.log(`startingLineBasis: ${startingLineBasis}`);
    // this.setState({
    //   lines: updatedLines,
    // });

  }


  handleLineRuleToggle = (id) => {
    const { lineRules } = this.getState();

    //map all the lineRules, change enabled att if it matches
    const mappedLineRules = lineRules.map(rule => {
      if (rule.id === id) {
        rule.enabled = rule.enabled ? false : true;
      }
      return rule;
    });

    this.setState({ lineRules: mappedLineRules });
  }


  generateNewLineId = () => {

  
  }


  /**
   * When Enter is pressed, make a new ID for the active Line
   * @param {MouseEvent} e
   */
  updateLineId = (e) => {

    if (e.key === 'Enter' && document.activeElement.id === this.idInput) {

      /**@type {State} */
      const { activeLineIndex, lines } = this.getState();

      const activeLine = lines[activeLineIndex];
      const idInput = document.querySelector(`#${this.idInput}`);

      /**@type {string} */
      const newLineId = idInput.innerText.trim(); //
      const otherLineIds = lines.map(line => {
        return line.id;
      });

      idInput.blur();
      //If the Id is valid, proceed....
      if (newLineId &&
        newLineId.length < 15 &&
        !otherLineIds.includes(newLineId)
      ) {

        //Update the line's Id
        activeLine.id = newLineId;
        this.setState({ lines });
      } else {
        //Put the old id back
        //TODO: add message if not changed
        idInput.innerText = activeLine.id;
      }
    }
  }


  /**
   * param {object} props
   * @param {State} state
   * @returns {string} HTML to render
   */
  render = (state) => {
    const { lines, activeLineIndex } = state;
    const activeLine = lines[activeLineIndex];
    const value = activeLine.id || '*';

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">
        <div class="control-row">
          <div data-tag="" data-value="" class="">
            <div id="${this.idInput}" class="textInput" contenteditable="true" >${value}</div>
          </div>
        </div>
      </div>
      `
    });
  }
}
