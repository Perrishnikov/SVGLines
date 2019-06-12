//@ts-check

/**
 * @typedef {import('./Editor.Controls').LocalState["ACTIVE"]} Active
 * @typedef {import('./CG/ControlGroup').default} ControlGroup
 * @typedef {import('./Editor').State} State
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
   * @param {object} props
   * @param {Active} props.active - Active Section
   * @param {State} props.state - State
   * @returns {string} HTML to render
   */
  render(props) {
    const {active, state} = props;
    const activeSec = active == this.title ? ' active_section' : '';

    const controlGroups = this.controlGroups.map(group => {

      // Control Groups return HTML from render()
      return group.render(state);
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

