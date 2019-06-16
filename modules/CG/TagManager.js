//@ts-check

import ControlGroup from './_ControlGroup.js';
import Listener from '../Listener.js';
import { Icon_Delete, Icon_ThumbsUp, Icon_ThumbsDown } from '../../icons/index.js';

/**
 * @typedef {import('../Editor.Controls').LocalState["ACTIVE"]} Active
 * @typedef {import('../Editor.Controls').LocalState} LocalState
 * @typedef {import('../Editor.Controls').Icon} Icon
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
        type: 'click',
        callback: this.handleClick,
        cgId: this.selector, //or key - dont need both
        keys: null
      }),
      new Listener({
        type: 'keydown',
        callback: this.handleKeyDown,
        cgId: this.selector,
        keys: ['Enter'],
      }),
      new Listener({
        type: 'focusin',
        callback: this.focusIn,
        cgId: this.selector,
        keys: null
      })
    ];
  }

  focusIn = (e) => {
    // e.stopPropagation();
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

      this.handleAddTag({ target: e.target, tags });

    }
  }

  /**
   * When User hits Enter, add the new Tag to State
   * Called from Editor keydown Event Listener
   * @param  {object} props 
   * @param {HTMLElement} props.target
   * @param {Array<string>} props.tags
   */
  handleAddTag = (props) => {
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

  handleClick = (e) => {
    // returns <div data-tag="taxi"....></div>
    const cg = e.target.closest(this.selector);

    if (cg) {
      const taggedAncestor = e.target.closest('div[data-tag]');
      const dataset = e.target.dataset;

      if (taggedAncestor) {

        this.toggleTagConfirmDelete();
        this.setLocalState({
          TAG_TO_DELETE: taggedAncestor.dataset.tag
        });
      }

      const parent = e.target.parentNode;
      const parentClasses = [...parent.classList];

      //SAVE -> TAGS -Confirm Delete
      if (dataset.value === 'confirm-yes') {
        const { TAG_TO_DELETE } = this.getLocalState();

        this.handleRemoveGlobalTag(TAG_TO_DELETE);
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
   * When User clicks Tag's X, pop Tag from State
   * Then remove the Tag from all Lines
   * @param {string} target 'subway'
   */
  handleRemoveGlobalTag = (target) => {
    const { tags } = this.getState();
    // console.log(`target: ${target}`);

    const cleanedTags = tags.filter(tag => tag !== target);

    this.setLocalState({ 
      TAG_TO_DELETE: '',
      ACTIVE: this.getLocalState().LINES
    });
    this.setState({ tags: cleanedTags });
    // this.setState({ tags: cleanedTags, lines: cleanedLines });
  }


  /**
   * param {object} props
   * @param {State} state
   * @returns {string} HTML to render
   */
  render(state) {
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
