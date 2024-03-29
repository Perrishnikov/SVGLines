//@ts-check
import ControlGroup from './xControlGroup.js';
import {Listener, LISTENERS} from '../Listener.js';
import { Icon_Check } from '../../icons/index.js';

/**
 * @typedef {import('../Editor.Controls').LocalState["ACTIVE"]} Active
 * @typedef {import('../Editor.Controls').LocalState} LocalState
 * typedef {import('../Editor.Controls').Icon} Icon
 * @typedef {import('../Editor').State} State
 */

/**
 * Control Group for manipulating Lines
 * @class LineFunctions
 * @extends {ControlGroup}
 */
export default class TagLine extends ControlGroup {
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Line Tags (i)';
    this.id = 'tagLine';
    this.getState = props.getState;
    this.setState = props.setState;
    this.getLocalState = props.getLocalState;
    this.setLocalState = props.setLocalState;
  }


  /**
   * Place a Listener on the whole component
   * @returns {Listener}
   */
  listeners() {
    return new Listener({
      type: LISTENERS.CLICK,
      callback: this.handleClick.bind(this),
      cgId: '#tagLine',
      keys: null
    });
  }


  /**
   * When User clicks a Tag in Line -> Line Tags, remove this Tag from the Line's Tags
   * @param {string} removeTag 
   */
  handleLineRemoveTag(removeTag) {
    /**@type {State} */
    const { activeLineIndex, lines } = this.getState();
    let activeLine = lines[activeLineIndex];

    const filtered = activeLine.tags.filter(tag => tag !== removeTag);

    //assign the Tags to the Line
    activeLine.tags = filtered;

    this.setState({ lines });
  }


  /**
   * When User clicks a Tag in Line -> Line Tags, add this Tag to the Line's Tags
   * @param {string} addTag 
   */
  handleLineAddTag(addTag) {
    /**@type {State} */
    const { activeLineIndex, lines } = this.getState();
    let activeLine = lines[activeLineIndex];

    //Make sure that activeLine is not null
    activeLine.tags ? activeLine.tags : activeLine.tags = [];

    activeLine.tags.push(addTag);

    this.setLocalState({
      ACTIVE: this.getLocalState().LINE
    });

    this.setState({ lines });
  }


  handleClick(e) {
    /** @type {HTMLElement} */
    const dataTag = e.target.closest('[data-tag]'); //subway

    if (dataTag) {
      const value = dataTag.dataset.value; //true or false

      switch (value) {
        case 'true':
          this.handleLineRemoveTag(dataTag.dataset.tag);
          break;
        case 'false':
          this.handleLineAddTag(dataTag.dataset.tag);
          break;
        default:
          console.log(`tagLine handleClick NULL`);
      }
    }
  }


  render() {
    const { lines, tags = [] } = this.getState();

    if (lines.length > 0) {

      const mappedTags = tags.map(tag => {
        const activeLine = this.getState().lines[this.getState().activeLineIndex]
        //make sure that Active Line has Tags, if Line Tag matches App Tag...
        const active = activeLine.tags && activeLine.tags.includes(tag) ? true : false;

        return `
        <div data-tag="${tag}" data-value="${active}" class="line-tag">
          <span class="" style="line-height:24px">${tag}</span>
          <span role="button">${active ? Icon_Check(tag) : ''}</span>
        </div>
      `;
      }).join('');

      return this.wrapper({
        title: this.name,
        id: this.id,
        html: `
      <div id="used_to_be_just_lineTags" class="tag-row">
        ${mappedTags}
      </div>
      `
      });
      
    }
  }
}
