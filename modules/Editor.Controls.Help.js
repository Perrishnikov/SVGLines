//@ts-check
import { Control } from './Editor.Components.js';
import { Section} from './Editor.Controls.Wrappers.js';

/**
 * 
 * @param {object} props 
 * @param {import('./Editor.Controls').Icon} props.icon
 * @param {import('./Editor.Controls').Title} props.title
 * @param {import('./Editor.Controls').Active} props.active
 */
export function Help(props) {
  const { title, active, icon } = props;
  

  return Section ({
    title,
    icon,
    active,
    html: ``
  });
}
