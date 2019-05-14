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
          class="ad-Anchor-line"
          x1="${i * size }"
          y1="0"
          x2="${i * size }"
          y2="${h}"/>
        `;
  }

  for (let i = 1; i < (h / size); i++) {
    grid +=
      `<line
        class="ad-Anchor-line"
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
    label = `<label "class="ad-Control-label">${ name }</label>`;
  }

  return `
    <div class="ad-Control">
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
      class="ad-Text"
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
    <div class="ad-Choices">
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
  <label class="ad-Checkbox"></label>
  <input
    class="ad-Checkbox-input"
    type="checkbox"
    ${props.checked ? 'checked': ''} 
    />
    
    <div class="ad-Checkbox-fake"></div>
  
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


export { Point, Quadratic, Cubic, Grid, Control, Text, Range, Checkbox, Button, Choices };
