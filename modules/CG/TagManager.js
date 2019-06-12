//@ts-check

import ControlGroup from './ControlGroup.js';
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
   * @param {import('../Editor.Controls').State["tags"]} props.tags
   * @param {function} props.setState
   * @param {function} props.getLocalState
   * @param {function} props.setLocalState
   */
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'Tag Manager (i)';
    this.id = 'tagManager';
    this.selector = `#${this.id}`;
    this.tags = props.tags || [];
    this.setState = props.setState;
    this.getLocalState = props.getLocalState;
    this.setLocalState = props.setLocalState;
    //imported functions
    // console.log(this.tags);
    // console.log(this.controls.getLocalState());
  }

  /**
   * Place a Listener on the whole component
   * @returns {Listener | Array<Listener>}
   */
  listeners() {
    return [
      new Listener({
        caller: this.name,
        selector: 'document',
        type: 'click',
        callback: this.handleClick.bind(this)
      }),
      new Listener({
        caller: this.name,
        selector: 'document',
        type: 'keydown',
        callback: this.handleKeyDown.bind(this)
      }),
      new Listener({
        caller: this.name,
        selector: 'document',
        type: 'focusin',
        callback: (e) => {
          const cg = e.target.closest('#newTagText');

          if (cg) {
            return this.focusIn(e);
          }
        }
      })
    ];
  }

  focusIn = (e) => {
    // e.stopPropagation();
    // e.preventDefault();

    console.log(`focusin!`);
    /**@type {HTMLElement} */
    const newTagText = document.querySelector('#newTagText');

    if (newTagText.id == e.target.id) {
      // this.toggleAddTagFocus(newTagText);
      newTagText.focus();
    }
    console.dir(e.target);
  }
  handleKeyDown = (e) => {
    // console.log(`handleKeyDown: ${e.key}`);
    // console.log(e);
    //If Enter is pressed in the Add Tag Div CONTROLS -> LINES
    if (e.key === 'Enter' && document.activeElement.id === 'newTagText') {
      // handle the Add Tag
      this.handleAddTag(e.target);
    }
  }

  /**
   * When User hits Enter, add the new Tag to State
   * Called from Editor keydown Event Listener
   * @param {HTMLElement} target 
   */
  handleAddTag(target) {
    // console.log('handleAddTag');
    // console.log(target);
    let tags = this.tags;

    //if all the Tags have been deleted, create a new array
    tags = tags ? tags : [];

    //Clean use input on Tag name
    const newTag = target.innerText.trim();
    //TODO: validation
    target.blur();

    //If the Tag is valid, proceed....
    if (newTag && newTag.length < 15) {
      tags.push(newTag);
      // this.toggleAddTagFocus(target);
      this.setState({ tags });
    }
  }

  handleClick(e) {
    // console.log('TagManager Click');
    // returns <div data-tag="taxi"....></div>
    const cg = e.target.closest(this.selector);

    if (cg) {
      const taggedAncestor = e.target.closest('div[data-tag]');
      const dataset = e.target.dataset;

      if (taggedAncestor) {
        console.log('taggedAncestor clicked');
        // const target = taggedAncestor.dataset.tag

        this.toggleTagConfirmDelete();
        this.setLocalState({ TAG_TO_DELETE: taggedAncestor.dataset.tag });
        // console.log(`TAG_TO_DELETE: ${taggedAncestor.dataset.tag}`);
        // this.handleRemoveGlobalTag(target);
      }

      // const classList = [...e.target.classList];

      // console.log(classList);
      // console.log(dataset);
      //  SAVE -> TAGS - REMOVE TAG when (x) clicked
      // if (classList.includes('svg_tag') && dataset.tag) {
      //target = <div><svg class="svg-tag">
      //set localState so we have a handle on the tag to delete
      // this.setLocalState({ TAG_TO_DELETE: dataset.tag });
      // console.log(this.getLocalState());
      //Open Confirm Delete Dialogue

      // }
      // console.log(this.localState);
      const parent = e.target.parentNode;
      const parentClasses = [...parent.classList];

      // //SAVE -> TAGS -Confirm Delete
      if (dataset.value === 'confirm-yes') {

        const { TAG_TO_DELETE } = this.getLocalState();
        // console.log(`TAG_TO_DELETE: ${TAG_TO_DELETE}`);
        this.handleRemoveGlobalTag(TAG_TO_DELETE);
        // console.log(dataset);
      } else if (dataset.value === 'confirm-no') {
        this.toggleTagConfirmDelete();
      }

      //   // //LINE -> TAGS 
      // if (parentClasses.includes('line-tag')) {
      //   //LINE -> TAGS - Add
      //   if (parent.dataset.value === 'true') {
      //     this.handleLineRemoveTag(parent.dataset.tag);
      //   }
      //   //LINE -> TAGS - Remove
      //   else if (parent.dataset.value === 'false') {
      //     this.handleLineAddTag(parent.dataset.tag);
      //   }
      // }
    }
    // console.log(`taggedAncestor: `);
    // console.dir(taggedAncestor);
    // console.dir(`e.target:`);
    // console.dir(e.target);
    // console.log(dataset);



  }


  // removeAddToggleFocus() {
  //   document.querySelector('#newTagText').classList.remove('active');
  // }

  /**
   * When user clicks (x) to delete Tag, open the Tag Confirm Dialogue
   * Toggle the active class 
   */
  toggleTagConfirmDelete() {
    const d = document.querySelector('#tagConfirmDelete');

    d.classList.toggle('active');
  }

  /**
   * When User clicks Tag's X, pop Tag from State
   * Then remove the Tag from all Lines
   * @param {string} target 'subway'
   */
  handleRemoveGlobalTag(target) {
    // const { tags: gtags, lines } = this.editor.getState();
    console.log(`target: ${target}`);
    const cleanedTags = this.tags.filter(tag => tag !== target);

    console.log(cleanedTags);
    this.setLocalState({ TAG_TO_DELETE: '' });
    this.setState({ tags: cleanedTags });
    // this.setState({ tags: cleanedTags, lines: cleanedLines });
  }

  //LINES...
  // removeRemovedTagFromLines() {
  //   const cleanedLines = lines.map(line => {
  //     const cleanTags = line.tags.filter(tag => tag !== target);
  //     line.tags = cleanTags;
  //     return line;
  //   });
  // }







  //   return `
  //   <div data-tag="${tag}" data-value="true" class="line-tag">
  //     <span class="" style="line-height:24px">${tag}</span>
  //     <span role="button">${Icon_Delete(tag)}</span>
  //   </div>
  // `;
  /**
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
