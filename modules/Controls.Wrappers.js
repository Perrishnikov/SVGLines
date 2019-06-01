//@ts-check


/**
 * 
 * @param {object} props 
 * @param {import('./Editor.Controls').Title} props.title
 * @param {string} props.icon
 * param {import('./Editor.Controls').localState} props.localState
 * @param {string} props.active
 * @param {string} props.html
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

export function Title(props) {
  const { title } = props;

  return `
    <div class="">
      <h3 class="section-title">${title}</h3>
    </div>`;
}