function Quadratic(props) {
  // circle onMouseDown="${(e) => props.setDraggedQuadratic(props.index)}"
  return `
  <g class="ad-Anchor">
    <line 
      class="ad-Anchor-line" 
      x1="${props.p1x}"
      y1="${props.p1y}"
      x2="${props.x}"
      y2="${props.y}"/>
    <line 
      class="ad-Anchor-line" 
      x1="${props.x}"
      y1="${props.y}"
      x2="${props.p2x}"
      y2="${props.p2y}"/>
    <circle 
      class="ad-Anchor-point"
      data-index="${props.index}"
      cx="${props.x}"
      cy="${props.y}"
      r="6"/>
  </g>
  `;
}

function Cubic(props) {
  //circle top <!--onMouseDown="{ (e) => props.setDraggedCubic(props.index, 0) }"-->
  //circle bottom <!--onMouseDown="{ (e) => props.setDraggedCubic(props.index, 1) }"-->
  return `
  <g class="ad-Anchor">
    <line
      class="ad-Anchor-line"
      x1="${props.p1x}"
      y1="${props.p1y}"
      x2="${props.x1}"
      y2="${props.y1}" />
    <line
      class="ad-Anchor-line"
      x1="${props.p2x}"
      y1="${props.p2y}"
      x2="${props.x2}"
      y2="${props.y2}" />
    <circle
      class="ad-Anchor-point"
      data-index="${props.index}"
      data-anchor="0"
      cx="${props.x1}"
      cy="${props.y1}"
      r="6"/>
    <circle
      class="ad-Anchor-point"
      data-index="${props.index}"
      data-anchor="1"
      cx="${props.x2}"
      cy="${props.y2}"
      r="6"/>
  </g>
  `;
}

/** Event needed  */
function Point(props) {
  const { index, x, y, rad = 4 } = props;
  //onMouseDown = { (e) => props.setDraggedPoint(props.index) }
  return `
    <circle class="ad-Point" data-index="${index}" cx="${x}" cy="${y}" r="${rad}"/>
  `;
}

function Grid(props) {
  // console.log(props);
  const { show, snap, size } = props.grid;
  const { h, w } = props;

  // let grid = [];
  let grid = '';

  for (let i = 1; i < (w / size); i++) {
    grid +=
      `<line
          class="grid_line"
          x1="${i * size }"
          y1="0"
          x2="${i * size }"
          y2="${h}"/>
        `;
  }

  for (let i = 1; i < (h / size); i++) {
    grid +=
      `<line
        class="grid_line"
        x1="0"
        y1="${i * size}"
        x2="${w}"
        y2="${i * size}"/>
      `;
    // grid.push(
    //     <line
    //         x1={ 0 }
    //         y1={ i * size }
    //         x2={ props.w }
    //         y2={ i * size } />
    // );
  }
  return `
    <g class="ad-Grid ${!show ? ' is-hidden"' : ''}">
      ${grid}
    </g>
  `;
  // return (
  //     <g className={
  //         "ad-Grid" +
  //         ( ! show ? "  is-hidden" : "")
  //     }>
  //         { grid }
  //     </g>
  // );
}


// Controls stuf
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
    label = `<label class="ad-Control-label controls_label">${ name }</label>`;
  }

  return `
    <div class="ad-Control control">
      ${ label }
      ${ control } 
    </div>`;
}

function Crap(name, props) {
  let input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('class', 'ad-Text');
  input.setAttribute('value', props.value)
  return input;
  // return `<div class="ad-Text">${props.value}</div>`;

}

function Text(props) {
  // console.log(props);
  // let t = document.createElement('input');
  // return t.innerHTML = `
  return `
    <div
      onblur="${props.onchange}"
      class="ad-Text controls_text"
      contenteditable="true">
      ${props.value}</div>`;
}

function Choices(props) {
  let choices = props.choices.map((c, i) => {
    return `
        <label class="ad-Choice">
          <input
            class="ad-Choice-input"
            type="radio"
            value=${ c.value }
            ${ c.checked ? 'checked' : ''}
            name=${ props.id }
            />
          <div class="ad-Choice-fake">
            ${ c.name }
          </div>
        </label>
      `;
  }).join('');

  return `
    <div class="ad-Choices flex_row">
      ${ choices }
    </div>
  `;
}

function Button(props) {
  // const h = props.onclick ? props.onclick : console.log(`jj`);
  //TODO: onCLick needs to change
  // console.log(props);
  return `
    <button
      class="ad-Button${(props.action ? ` ad-Button--${props.action}` : '')}"
      type="button">
      ${ props.value }
    </button>
  `;
}

function Checkbox(props) {
  // onChange=" props.onChange "
  // ${props.checked ? 'checked': ''} />
  return `
    <input
      class="ad-Checkbox-input"
      type="checkbox"
      ${props.checked ? 'checked': ''} 
      />
    <div class="ad-Checkbox-fake c_label"></div>
`;
}

function Range(props) {
  // onChange={ props.onChange } />
  return `
  <div class="ad-Range">
    <input
      class="ad-Range-input"
      type="range"
      min="${ props.min }"
      max="${ props.max }"
      step="${ props.step }"
      value="${ props.value }"
      />
    <input
      class="ad-Range-text ad-Text"
      type="text"
      value="${ props.value }"
      />
  </div>
  `;
}

function NavComponent(props) {
  let { icon, id, active = false } = props;
  let svg;

  if (active == true) {
    active = ' active_icon';
  } else {
    active = '';
  }

  switch (icon) {
    case 'settings':
      svg = Icon_Settings(active);
      break;
    case 'line':
      svg = Icon_Line(active);
      break;
    case 'help':
      svg = Icon_Help(active);
      break;
    case 'save':
      svg = Icon_Save(active);
  }

  return `
      <div id="${id}" class="nav_icon">
        ${svg}
      </div>
  `;
}

function Icon_Help(active) {
  return `
  <svg class="svg_icon${active}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>
  `;
}

function Icon_Line(active) {
  return `
  <svg class="svg_icon${active}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
  `;
}

function Icon_Save(active) {
  return `
  <svg class="svg_icon${active} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
  `;
}

function Icon_Settings(active) {
  return `
  <svg class="svg_icon${active}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  `;
}


export { Point, Quadratic, Cubic, Grid, Control, Text, Range, Checkbox, Button, Choices, NavComponent };
