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


function Controls(props) {
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

  return `
        <div class="ad-Controls">
            <h3 class="ad-Controls-title">Parameters</h3>
            
            <div class="ad-Controls-container">
              ${Control({
                name:'Width',
                type:'text',
                value: props.w,
                // onChange={ (e) => props.setWidth(e) } />
              })}
              ${Control({
                name:'Height',
                type:'text',
                value: props.h,
                // onChange={ (e) => props.setHeight(e) } />
              })}
            </div>
            <div class="ad-Controls-container">
              ${Control({
                name:'Grid size',
                type:'text',
                value: props.grid.size
                // onChange={ (e) => props.setGridSize(e) }
              })}
              ${Control({
                name:'Snap grid',
                type:'checkbox',
                checked: props.grid.snap,
                // onChange={ (e) => props.setGridSnap(e) } />
              })}
              ${Control({
                name:'Show grid',
                type:'checkbox',
                checked: props.grid.show
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
    `;
}

function Control(props) {
  const { name, type, ...rest } = props;

  let control = '';
  let label = '';

  switch (type) {
    // case 'range': control = <Range { ..._props } />;
    case 'range':
      control = Range(rest);
      break;
    case 'text':
      control = Text(rest);
      break;
    case 'checkbox':
      control = Checkbox(rest);
      break;
    case 'button':
      control = Button(rest);
      break;
    case 'choices':
      control = Choices(rest);
      break;
  }

  if (name) {
    label =
      `<label class="ad-Control-label">${ name }</label>`;
  }

  return `
      <div class="ad-Control">
        ${ label }
        ${ control }
      </div>`;
}

function Choices(props) {
  let choices = props.choices.map((c, i) => {
    return `
          <label class="ad-Choice">
            <input
              class="ad-Choice-input"
              type="radio"
              value=${ c.value }
              checked=${ c.checked }
              name=${ props.id }
              onChange="props.onChange"
              />
            <div className="ad-Choice-fake">
              ${ c.name }
            </div>
          </label>
        `;
  }).join('');

  return `
      <div class="ad-Choices">
        ${ choices }
      </div>
    `;
}

function Button(props) {
  //TODO: onCLick needs to change
  return `
      <button
        class="ad-Button${(props.action ? ' ad-Button--' + props.action : '')}"
        type="button"
        onClick="props.onClick">
        ${ props.value }
      </button>
    `;
}

function Checkbox(props) {
  return `
    <label class="ad-Checkbox">
    <input
      class="ad-Checkbox-input"
      type="checkbox"
      onChange=" props.onChange "
      ${props.checked ? 'checked': ''} />
      <div class="ad-Checkbox-fake"></div>
    </label>
  `;
}

function Text(props) {
  return `
      <input
        class="ad-Text"
        type="text"
        value=${ props.value }
      />
    `;
}

function Range(props) {
  // onChange={ props.onChange } />
  return `
    <div class="ad-Range">
      <input
        class="ad-Range-input"
        type="range"
        min=${ props.min }
        max=${ props.max }
        step=${ props.step }
        value=${ props.value }
        />
      <input
        class="ad-Range-text ad-Text"
        type="text"
        value=${ props.value }
        />
    </div>
    `;
}


export { Controls };


Controls.ControlsRender = (props) => {

};
