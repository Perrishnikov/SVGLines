//@ts-check

import ControlGroup from './xControlGroup.js';
import {Listener, LISTENERS} from '../Listener.js';
import { Icon_Delete, Icon_ThumbsUp, Icon_ThumbsDown } from '../../icons/index.js';

/**
 * @typedef {import('../Editor.Controls').LocalState} LocalState
 * @typedef {import('../Editor').State} State
 */

/**
 * Control Group for manipulating Lines
 * @class LineFunctions
 * @extends {ControlGroup}
 */
export default class TagManager extends ControlGroup {
  /**
   * 
   * @param {object} props
   * @param {function} props.setState
   * @param {function} props.getState
   * @param {function} props.getLocalState
   * @param {function} props.setLocalState
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Tag Manager (i)';
    this.id = 'tagManager';
    this.selector = `#${this.id}`;

    this.setState = props.setState;
    this.getState = props.getState;
    this.getLocalState = props.getLocalState;
    this.setLocalState = props.setLocalState;
  }

  /**
   * Place a Listener on the whole component
   * @returns {Listener | Array<Listener>}
   */
  listeners() {
    return [
      new Listener({
        type: LISTENERS.CLICK,
        callback: this.handleClick,
        cgId: this.selector,
        keys: null
      }),
      new Listener({
        type: LISTENERS.KEYDOWN,
        callback: this.handleKeyDown,
        cgId: this.selector,
        keys: ['Enter'],
      }),
      new Listener({
        type: LISTENERS.FOCUSIN,
        callback: this.focusIn,
        cgId: this.selector,
        keys: null
      })
    ];
  }

  focusIn = (e) => {
    e.preventDefault();

    console.log(`focusin!`);
  }

  /**
   *This will be of type 'keypress' 
   * They will have a callback params of e and caller
   * Caller is to make sure the correct CG is called 
   * Without risk of doubling up key events
   */
  handleKeyDown = (e) => {
    // console.log(`TagManager handleKeyDown: ${e.key}`);
    //If Enter is pressed in the Add Tag Div CONTROLS -> LINES
    if (e.key === 'Enter' && document.activeElement.id === 'newTagText') {

      // handle the Add Tag
      let { tags } = this.getState();

      this.addGlobalTag({ target: e.target, tags });

    }
  }


  handleClick = (e) => {
    // returns <div data-tag="taxi"....></div>
    /**@type {HTMLElement} */
    const cg = e.target.closest(this.selector);

    if (cg) {
      /**@type {HTMLElement} */
      const taggedAncestor = e.target.closest('div[data-tag]');

      if (taggedAncestor) {

        this.toggleTagConfirmDelete();
        this.setLocalState({
          TAG_TO_DELETE: taggedAncestor.dataset.tag
        });
      }

      /**@type {HTMLDataElement} */
      const dataset = e.target.dataset;
      //SAVE -> TAGS -Confirm Delete
      if (dataset.value === 'confirm-yes') {

        /**@type {LocalState} */
        const { TAG_TO_DELETE } = this.getLocalState();

        this.removeGlobalTag(TAG_TO_DELETE);
      } else if (dataset.value === 'confirm-no') {

        this.toggleTagConfirmDelete();
      }
    }
  }


  /**
   * When user clicks (x) to delete Tag, open the Tag Confirm Dialogue
   * Toggle the active class 
   */
  toggleTagConfirmDelete = () => {
    const d = document.querySelector('#tagConfirmDelete');

    d.classList.toggle('active');
  }


  /**
   * When User hits Enter, add the new Tag to State
   * Called from Editor keydown Event Listener
   * @param  {object} props 
   * @param {HTMLElement} props.target
   * @param {Array<string>} props.tags
   */
  addGlobalTag = (props) => {
    const { tags = [], target } = props;

    //Clean use input on Tag name
    const newTag = target.innerText.trim();
    target.blur();

    //If the Tag is valid, proceed....
    if (newTag && newTag.length < 15 && !tags.includes(newTag)) {
      tags.push(newTag);
      // this.toggleAddTagFocus(target);
      this.setState({ tags });
    }
  }


  /**
   * When User clicks Tag's X, pop Tag from State
   * Then remove the Tag from all Lines
   * @param {string} target 'subway'
   */
  removeGlobalTag = (target) => {
    /**@type {State} */
    const { tags, lines } = this.getState();
    // console.log(`target: ${target}`);

    const cleanedTags = tags.filter(tag => tag !== target);

    const cleanedLines = lines.map(line => {
      if(!line.tags) line.tags = [];

      //remove the removed Tag from all Lines
      const filteredTags = line.tags.filter(tag => tag !== target);
      line.tags = filteredTags;

      return line;
    });

    this.setLocalState({
      TAG_TO_DELETE: '',
      ACTIVE: this.getLocalState().LINES
    });

    this.setState({
      tags: cleanedTags,
      lines: cleanedLines,
    });
  }


  /**
   * @param {State} state
   * @returns {string} HTML to render
   */
  render(state) {
    /**@type {State} */
    const { tags = [] } = state;

    const mappedTags = tags.map(tag => {
      return `
        <div data-tag="${tag}" data-value="true" class="line-tag">
          <span class="" style="line-height:24px">${tag}</span>
          <span role="button">${Icon_Delete(tag)}</span>
        </div>
      `;
    }).join('');

    return this.wrapper({
      title: this.name,
      id: this.id,
      html: `
      <div class="control">

      <div class="tag-row">
        <div data-value="true" class="">
          <div id="newTagText" data-value="add tag" class="" contenteditable="true" ></div>
        </div>
        ${mappedTags}
      </div>
      <div id="tagConfirmDelete" class="tag-row">
        <label class="controls_label">Confirm Delete${Icon_ThumbsUp('confirm-yes')} ${Icon_ThumbsDown('confirm-no')}</label>
      </div>
      
    </div>
      `
    });

  }
}
