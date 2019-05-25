//@ts-check
import { Control } from './Editor.Components.js';
import { Section} from './Editor.Controls.Wrappers.js';

/**
 * 
 * @param {object} props 
 * @param {import('./Editor.Controls').Icon} props.icon
 * @param {import('./Editor.Controls').Title} props.title
 * @param {import('./Editor.Controls').Active} props.active
 * @param {import('./Editor.Controls').State["grid"]} props.grid
 * @param {import('./Editor.Controls').State["w"]} props.w
 * @param {import('./Editor.Controls').State["h"]} props.h
 */
export function Settings(props) {
  const { w, h, grid, title, icon, active } = props;
  
  return Section ({
    title,
    icon,
    active,
    html: `
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
    </div>`
  });
}