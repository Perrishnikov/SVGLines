//@ts-check
import { Control, ReturnTags } from './Editor.Components.js';
import {Title} from './Editor.Controls.Wrappers.js';

/**
 * 
 * @param {object} props 
 * @param {import('./Editor.Controls').id} props.id
 * @param {import('./Editor.Controls').icon} props.icon
 * @param {import('./Editor.Controls').title} props.title
 * @param {import('./Editor.Controls').active} props.active
 * param {number} props.activeLineIndex
 * @param {import('./Editor.Controls').State} props.tags
 * param {import('./Editor.Controls').State} props.lines
 * param {import('./Editor').pointType} props.pointType
 * param {import('./Editor.Controls').html} props.html
 */
export function Lines(props) {
  //id="section_save" title="save" icon="icon_save"
  const { id, title, active, icon, tags } = props;
  // let { ACTIVE } = localState;
  const activeSec = active == title ? ' active_section' : '';

  return `
      <div data-icon="${icon}" class="control-section${activeSec}" id="${id}">

        ${Title({title})}

        <div class="controls_div flex_row">
          <h3 class="">Import/Export</h3>
        </div>

        <div class="flex_row">

        ${Control({
          type:'button',
          action:'importFile',
          value:'Import JSON',
          // onclick: log()
        })}
        ${Control({
          type:'button',
          action:'exportFile',
          value:'export JSON',
          // onclick: this.removeActivePoint
          // onClick={ (e) => props.removeActivePoint(e) } />
        })}
                  
        </div>

        <div class="controls_div flex_row">
            <h3 class="ad-Controls-title">Tags</h3>
        </div>

        <div class="ad-Controls-container controls_div flex_row">
        
          ${ReturnTags({
            name:'Create Tag (x to remove)',
            tags
          })}

        </div>

        <div class="controls_div flex_row">
            <h3 class="ad-Controls-title">Display Lines</h3>
        </div>

        <div class="ad-Controls-container controls_div flex_row">
        ${Control({
          type:'button',
          action:'assignUID',
          value:'Assign UIDs',
          // onclick: this.removeActivePoint
          // onClick={ (e) => props.removeActivePoint(e) } />
        })}
        ${Control({
          name:'Line List (x to remove line)',
          type:'',
          value: ''
          // onchange:log()
        })}
        </div>

    </div>`;
}
