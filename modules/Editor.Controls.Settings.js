//@ts-check
import { Control } from './Editor.Components.js';
import {Title} from './Editor.Controls.Wrappers.js';

export function Settings(props) {
  const { w, h, grid, title, id, icon, localState } = props;
  let { ACTIVE } = localState;
  const active = ACTIVE == title ? ' active_section' : '';

  return `
    <div data-icon="${icon}" class="control-section${active}" id="${id}">
      ${Title({title})}

      <div class="ad-Controls-container controls_div flex_row">
      ${Control({
        name:'Width',
        type:'EditableText',
        value: w,
        // onchange:log()
      })}
      ${Control({
        name:'Height',
        type:'EditableText',
        value: h,
        // onChange={ (e) => props.setHeight(e) } />
      })}
    </div>
    <div class="ad-Controls-container controls_div flex_row">
      ${Control({
        name:'Grid size',
        type:'EditableText',
        value: grid.size
        // onChange={ (e) => props.setGridSize(e) }
      })}
      ${Control({
        name:'Snap grid',
        type:'checkbox',
        checked: grid.snap,
        // onChange={ (e) => props.setGridSnap(e) } />
      })}
      ${Control({
        name:'Show grid',
        type:'checkbox',
        checked: grid.show
        // onChange={ (e) => props.setGridShow(e) } />
      })}
    </div>

    <div class="controls_div flex_row">
      <h3 class="ad-Controls-title">JSON</h3>
    </div>

    <div class="ad-Controls-container controls_div flex_row">
    ${Control({
      name:'Show Settings State',
      type:'text',
      value: ''
      // onchange:log()
    })}
    </div>

    <div id="coords">
    </div>

  </div>`;
}
