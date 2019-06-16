//@ts-check
/**
 * @typedef {import('../Editor.Controls').LocalState["ACTIVE"]} Active
 * @typedef {import('../Editor').State} State
 * @typedef {import('../Listener').default} Listener
 */

export default class ControlGroup {
  constructor() {}

  /**
   * @returns {Listener|Array<Listener>}
   */
  listeners() {
    console.error(`ControlGroup Super, Must Override "Listeners()`);
    return null;
  }

  /**
   * @param {State} state
   * @returns {string} HTML to render
   */
  render(state){
    console.error(`ControlGroup Super, Must Override Render()`);
    return null;
  }

  /**
   * 
   * @param {object} props 
   * @param {string} props.html
   * @param {string} props.title
   * @param {string} props.id
   */
  wrapper(props) {
    const {html, title, id} = props;
    
    return `
    <div id="${id}" class="control-group">
      <span class="control-group-title">${title}</span>
      ${html}
    </div>
    `;
  }
}
