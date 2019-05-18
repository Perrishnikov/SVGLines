//@ts-check
import { Control, NavComponent } from './Editor.Components.js';

/**
 * @typedef {import('./Editor').anchor} anchor
 * @typedef {import('./Editor').State} State
 * @typedef {import('./Editor').Element} Element
 * @typedef {import('./Editor').default} Editor
 * @typedef {{x:number,y:number}} coords
 * @typedef {MouseEvent} e 
 */
export default class Controls {
  /**
   * @param {Editor} editor 
   * @param {Element} targetId
   */
  constructor(editor, targetId) {
    this.id = targetId;
    this.setState = editor.setState;
    this.positiveNumber = editor.positiveNumber;
    this.setPointCoords = editor.setPointCoords;
    this.setQuadraticCoords = editor.setQuadraticCoords;
    this.setCubicCoords = editor.setCubicCoords;
    this.getState = editor.getState;

    this.localState = {
      LINE: 'line',
      SAVE: 'save',
      SETTINGS: 'settings',
      HELP: 'help',
      ACTIVE: 'save',
    };

    /** CONTROLS Event Listeners */
    this.id.addEventListener('click', (e) => {
      e.stopPropagation();

      let classList = [...e.target.classList];
      // let target = e.target;
      // console.dir(classList);x

      //REMOVE ACTIVE POINT
      if (classList.includes('ad-Button--delete')) {
        this.removeActivePoint();
      } else if (classList.includes('ad-Choice-input')) {
        // console.log(`setPointType`);
        this.setPointType(e);
      }

      //NAVIGATION ICONS
      if (classList.includes('nav_icon')) {
        //target = <nav><div id="icon_lines" class="nav_icons">

        this.activateThisIcon(e.target);
        this.showThisSection(e.target);
      }

    });
  }


  /// UI metods

  /**
   * Takes all Nav Sections and turns them on or off
   * @param {Element} target -  of Controls Section
   */
  showThisSection = (target) => {
    const sections = [...document.querySelectorAll('.controls-section')];

    sections.forEach(section => {
      // <div data-component="controls-section" id="section_lines">

      section.classList.remove('active_section');

      // console.log(`icon: ${section.dataset.icon}, taget id: ${target.id}`);
      if (section.dataset.icon === target.id) {
        section.classList.add('active_section');
      }
    });
  }

  /**
   * Activate the Nav when clicked
   *`Remove and add class active_nav'
   * @param {Element} target
   */
  activateThisIcon = (target) => {
    //get all the NAV icons
    const icons = [...document.querySelectorAll('.nav_icon')];

    icons.forEach(icon => {
      // remove 'active_icon' from all svg icons
      icon.children[0].classList.remove('active_icon');
      // console.log(element.classList);
    });

    // make the target svg icon active
    target.children[0].classList.add('active_icon');

    const sub = target.id.substring(5);
    console.log(sub);
    this.localState.ACTIVE = sub;
  }

  /** LOGIC methods */

  setHeight = (e) => {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ h: v });
  }


  setWidth = (e) => {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ w: v });
  }


  setPointType = (e) => {
    const { lines, activePoint, activeLine } = this.getState();
    const ap = lines[activeLine];

    // not the first point
    if (activePoint !== 0) {
      let v = e.target.value;

      switch (v) {
        case 'l':
          ap.points[activePoint] = {
            x: ap.points[activePoint].x,
            y: ap.points[activePoint].y
          };
          break;
        case 'q':
          ap.points[activePoint] = {
            x: ap.points[activePoint].x,
            y: ap.points[activePoint].y,
            q: {
              x: (ap.points[activePoint].x + ap.points[activePoint - 1].x) / 2,
              y: (ap.points[activePoint].y + ap.points[activePoint - 1].y) / 2
            }
          };
          break;
        case 'c':
          ap.points[activePoint] = {
            x: ap.points[activePoint].x,
            y: ap.points[activePoint].y,
            c: [{
                x: (ap.points[activePoint].x + ap.points[activePoint - 1].x - 50) / 2,
                y: (ap.points[activePoint].y + ap.points[activePoint - 1].y) / 2
              },
              {
                x: (ap.points[activePoint].x + ap.points[activePoint - 1].x + 50) / 2,
                y: (ap.points[activePoint].y + ap.points[activePoint - 1].y) / 2
              }
            ]
          };
          break;
        case 'a':
          ap.points[activePoint] = {
            x: ap.points[activePoint].x,
            y: ap.points[activePoint].y,
            a: {
              rx: 50,
              ry: 50,
              rot: 0,
              laf: 1,
              sf: 1
            }
          };
          break;
      }

      this.setState({ lines });
    }
  }


  setArcParam = (param, e) => {
    const { lines, activePoint, activeLine } = this.getState();
    const ap = lines[activeLine];
    // const cstate = this.getState();

    // const points = cstate.points;
    // const active = cstate.activePoint;
    let v;

    if (['laf', 'sf'].indexOf(param) > -1) {
      v = e.target.checked ? 1 : 0;
    } else {
      v = this.positiveNumber(e.target.value);
    }

    ap.points[activePoint].a[param] = v;

    this.setState({ lines });
  }


  setPointPosition = (coord, e) => {
    const { lines, activePoint, activeLine, w, h } = this.getState();
    const ap = lines[activeLine];

    // const cstate = this.getState();

    const coords = ap.points[activePoint];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > w) v = w;
    if (coord === 'y' && v > h) v = h;

    coords[coord] = v;

    this.setPointCoords(coords);
  }


  setQuadraticPosition = (coord, e) => {
    const { lines, activePoint, activeLine, w, h } = this.getState();
    const ap = lines[activeLine];
    // const cstate = this.getState();

    const coords = ap.points[activePoint].q;
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > w) v = w;
    if (coord === 'y' && v > h) v = h;

    coords[coord] = v;

    this.setQuadraticCoords(coords);
  }


  setCubicPosition = (coord, anchor, e) => {
    const { lines, activePoint, activeLine, w, h } = this.getState();
    const ap = lines[activeLine];
    // const cstate = this.getState();

    const coords = ap.points[activePoint].c[anchor];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > w) v = w;
    if (coord === 'y' && v > h) v = h;

    coords[coord] = v;

    this.setCubicCoords(coords, anchor);
  }


  removeActivePoint = (e) => {
    const { activePoint, lines, activeLine } = this.getState();
    // const points = cstate.points;
    // const active = cstate.activePoint;

    if (lines[activeLine].points.length > 1 && activePoint !== 0) {
      lines[activeLine].points.splice(activePoint, 1);

      this.setState({
        lines,
        activePoint: lines[activeLine].points.length - 1
      });
    }
    console.log(`Point removed`);
  }


  reset = (e) => {
    const cstate = this.getState();
    const w = cstate.w;
    const h = cstate.h;

    this.setState({
      points: [{ x: w / 2, y: h / 2 }],
      activePoint: 0
    });
  }


  setTextInputs = () => {
    //TODO:
    console.log(`setText: ${this.getState().w}`);
    // document.querySelector('#Width').value = this.getState().w;
  }



  render = (props) => {
    const { w, h, lines, activeLine, activePoint, grid } = props.state;
    const active = lines[activeLine].points[activePoint];
    const step = grid.snap ? grid.size : 1;

    let params = [];

    let pointType = 'l';

    if (active.q) {
      // console.log(`Hello Active Q`);
      pointType = 'q';
    } else if (active.c) {
      // console.log(`Hello Active C!`);
      pointType = 'c';
    } else if (active.a) {
      // console.log(`Hello Active A!`);
      pointType = 'a';

    }

    {
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="X Radius"
      //             type="range"
      //             min={ 0 }
      //             max={ props.w }
      //             step={ step }
      //             value={ active.a.rx }
      //             onChange={ (e) => props.setArcParam("rx", e) } />
      //     </div>
      // )
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="Y Radius"
      //             type="range"
      //             min={ 0 }
      //             max={ props.h }
      //             step={ step }
      //             value={ active.a.ry }
      //             onChange={ (e) => props.setArcParam("ry", e) } />
      //     </div>
      // )
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="Rotation"
      //             type="range"
      //             min={ 0 }
      //             max={ 360 }
      //             step={ 1 }
      //             value={ active.a.rot }
      //             onChange={ (e) => props.setArcParam("rot", e) } />
      //     </div>
      // )
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="Large arc sweep flag"
      //             type="checkbox"
      //             checked={ active.a.laf }
      //             onChange={ (e) => props.setArcParam("laf", e) } />
      //     </div>
      // )
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="Sweep flag"
      //             type="checkbox"
      //             checked={ active.a.sf }
      //             onChange={ (e) => props.setArcParam("sf", e) } />
      //     </div>
      // )
    }

    let { LINE, SAVE, SETTINGS, HELP, ACTIVE } = this.localState;
    console.log(`ACTIVE: ${ACTIVE}`);

    return (
      `<nav>
          ${NavComponent({
            icon:'line',
            id:`icon_${LINE}`,
            active: ACTIVE
          })}
          ${NavComponent({
            icon: 'save',
            id: `icon_${SAVE}`,
            active: ACTIVE
          })}    
          ${NavComponent({
            icon: 'settings',
            id:`icon_${SETTINGS}`,
            active: ACTIVE
          })}
          ${NavComponent({
            icon: 'help',
            id:`icon_${HELP}`,
            active: ACTIVE
          })}
      </nav>

        ${this.Line({
          id:`section_${LINE}`,
          icon:`icon_${LINE}`,
          title: LINE,
          active: ACTIVE,
          params,
          pointType
        })} 

        ${this.Save({
          id:`section_${SAVE}`,
          icon:`icon_${SAVE}`,
          title: SAVE,
          active: ACTIVE,
          params
        })}
        
        ${this.Settings({
          id:`section_${SETTINGS}`,
          icon:`icon_${SETTINGS}`,
          title: SETTINGS,
          active: ACTIVE,
          w, h, grid
        })}

        ${this.Help({
          id:`section_${HELP}`,
          icon:`icon_${HELP}`,
          title: HELP,
          active: ACTIVE,
          params
        })}
        
    `);
  }

  Section = (props) => {
    const { id, title, icon } = props;

  }

  Title = (props) => {
    let { title } = props;

    return `
      <div class="controls_div flex_row">
          <h3 class="ad-Controls-title">${title}</h3>
      </div>      
      `;
  }


  Save = (props) => {
    //id="section_save" title="save" icon="icon_save"
    const { id, title, icon } = props;
    let { ACTIVE } = this.localState;
    const active = ACTIVE == title ? ' active_section' : '';

    return `
      <div data-icon="${icon}" class="controls-section${active}" id="${id}">
      ${this.Title({title})}
      </div>
    `;
  }


  Line = (props) => {
    const { pointType, params, title, id, icon } = props;
    let {ACTIVE} = this.localState;
    const active = ACTIVE == title ? ' active_section':'';

    return `
    <div data-icon="${icon}" class="controls-section${active}" id="${id}">
        ${this.Title({title})}

        <div class="ad-Controls-container controls_div flex_row">
        ${Control({
          type: 'button',
          action: 'reset',
          value: 'Reset path',
          // onclick: log
          // onClick={ (e) => props.reset(e) } />
        })}
        </div>

        <div class="controls_div flex_row">
            <h3 class="ad-Controls-title">Point</h3>
        </div>
        <div class="controls_div flex_row">
            <h3 class="ad-Controls-title">Line</h3>
        </div>      
        <div class="ad-Controls-container controls_div flex_row">
          ${Control({
            name:'Point type',
            type:'choices',
            id:'pointType',
            choices:[
                { name: 'L', value: 'l', checked: pointType == 'l' },
                { name: 'Q', value: 'q', checked: pointType == 'q' },
                { name: 'C', value: 'c', checked: pointType == 'c' },
                { name: 'A', value: 'a', checked: pointType == 'a' }
            ]
          })}
        </div>
        
        ${ params }
        
        <div class="ad-Controls-container controls_div flex_row">
          ${Control({
            type:'button',
            action:'delete',
            value:'Delete Point',
            // onclick: this.removeActivePoint
            // onClick={ (e) => props.removeActivePoint(e) } />
          })}
          ${Control({
            type:'button',
            action:'newLine',
            value:'New Line',
            // onclick: log()
          })}
          ${Control({
            type:'button',
            action:'newPoint',
            value:'New Point',
            // onclick: log()
          })}
          ${Control({
            type:'button',
            action:'Undo',
            value:'Undo',
            // onclick: log()
          })}
        </div>
    </div>`;
  }


  Settings = (props) => {
    const { w, h, grid, title, id, icon } = props;
    let { ACTIVE } = this.localState;
    const active = ACTIVE == title ? ' active_section' : '';

    return `
      <div data-icon="${icon}" class="controls-section${active}" id="${id}">
        ${this.Title({title})}

        <div class="ad-Controls-container controls_div flex_row">
        ${Control({
          name:'Width',
          type:'text',
          value: w,
          // onchange:log()
        })}
        ${Control({
          name:'Height',
          type:'text',
          value: h,
          // onChange={ (e) => props.setHeight(e) } />
        })}
      </div>
      <div class="ad-Controls-container controls_div flex_row">
        ${Control({
          name:'Grid size',
          type:'text',
          value: grid.size
          // onChange={ (e) => props.setGridSize(e) }
        })}
        ${Control({
          name:'Snap grid',
          type:'checkbox',
          checked: grid.snap,
          // onChange={ (e) => props.setGridSnap(e) } />
        })}
        ${Control({
          name:'Show grid',
          type:'checkbox',
          checked: grid.show
          // onChange={ (e) => props.setGridShow(e) } />
        })}
      </div>
    </div>`;
  }


  Help = (props) => {
    let { title, id, icon } = props;
    let { ACTIVE } = this.localState;
    const active = ACTIVE == title ? ' active_section' : '';

    return `
    <div data-icon="${icon}" class="controls-section${active}" id="${id}">
        ${this.Title({title})}
      </div>
    `
  }
}
// export { Controls, addControlListeners };


Controls.Render = (props) => {

};
