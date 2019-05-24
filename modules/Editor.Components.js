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
  const { show, snap, size, numbers } = props.grid;
  const { h, w } = props;

  // let grid = [];
  let grid = '';
  let text = '';

  if (show) {
    for (let i = 1; i < (w / size); i++) {
      grid +=
        `<line
            class="grid_line"
            x1="${i * size }"
            y1="0"
            x2="${i * size }"
            y2="${h}"/>
          `;

      if (numbers) {
        text +=
          `<text x="${i*size}" y="10" class="small">${i*size}</text>`;
      }

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

      if (numbers) {
        text +=
          `<text x="10" y="${i*size}" class="small">${i*size}</text>`;
      }

    }


    // grid.push(
    //     <line
    //         x1={ 0 }
    //         y1={ i * size }
    //         x2={ props.w }
    //         y2={ i * size } />
    // );
  }
  return `
    <g class="grid ${!show ? ' is-hidden"' : ''}">
      ${grid}
      ${text}
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
    case 'EditableText':
      control = EditableText(rest);
      break;
    case 'StaticText':
      control = StaticText(rest);
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
    case 'taglist':
      control = TagList(rest);
      break;
    default:
      control = '<div style="background-color:red">Incorrect code</div>';
  }

  if (name) {
    label = `<label class="control-label">${ name }</label>`;
  }

  return `
    <div class="control">
      ${ label }
      ${ control } 
    </div>`;
}

function EditableText(props) {
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


function StaticText(props) {
  return `<code>${props.value}</code>`;
}


function Choices(props) {
  let choices = props.choices.map((c, i) => {
    return `
    <input data-action="setPointType" type="radio" name="${ props.id }" value="${ c.value }"
    ${ c.checked ? 'checked' : ''} id="" class="form-radio-points">
    <label class="choices-label" for="">${ c.name }</label>
    `;
  }).join('');
//   <label class="ad-Choice">
//   <input
//     class="ad-Choice-input"
//     type="radio"
//     value="${ c.value }
//     ${ c.checked ? 'checked' : ''}"
//     name="${ props.id }"
//     />
//   <div class="ad-Choice-fake">
//     ${ c.name }
//   </div>
// </label>
  return `
    <div class="flex_row">
      ${ choices }
    </div>
  `;
}

function Button(props) {
  // const h = props.onclick ? props.onclick : console.log(`jj`);
  //TODO: onCLick needs to change
  // console.log(props);
  return `
    <button data-action="${props.action}"
      class="control-button"
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

//TODO: Make this more dynamic from localState names
function NavComponent(props) {
  let { icon, id, active } = props;
  let svg;

  if (active == icon) {
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
    case 'lines':
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

//TAGS

function Icon_AddTag() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M3 3h18v18H3zM12 8v8m-4-4h8"/></svg>
  `;
}

function Icon_Delete(tag) {
  return `
  <svg data-tag="${tag}" class="svg_tag" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
  `;
}

function Icon_ThumbsUp(value) {
  return `
  <svg data-value="${value}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
  `;
}

function Icon_ThumbsDown(value) {
  return `
  <svg data-value="${value}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
  `;
}

function Icon_Check(tag) {
  return `
  <svg data-tag="${tag}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  `;
}

function ReturnTags(props) {
  const { name, tags = [] } = props;
  let label = '';

  if (name) {
    label = `<label class="ad-Control-label controls_label">${name}</label>`;
  }

  const mappedTags = tags.map((tag, i) => {
    return `
      <div class="line_tag">
        <span class="">${tag}</span>
        ${Icon_Delete(tag)}
      </div>
    `;
  }).join('');

  return `
    <div class="control">
      ${label}
      <div id="" class="tag_row">
        <label class="controls_label">Add Tag:</label>
        <div id="newTagText" class="text_input" contenteditable="true">
        newTag</div>
      </div>
      <div class="tag_row">
        ${mappedTags}
      </div>
      <div id="tagConfirmDelete" class="tag_row">
        <label class="controls_label">Confirm Delete${Icon_ThumbsUp('confirm-yes')} ${Icon_ThumbsDown('confirm-no')}</label>
      </div>
      
    </div>
    `;
}

function TagList(props) {
  // const allTags = props.tags ? props.tags : [];
  const { name, activeLine, tags = [] } = props;

  const mappedTags = tags.map((tag, i) => {
    //make sure that Active Line has Tags, if Line Tag matches App Tag...
    const active = activeLine.tags && activeLine.tags.includes(tag) ? true : false;

    return `
      <div data-tag="${tag}" data-value="${active}" class="line-tag">
        <span class="" style="line-height:24px">${tag}</span>
        <span role="button">${active ? Icon_Check(tag) : ''}</span>
      </div>
    `;
  }).join('');

  return `
    <div id="lineTags" class="tag-row">

        ${mappedTags}
    </div>
    `;
}

export { Point, Quadratic, Cubic, Grid, Control, Range, Checkbox, Button, Choices, NavComponent, ReturnTags, TagList };
