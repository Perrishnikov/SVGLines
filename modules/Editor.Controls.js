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
   * @param {Element} target 
   */
  constructor(editor, target) {
    this.id = target;
    this.setState = editor.setState;
    this.positiveNumber = editor.positiveNumber;
    this.setPointCoords = editor.setPointCoords;
    this.setQuadraticCoords = editor.setQuadraticCoords;
    this.setCubicCoords = editor.setCubicCoords;
    this.getState = editor.getState;


    this.id.addEventListener('click', (e) => {
      e.stopPropagation();

      let click = [...e.target.classList];
      let id = e.target.id;
      // console.dir(id);

      //REMOVE POINT
      if (click.includes('ad-Button--delete')) {
        this.removeActivePoint();
      } else if (click.includes('ad-Choice-input')) {
        // console.log(`setPointType`);
        this.setPointType(e);
      }

      //NAVIGATION ICONS
      if (id === 'nav_settings') {
        this.navActive(e.target);
        this.hideNavComponentExcept('settings');
        // console.log(`nav_settings`);
      } else if (id === 'nav_lines') {
        this.navActive(e.target);
        this.hideNavComponentExcept('lines');
        // console.log(`nav_lines`);
      } else if (id === 'nav_help') {
        this.navActive(e.target);
        this.hideNavComponentExcept('help');
        // console.log(`nav_help`);
      }

    });

  }

  hideNavComponentExcept = (target) => {
    const navs = [...document.querySelectorAll('[data-component="nav"]')];
    // const p = [...target.parentElement.children];
    // console.log(navs);
    navs.forEach(element => {
      console.dir(element);
      if (element.id !== target) {
        element.classList.add('hide_nav_component');
      } else {
        element.classList.remove('hide_nav_component');
      }
    })
    // target.forEach(element => {
    //   console.log(`${element}`);
    //   let t = document.querySelector(`#${element}`);

    //   console.dir(t);
    //   t.classList.add('hide_nav_component');
    //   // console.log(element.classList);
    // });

    // target.children[0].classList.add('active_nav');

  }

  /**
   * Activate the Nav when clicked
   *`Remove and add class active_nav'
   * @memberof Controls
   * @param {Element} target
   */
  navActive = (target) => {
    const p = [...target.parentElement.children];

    p.forEach(element => {
      // console.dir(element);
      element.children[0].classList.remove('active_nav');
      // console.log(element.classList);
    });

    target.children[0].classList.add('active_nav');
  }

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
    return (
      `<nav>
          ${NavComponent({
            icon: 'settings',
            id:'nav_settings',
            active: true
          })}
          ${NavComponent({
            icon:'lines',
            id:'nav_lines'
          })}
          ${NavComponent({
            icon: 'help',
            id:'nav_help'
          })}
      </nav>
        ${this.Settings({w, h, grid})}
        ${this.Lines({params,pointType})}`
    );
  }

  Lines = (props) => {
    const { pointType, params } = props;

    return `
    <div data-component="nav" id="lines">
    <div class="controls_div flex_row">
    <h3 class="ad-Controls-title">Lines</h3>
</div>
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
          // onChange:{ (e) => props.setPointType(e) } 
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
    const { w, h, grid } = props;
    return `
        <div data-component="nav" id="settings">

        <div class="controls_div flex_row">
        <h3 class="ad-Controls-title">Settings</h3>
    </div>

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



}
// export { Controls, addControlListeners };


Controls.Render = (props) => {

};
