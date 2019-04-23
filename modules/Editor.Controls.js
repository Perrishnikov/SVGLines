/** Controls ***************************/
// export default class Controls {
  function renderControls() {

    // Editor.ControlsRender({
    //   state: this.bestCopyEver(this.state), // Cloned
    //   removeActivePoint: this.removeActivePoint,
    // });
  }

  function setHeight(e) {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ h: v });
  }

  function setWidth(e) {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ w: v });
  }

  function setPointType(e) {
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

  function setArcParam(param, e) {
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

  function setPointPosition(coord, e) {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setPointCoords(coords);
  }


  function setQuadraticPosition(coord, e) {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint].q;
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setQuadraticCoords(coords);
  }


  function setCubicPosition(coord, anchor, e) {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint].c[anchor];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setCubicCoords(coords, anchor);
  }

  function removeActivePoint(e) {
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

  function reset(e) {
    const cstate = this.bestCopyEver(this.state);
    const w = cstate.w;
    const h = cstate.h;

    this.setState({
      points: [{ x: w / 2, y: h / 2 }],
      activePoint: 0
    });
  }

  
  function Controls (props){
    const active = props.points[props.activePoint];
    const step = props.grid.snap ? props.grid.size : 1;
    console.log(props);
    let params = [];
    
    if (active.q) {
        console.log(`Hello World!`);
    } else if (active.c) {
      console.log(`Hello World!`);
    } else if (active.a) {
      console.log(`Hello World!`);
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
      `Hello`
        // <div className="ad-Controls">
        //     <h3 className="ad-Controls-title">
        //         Parameters
        //     </h3>
            
        //     <div className="ad-Controls-container">
        //         <Control
        //             name="Width"
        //             type="text"
        //             value={ props.w }
        //             onChange={ (e) => props.setWidth(e) } />
        //         <Control
        //             name="Height"
        //             type="text"
        //             value={ props.h }
        //             onChange={ (e) => props.setHeight(e) } />
        //         <Control
        //             name="Close path"
        //             type="checkbox"
        //             value={ props.closePath }
        //             onChange={ (e) => props.setClosePath(e) } />
        //     </div>
        //     <div className="ad-Controls-container">
        //         <Control
        //             name="Grid size"
        //             type="text"
        //             value={ props.grid.size }
        //             onChange={ (e) => props.setGridSize(e) } />
        //         <Control
        //             name="Snap grid"
        //             type="checkbox"
        //             checked={ props.grid.snap }
        //             onChange={ (e) => props.setGridSnap(e) } />
        //         <Control
        //             name="Show grid"
        //             type="checkbox"
        //             checked={ props.grid.show }
        //             onChange={ (e) => props.setGridShow(e) } />
        //     </div>
        //     <div className="ad-Controls-container">
        //         <Control
        //             type="button"
        //             action="reset"
        //             value="Reset path"
        //             onClick={ (e) => props.reset(e) } />
        //     </div>
                    
        //     <h3 className="ad-Controls-title">
        //         Selected point
        //     </h3>
            
        //     { props.activePoint !== 0 && (
        //         <div className="ad-Controls-container">
        //             <Control
        //                 name="Point type"
        //                 type="choices"
        //                 id="pointType"
        //                 choices={[
        //                     { name: "L", value: "l", checked: (!active.q && !active.c && !active.a) },
        //                     { name: "Q", value: "q", checked: !!active.q },
        //                     { name: "C", value: "c", checked: !!active.c },
        //                     { name: "A", value: "a", checked: !!active.a }
        //                 ]}
        //                 onChange={ (e) => props.setPointType(e) } />
        //         </div>
        //     )}
            
        //     { params }
            
        //     { props.activePoint !== 0 && (
        //         <div className="ad-Controls-container">
        //             <Control
        //                 type="button"
        //                 action="delete"
        //                 value="Remove this point"
        //                 onClick={ (e) => props.removeActivePoint(e) } />
        //         </div>
        //     )}
        // </div>
    )
}

// function Control(props) {
//     const {
//         name,
//         type,
//         ..._props
//     } = props

//     let control = "", label = ""

//     switch (type) {
//         case "range": control = <Range { ..._props } />
//         break
//         case "text": control = <Text { ..._props } />
//         break
//         case "checkbox": control = <Checkbox { ..._props } />
//         break
//         case "button": control = <Button { ..._props } />
//         break
//         case "choices": control = <Choices { ..._props } />
//         break
//     }

//     if (name) {
//         label = (
//             <label className="ad-Control-label">
//                 { name }
//             </label>
//         )
//     }

//     return (
//         <div className="ad-Control">
//             { label }
//             { control }
//         </div>
//     )
// }

// function Choices(props) {
//     let choices = props.choices.map((c, i) => {
//         return (
//             <label className="ad-Choice">
//                 <input
//                     className="ad-Choice-input"
//                     type="radio"
//                     value={ c.value }
//                     checked={ c.checked }
//                     name={ props.id }
//                     onChange={ props.onChange } />
//                 <div className="ad-Choice-fake">
//                     { c.name }
//                 </div>
//             </label>
//         )
//     })
    
//     return (
//         <div className="ad-Choices">
//             { choices }
//         </div>
//     )
// }

// function Button(props) {    
//     return (
//         <button
//             className={
//                 "ad-Button" +
//                 (props.action ? "  ad-Button--" + props.action : "")
//             }
//             type="button"
//             onClick={ props.onClick }>
//             { props.value }
//         </button>
//     )
// }

// function Checkbox(props) {    
//     return (
//         <label className="ad-Checkbox">
//             <input
//                 className="ad-Checkbox-input"
//                 type="checkbox"
//                 onChange={ props.onChange }
//                 checked={ props.checked } />
//             <div className="ad-Checkbox-fake" />
//         </label>
//     )
// }

// function Text(props) {
//     return (
//         <input
//             className="ad-Text"
//             type="text"
//             value={ props.value }
//             onChange={ props.onChange } />
//     )
// }

//  function Range(props) {    
//     return (
//         <div className="ad-Range">
//             <input
//                 className="ad-Range-input"
//                 type="range"
//                 min={ props.min }
//                 max={ props.max }
//                 step={ props.step }
//                 value={ props.value }
//                 onChange={ props.onChange } />
//             <input
//                 className="ad-Range-text  ad-Text"
//                 type="text"
//                 value={ props.value }
//                 onChange={ props.onChange } />
//         </div>
//     )
// }


export {Controls};


Controls.ControlsRender = (props) => {

};