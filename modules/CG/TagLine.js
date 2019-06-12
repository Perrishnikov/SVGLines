//@ts-check

import ControlGroup from './ControlGroup.js';
import Listener from '../Listener.js';
import { Icon_Check } from '../../icons/index.js';

/**
 * @typedef {import('../Editor.Controls').LocalState["ACTIVE"]} Active
 * @typedef {import('../Editor.Controls').LocalState} LocalState
 * @typedef {import('../Editor.Controls').Icon} Icon
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
    this.selector = `#${this.id}`;
    this.tags = props.tags;
    this.activeLine = props.activeLine;
    //imported functions
  }

  /**
   * Place a Listener on the whole component
   * @returns {Listener}
   */
  listeners() {
    return new Listener({
      caller: this.name,
      selector: 'document',
      type: 'click',
      callback: this.handleClick.bind(this)
    });
  }

    //   //LINE -> TAGS 
  //   if (parentClasses.includes('line-tag')) {
  //     //LINE -> TAGS - Add
  //     if (parent.dataset.value === 'true') {
  //       this.handleLineRemoveTag(parent.dataset.tag);
  //     }
  //     //LINE -> TAGS - Remove
  //     else if (parent.dataset.value === 'false') {
  //       this.handleLineAddTag(parent.dataset.tag);
  //     }

    /**
   * When User clicks a Tag in Line -> Line Tags, remove this Tag from the Line's Tags
   * @param {string} removeTag 
   */
  handleLineRemoveTag(removeTag) {
    const { activeLineIndex, lines } = this.editor.getState();
    let activeLine = lines[activeLineIndex];

    const filtered = activeLine.tags.filter(tag => tag !== removeTag);

    //assign the Tags to the Line
    activeLine.tags = filtered;

    this.editor.setState({ lines });
  }


  /**
   * When User clicks a Tag in Line -> Line Tags, add this Tag to the Line's Tags
   * @param {string} addTag 
   */
  handleLineAddTag(addTag) {
    const { activeLineIndex, lines } = this.editor.getState();
    let activeLine = lines[activeLineIndex];

    activeLine.tags ? activeLine.tags : [];

    activeLine.tags.push(addTag);

    this.editor.setState({ lines });
  }

  handleClick(e) {
    /** @type {LocalState['HELP']} */
    const action = e.target.dataset.action;
    // console.log(`${this.name}: data-action: ${action}`);

    switch (action) {
      // case 'resetLine': 
      // break;
      default:
        // console.log(`NULL`);
    }
  }


  render() {
    // const { activeLine, tags = [] } = this;

    const mappedTags = this.tags.map((tag, i) => {
      //make sure that Active Line has Tags, if Line Tag matches App Tag...
      const active = this.activeLine.tags && this.activeLine.tags.includes(tag) ? true : false;

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

// function TagList(props) {
//   // const allTags = props.tags ? props.tags : [];
//   const { name, activeLine, tags = [] } = props;

//   const mappedTags = tags.map((tag, i) => {
//     //make sure that Active Line has Tags, if Line Tag matches App Tag...
//     const active = activeLine.tags && activeLine.tags.includes(tag) ? true : false;

//     return `
//       <div data-tag="${tag}" data-value="${active}" class="line-tag">
//         <span class="" style="line-height:24px">${tag}</span>
//         <span role="button">${active ? Icon_Check(tag) : ''}</span>
//       </div>
//     `;
//   }).join('');

//   return `
//     <div id="lineTags" class="tag-row">
//       ${mappedTags}
//     </div>
//     `;
// }
