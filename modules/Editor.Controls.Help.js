//@ts-check
import { Control } from './Editor.Components.js';
import {Title} from './Editor.Controls.Wrappers.js';

export function Help(props) {
  let { title, id, icon, localState } = props;
  let { ACTIVE } = localState;
  const active = ACTIVE == title ? ' active_section' : '';

  return `
  <div data-icon="${icon}" class="control-section${active}" id="${id}">
      ${Title({title})}
    </div>
  `;
}
