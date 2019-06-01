//@ts-check

/**
 * @param {object} props 
 * @param {import('./Editor.Controls').Title} props.title
 * @param {string} props.icon
 * @param {string} props.active
 * @param {string} props.html
 * @returns {string}
 */
export function Section(props) {
  const { title, icon, active, html } = props;
  const activeSec = active == title ? ' active_section' : '';

  return `
    <section data-icon="${icon}" class="control-section${activeSec}" >
      ${Title({title})}
      ${html}
    </section>`;
}

/**
 * @param {object} props
 * @param {string} props.title
 * @returns {string}
 */
export function Title(props) {
  const { title } = props;

  return `
    <div class="">
      <h3 class="section-title">${title}</h3>
    </div>`;
}

export function Control(props) {

}

export function ControlGrou(props) {

}
