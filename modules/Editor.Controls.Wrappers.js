//@ts-check


/**
 * 
 * @param {object} props 
 * @param {import('./Editor.Controls').title} props.title
 * @param {string} props.id
 * @param {string} props.icon
 * param {import('./Editor.Controls').localState} props.localState
 * @param {string} props.active
 * @param {string} props.html
 */
export function Section(props) {
  const { title, id, icon, active, html } = props;
  let activeSec = active == title ? ' active_section' : '';

  return `
    <section id="${id}" data-icon="${icon}" class="control-section${activeSec}" >
      ${Title({title})}
      ${html}
    </section>`;
}

export function Title(props) {
  let { title } = props;

  return `
    <div class="">
      <h3 class="section-title">${title}</h3>
    </div>`;
}