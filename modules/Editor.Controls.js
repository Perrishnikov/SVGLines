//@ts-check
import { Control } from './Editor.Components.js';
export default class Controls {
  constructor(editor, target) {
    this.id = target;
    this.setState = editor.setState;
    this.state = editor.state;

    this.bestCopyEver = editor.bestCopyEver;
    this.positiveNumber = editor.positiveNumber;
    this.setPointCoords = editor.setPointCoords;
    this.setQuadraticCoords = editor.setQuadraticCoords;
    this.setCubicCoords = editor.setCubicCoords;

    this.addListeners(this.id);
  }

  addListeners = (target) => {
    // Editor.ControlsRender({
    //   state: this.bestCopyEver(this.state), // Cloned
    //   removeActivePoint: this.removeActivePoint,
    // });
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
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;

    // not the first point
    if (active !== 0) {
      let v = e.target.value;

      switch (v) {
        case 'l':
          points[active] = {
            x: points[active].x,
            y: points[active].y
          };
          break;
        case 'q':
          points[active] = {
            x: points[active].x,
            y: points[active].y,
            q: {
              x: (points[active].x + points[active - 1].x) / 2,
              y: (points[active].y + points[active - 1].y) / 2
            }
          };
          break;
        case 'c':
          points[active] = {
            x: points[active].x,
            y: points[active].y,
            c: [{
                x: (points[active].x + points[active - 1].x - 50) / 2,
                y: (points[active].y + points[active - 1].y) / 2
              },
              {
                x: (points[active].x + points[active - 1].x + 50) / 2,
                y: (points[active].y + points[active - 1].y) / 2
              }
            ]
          };
          break;
        case 'a':
          points[active] = {
            x: points[active].x,
            y: points[active].y,
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

      this.setState({ points });
    }
  }

  setArcParam = (param, e) => {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;
    let v;

    if (['laf', 'sf'].indexOf(param) > -1) {
      v = e.target.checked ? 1 : 0;
    } else {
      v = this.positiveNumber(e.target.value);
    }

    points[active].a[param] = v;

    this.setState({ points });
  }

  setPointPosition = (coord, e) => {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setPointCoords(coords);
  }


  setQuadraticPosition = (coord, e) => {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint].q;
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setQuadraticCoords(coords);
  }


  setCubicPosition = (coord, anchor, e) => {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint].c[anchor];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setCubicCoords(coords, anchor);
  }

  removeActivePoint = (e) => {
    const cstate = this.bestCopyEver(this.state);
    const points = cstate.points;
    const active = cstate.activePoint;

    if (points.length > 1 && active !== 0) {
      points.splice(active, 1);

      this.setState({
        points,
        activePoint: points.length - 1
      });
    }
  }

  reset = (e) => {
    const cstate = this.bestCopyEver(this.state);
    const w = cstate.w;
    const h = cstate.h;

    this.setState({
      points: [{ x: w / 2, y: h / 2 }],
      activePoint: 0
    });
  }

  setTextInputs = () => {
    console.log(this.state.w);
    document.querySelector('#Width').value = this.state.w;
  }

  render = (props) => {
    const { w, h, points, activePoint, grid } = props.state;
    const active = points[activePoint];
    const step = grid.snap ? grid.size : 1;

    let params = [];

    if (active.q) {
      // console.log(`Hello World!`);
    } else if (active.c) {
      // console.log(`Hello World!`);
    } else if (active.a) {
      // console.log(`Hello World!`);

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
    
    return `
    <div id="controls" class="ad-Container-controls">
        <div class="ad-Controls">
            <h3 class="ad-Controls-title">Parameters</h3>
            
            <div class="ad-Controls-container">
              ${Control({
                name:'Width',
                type:'text',
                value: w,
                // onChange={ (e) => props.setWidth(e) } />
              })}
              ${Control({
                name:'Height',
                type:'text',
                value: h,
                // onChange={ (e) => props.setHeight(e) } />
              })}
            </div>
            <div class="ad-Controls-container">
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
            <div class="ad-Controls-container">
              ${Control({
                type: 'button',
                action: 'reset',
                value: 'Reset path'
                // onClick={ (e) => props.reset(e) } />
              })}
            </div>
                    
            <h3 class="ad-Controls-title">Selected point</h3>
                        
            <div class="ad-Controls-container">
              ${Control({
                name:'Point type',
                type:'choices',
                id:'pointType',
                choices:[
                    { name: 'L', value: 'l', checked: (!active.q && !active.c && !active.a)},
                    { name: 'Q', value: 'q', checked: !active.q },
                    { name: 'C', value: 'c', checked: !active.c },
                    { name: 'A', value: 'a', checked: !active.a }
                ]
                // onChange:{ (e) => props.setPointType(e) } 
              })}
            </div>
            
            ${ params }
            
            <div className="ad-Controls-container">
              ${Control({
                type:'button',
                action:'delete',
                value:'Remove this point',
                // onClick={ (e) => props.removeActivePoint(e) } />
              })}
            </div>
        </div>
      </div>
    `;
  }



}
// export { Controls, addControlListeners };


Controls.Render = (props) => {

};
