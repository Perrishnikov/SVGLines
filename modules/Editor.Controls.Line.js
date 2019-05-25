//@ts-check
import { Control, TagList } from './Editor.Components.js';
import { Section } from './Editor.Controls.Wrappers.js';

/**
 * @param {object} props
 * @param {import('./Editor.Controls').State["tags"]} props.tags
 * @param {import('./Editor.Controls').State["activeLineIndex"]} props.activeLineIndex
 * @param {import('./Editor.Controls').State["lines"]} props.lines
 * @param {import('./Editor.Controls').Icon} props.icon
 * @param {import('./Editor.Controls').Title} props.title
 * @param {import('./Editor.Controls').Active} props.active
 * @param {import('./Editor').PointType} props.pointType - must be in Controls since its shared
 * @param {string} props.path
 */
export function Line(props) {
  const { icon, title, active, activeLineIndex, path, tags, lines, pointType } = props;
  const parsedLine = JSON.stringify(lines[activeLineIndex], null, '  ');
  const activeLine = lines[activeLineIndex];

  return Section({
    title,
    icon,
    active,
    html: `
    <div class="control-group">
      <span class="control-group-title">Line Functions (i)</span>
      <div class="control-row">
        ${Control({
          type: 'button',
          action: 'resetLine',
          value: 'Reset Line'
        })}
        ${Control({
          type:'button',
          action:'addLine',
          value:'Add Line',
        })}
        ${Control({
          type:'button',
          action:'removeLine',
          value:'Remove Line',
        })}
      </div>
    </div>

    <div class="control-group">
      <span class="control-group-title">Line Tags (i)</span>
      ${TagList({
        name:'Line Tags',
        tags,
        activeLine
      })}
    </div>

    <div class="control-group">
      <span class="control-group-title">Line ID (i)</span>
      ${Control({
        name:'Line ID',
        type:'EditableText',
        value: '000',
        activeLine
      })}
    </div>

    <div class="control-group">
      <span class="control-group-title">Points (i)</span>
      ${Control({
        name:'Point type',
        type:'choices',
        id:'pointType',
        choices:[
            { name: 'L', value: 'l', checked: pointType == 'l' },
            { name: 'Q', value: 'q', checked: pointType == 'q' },
            { name: 'C', value: 'c', checked: pointType == 'c' },
            { name: 'A', value: 'a', checked: pointType == 'a' }
        ]
      })}

      <div class="control-row">
        ${Control({
          type:'button',
          action:'addPoint',
          value:'Add',
          // onclick: log()
        })}
        ${Control({
          type:'button',
          action:'removePoint',
          value:'Remove',
          // onclick: this.removeActivePoint
          // onClick={ (e) => props.removeActivePoint(e) } />
        })} 
      </div>
    </div>

    <div class="control-group">
      <span class="control-group-title">LINE DATA (i)</span>

      ${Control({
        name:'Line JSON',
        type:'StaticText',
        value: parsedLine
        // onchange:log()
      })}

      ${Control({
        name:'Line Path (Mimic svg https://iconsvg.xyz/)',
        type:'StaticText',
        value: path
        // onchange:log()
      })}

    </div>
    `
  });
  // return `

  //   <section data-icon="${icon}" class="control-section${active}" id="${id}">
  //     ${Title({title})}

  //     <div class="control-group">
  //       <span class="control-group-title">Line Functions (i)</span>
  //       <div class="control-row">
  //         ${Control({
  //           type: 'button',
  //           action: 'resetLine',
  //           value: 'Reset Line'
  //         })}
  //         ${Control({
  //           type:'button',
  //           action:'addLine',
  //           value:'Add Line',
  //         })}
  //         ${Control({
  //           type:'button',
  //           action:'removeLine',
  //           value:'Remove Line',
  //         })}
  //       </div>
  //     </div>

  //     <div class="control-group">
  //       <span class="control-group-title">Line Tags (i)</span>
  //       ${TagList({
  //         name:'Line Tags',
  //         tags,
  //         activeLine
  //       })}
  //     </div>

  //     <div class="control-group">
  //       <span class="control-group-title">Line ID (i)</span>
  //       ${Control({
  //         name:'Line ID',
  //         type:'EditableText',
  //         value: '000',
  //         activeLine
  //       })}
  //     </div>

  //   <div class="control-group">
  //     <span class="control-group-title">Points (i)</span>

  //       ${Control({
  //         name:'Point type',
  //         type:'choices',
  //         id:'pointType',
  //         choices:[
  //             { name: 'L', value: 'l', checked: pointType == 'l' },
  //             { name: 'Q', value: 'q', checked: pointType == 'q' },
  //             { name: 'C', value: 'c', checked: pointType == 'c' },
  //             { name: 'A', value: 'a', checked: pointType == 'a' }
  //         ]
  //       })}


  //     <div class="control-row">
  //       ${Control({
  //         type:'button',
  //         action:'addPoint',
  //         value:'Add',
  //         // onclick: log()
  //       })}
  //       ${Control({
  //         type:'button',
  //         action:'removePoint',
  //         value:'Remove',
  //         // onclick: this.removeActivePoint
  //         // onClick={ (e) => props.removeActivePoint(e) } />
  //       })} 
  //       </div>
  //     </div>

  //     <div class="control-group">
  //       <span class="control-group-title">LINE DATA (toggle JSON and <path>. Mimic https://iconsvg.xyz/) (i)</span>

  //       ${Control({
  //         name:'Line path',
  //         type:'StaticText',
  //         value: parsedLine
  //         // onchange:log()
  //       })}

  //     </div>
  //   </section>`;
}
