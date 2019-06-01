//@ts-check
import { Control, ReturnTags } from './Editor.Components.js';
import { Section } from './Editor.Controls.Wrappers.js';
import { Lines_ } from './Editor.Controls.Components.js';

/**
 * 
 * @param {object} props 
 * @param {import('./Editor.Controls').Icon} props.icon
 * @param {import('./Editor.Controls').Title} props.title
 * @param {import('./Editor.Controls').Active} props.active
 * @param {import('./Editor.Controls').State["tags"]} props.tags
 * @param {import('./Editor.Controls').State["lineRules"]} props.lineRules
 */
export function Lines(props) {
  const { title, active, icon, tags, lineRules } = props;

  return Section({
    title,
    icon,
    active,
    html: `
    <div class="control-group">
      <span class="control-group-title">Import & Export JSON(i)</span>
      <div class="control-row">

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
    </div>

      
    <div class="control-group">
      <span class="control-group-title">Tags(i)</span>
      
        ${ReturnTags({tags})}

    </div>

    <div class="control-group">
      <span class="control-group-title">Line ID Options(i)</span>

      <div class="control-row">
        ${Lines_.Rules({rules:lineRules})}
      </div>
      <div class="control-row">
      ${Control({
        type:'button',
        action:'generateLineIds',
        value:'Generate Line Id',
        // onclick: log()
      })}
      </div>
    </div>
    <div>
      <div class="control-row">
      ${Control({
        name:'Line List (x to remove line)',
        type:'',
        value: ''
        // onchange:log()
      })}
      </div>
    </div>`
  });
  // ${Control({
  // type:'button',
  // action:'assignUID',
  // value:'Assign UIDs',
  // onclick: this.removeActivePoint
  // onClick={ (e) => props.removeActivePoint(e) } />
  // })}
}
