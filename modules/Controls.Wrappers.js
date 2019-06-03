//@ts-check

/**
 * @typedef {import('./Editor.Controls').LocalState["ACTIVE"]} Active
 * @typedef {import('./CG/ControlGroup').default} ControlGroup
 */


export class Section {
  /**
   * Sections do not get listeners() - just Control Groups
   * @param {object} props 
   * @param {import('./Editor.Controls').Title} props.title
   * @param {string} props.icon
   * @param {Array<ControlGroup>} props.controlGroups
   */
  constructor(props) {
    this.title = props.title;
    this.sectionClass = '.control-section';
    this.icon = props.icon;
    this.controlGroups = props.controlGroups;
  }

  /**
   * @param {Active} active
   * @returns {string} HTML to render
   */
  render(active) {
    const activeSec = active == this.title ? ' active_section' : '';

    const controlGroups = this.controlGroups.map(group => {

      return group.render(active);
    }).join('');

    // return controlGroups;
    return `
    <section data-link="${this.title}" class="control-section${activeSec}" >
      <div class="">
        <h3 class="section-title">${this.title}</h3>
      </div>
      ${controlGroups}
    </section>`;
  }
}


/**
 * Creates Button 
 * @param {object} props 
 * @param {string} props.action
 * @param {string} props.name
 * @returns {string}
 */
export function Button(props) {
  const { action, name } = props;
  return `
  <button data-action="${action}"
    class="control-button">
    ${ name }
  </button>
  `;
}


export function Control(props) {

}
