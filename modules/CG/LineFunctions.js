//@ts-check

import ControlGroup from './ControlGroup.js';
import Listener from '../Listener.js';
import { Control} from '../Editor.Components.js';

/**
 *
 *
 * @export
 * @class LineFunctions
 * @extends {ControlGroup}
 */
export default class LineFunctions extends ControlGroup {
  super() {}

  listeners() {
    return new Listener({
      caller: 'Hola',
      selector: 'Hi',
      type: 'click',
      callback: null
    });
  }

  render() {
    return super.wrapper(`
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
    `);
    // return `<h1>Hola Ghost</h1>`;
  }
}
