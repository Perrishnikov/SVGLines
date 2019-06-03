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
export default class AllTags extends ControlGroup {
  constructor(props) {
    super();
    this.wrapper = super.wrapper;
    this.name = 'All Tags (i)';
    this.id = 'allTags';
    this.selector = `#${this.id}`;
    this.tags = props.tags;
    this.activeLine = props.activeLine;
    //imported functions
  }

  /**
   * Place a Listener on the whole component
   */
  listeners() {
    return new Listener({
      caller: this.name,
      selector: this.selector,
      type: 'click',
      callback: this.handleClick.bind(this)
    });
  }

  handleClick(e) {
    /** @type {LocalState['HELP']} */
    const action = e.target.dataset.action;
    console.log(`${this.name}: data-action: ${action}`);

    switch (action) {
      // case 'resetLine': 
      // break;
      default:
        console.log(`NULL`);
    }
  }


  render() {
    const { activeLine, tags = [] } = this;

    return`
    <h1>Hola</h1>
    `;
    
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
