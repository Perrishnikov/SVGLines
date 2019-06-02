//@ts-check
import { Icon_Help, Icon_Line, Icon_Shuffle, Icon_Settings } from '../icons/index.js';
import { Listener } from './Listener.js';


export class Nav {
  constructor(localState) {
    this.localState = localState;
    this.NAV = 'nav'; // <nav data-action="nav"></nav>
  }

  listeners() {

    return new Listener(
      {
        caller: 'Nav',
        selector: '[data-action="nav"]',
        type: 'click',
        callback: this.handleNavClick.bind(this)
      }
    );
  }


  handleNavClick(e) {
    const value = e.target.dataset.value;

    console.log(`data-value: ${value}`);
    activateThisIcon(value);
    showThisSection(value);

    //Important to update localState...
    this.localState.ACTIVE = value;
  }


  /**
   * 
   * @param {import('./Editor.Controls').LocalState} props
   * @returns {string} HTML to render
   */
  render(props) {
    const { LINE, LINES, SETTINGS, HELP, ACTIVE } = props;

    return `
    <nav id="nav">
      ${Comp({
        dataAction: this.NAV,
        dataValue: LINE,
        svg: Icon_Line(),
        active: ACTIVE
      })}
      ${Comp({
        dataAction: this.NAV,
        dataValue: LINES,
        svg: Icon_Shuffle(),
        active: ACTIVE
      })}
      ${Comp({
        dataAction: this.NAV,
        dataValue: SETTINGS,
        svg: Icon_Settings(),
        active: ACTIVE
      })}
      ${Comp({
        dataAction: this.NAV,
        dataValue: HELP,
        svg: Icon_Help(),
        active: ACTIVE
      })}
    </nav>
  `;
  }
}

/**
 * Activate the Nav when clicked
 *`Remove and add class active_nav'
 * @param {string} value
 */
function activateThisIcon(value) {

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

  // //Important to update localState...
  // this.localState.ACTIVE = value;
}


/**
 * Takes all Nav Sections and turns them on or off
 * param {Element} target -  of Controls Section
 * @param {string} value
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

function Comp(props) {
  const { dataAction, dataValue, svg, active } = props;

  const status = active == dataValue ? ' active_icon' : '';
  // console.log(`status: ${status}`);
  return `
      <div data-action="${dataAction}" data-value="${dataValue}" class="nav_icon${status}">
        ${svg}
      </div>
  `;
}
