//@ts-check
import Listener from './Listener.js';

/**
 * @typedef {import('./Editor.Controls').LocalState["ACTIVE"]} Active
 * @typedef {import('./Editor.Controls').Sections} Sections
 * @typedef {import('./Editor.Controls').LocalState} LocalState
 * @typedef {import('./Editor.Controls').Icon} Icon
 * @typedef {import('./Editor.Controls').Title} Title
 * @typedef {string} NAV
 */

/**
 * @typedef {object} This
 * @property {Active} ACTIVE
 * @property {Sections} sections
 * @property {NAV} nav
 * @property {string} SELECTOR
 */
export default class Nav {
  /**
   * Creates the Single Navigation Element
   * @param {object} props 
   * @param {Active} props.active
   * @param {Sections} props.sections
   */
  constructor(props) {
    this.ACTIVE = props.active;
    this.sections = props.sections;
    this.NAV = 'nav'; // <nav data-action="nav"></nav>
    this.SELECTOR = `[data-action="${this.NAV}"]`; //for listener
  }

  /**
   * Set up Listeners for Nav
   * Called from Editor.Controls Constructor
   * @returns {Array<Listener>|Listener}
   */
  listeners() {

    return new Listener({
      caller: this.NAV,
      selector: this.SELECTOR,
      type: 'click',
      callback: this.handleNavClick.bind(this)
    });
  }


  /**@param {import('./Editor.Controls').E} e */
  handleNavClick(e) {
    /** @type {LocalState['HELP']} */
    const value = e.target.dataset.value;
    // console.log(`${this.NAV}: data-value: ${value}`);

    activateThisIcon(value);
    showThisSection(value);

    //Important to update localState...
    this.ACTIVE = value;
  }


  /**
   * @param {LocalState["ACTIVE"]} active
   * @returns {string} HTML to render
   */
  render(active) {
    // const { ACTIVE } = props;

    return `
    <nav id="nav">
      ${this.sections.map(section => {

        return `
        ${NavIcon({
            dataAction: this.NAV,
            dataValue: section.title,
            svg: section.icon,
            active
          })}
          `;
      }).join('')}
    </nav>
  `;
  }
}

/**
 * Activate the Nav when clicked
 *`Remove and add class active_nav'
 * @param {LocalState['HELP']} value
 * @returns void - DOM manipulation
 */
function activateThisIcon(value) {
  // console.log(`activateThisIcon: ${value}`);

  //get all the NAV icons
  const icons = [...document.querySelectorAll('.nav_icon')];

  icons.forEach(icon => {
    // remove 'active_icon' from all svg icons
    icon.classList.remove('active_icon');
    // console.log(element.classList);
  });

  // make the target svg icon active
  document.querySelector(`[data-value="${value}"]`)
    .classList.add('active_icon');
}


/**
 * Takes all Nav Sections and turns them on or off
 * param {Element} target -  of Controls Section
 * @param {LocalState['HELP']} value
 * @returns void - DOM manipulation
 */
function showThisSection(value) {
  const sections = [...document.querySelectorAll('.control-section')];

  sections.forEach(section => {
    section.classList.remove('active_section');

    // console.log(`icon: ${section.dataset.icon}, taget id: ${value}`);
    if (section.dataset.link === value) {
      section.classList.add('active_section');
    }
  });
}


/**
 * Make the Nav components
 * @param {object} props
 * @param {LocalState['ACTIVE']} props.active
 * @param {Icon} props.svg
 * @param {NAV} props.dataAction
 * @param {Title} props.dataValue
 */
function NavIcon(props) {
  const { dataAction, dataValue, svg, active } = props;

  const status = active == dataValue ? ' active_icon' : '';
  // console.log(`status: ${status}`);
  return `
  <div data-action="${dataAction}" data-value="${dataValue}" class="nav_icon${status}">
    ${svg}
  </div>
  `;
}
