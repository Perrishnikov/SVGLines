//@ts-check

/**
 * Sections do not get listeners() - just Control Groups
 * @param {object} props 
 * @param {import('./Editor.Controls').Title} props.title
 * @param {string} props.icon
 * @param {string} props.active
 * @param {string} props.html
 * @returns {string}
 */
// export function Section(props) {
//   const { title, icon, active, html } = props;
//   const activeSec = active == title ? ' active_section' : '';

//   return `
//     <section data-link="${icon}" class="control-section${activeSec}" >
//       ${Title({title})}
//       ${html}
//     </section>`;
// }
export class Section {
  constructor(props) {
    this.title = props.title;
    this.sectionClass = '.control-section';
    this.icon = props.icon;
    this.controlGroups = props.controlGroups;
  }

  render(props) {
    const { active } = props;
    const activeSec = active == this.title ? ' active_section' : '';

    return `
    <section data-link="${this.title}" class="control-section${activeSec}" >
      ${Title(this.title)}
      ${this.controlGroups.map(group => {
        return group.render();
      })}
    </section>`;
  }

}

/**
 * Used by only by Nav....
 * @param {string} title
 * @returns {string}
 */
export function Title(title) {

  return `
    <div class="">
      <h3 class="section-title">${title}</h3>
    </div>`;
}

export function Control(props) {

}

export class ControlGroup {
  constructor(props) {

  }

  listeners(){

  }
  render() {

  }

}
