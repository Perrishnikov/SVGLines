//@ts-check
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
  //TODO: What do these fucntions do? They are disabled now...
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
}


// Controls stuff
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
      // control = Button(rest);
      console.error(`moved to Controls.wrappers.js`);
      
      break;
    case 'choices':
      control = Choices(rest);
      break;
    case 'taglist':
      console.error(`moved to CG.LineTags.js`);
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
  // console.log(props.value);
  // console.trace();
  //   const c = document.createElement('code');
  //   const v = document.createTextNode(props.value);
  //   c.appendChild(v);
  //   console.log(c);
  // return c.textContent;

  return String.raw `<code>${props.value}</code>`;
}


function Choices(props) {
  let choices = props.choices.map(c => {
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


//TAGS





// function LineIdComponent(id) {
//   let { value = '*' } = id;

//   return `
//     <div class="control-row">
//       <div data-tag="" data-value="" class="">
//         <div id="lineId" class="" contenteditable="true" >${value}</div>
//       </div>
//     </div>
//   `;
// }

/**
 * 
 * param {import('./Editor').State} props
 */
// function ReturnTags(props) {
//   /**type State["Tags"] */
//   const { tags = [] } = props;
//   let label = '';

//   const mappedTags = tags.map(tag => {
//     return `
//       <div data-tag="${tag}" data-value="true" class="line-tag">
//         <span class="" style="line-height:24px">${tag}</span>
//         <span role="button">${Icon_Delete(tag)}</span>
//       </div>
//     `;
//   }).join('');

//   return `
//     <div class="control">

//       <div class="tag-row">
//         <div data-tag="" data-value="true" class="">
//           <div id="newTagText" data-value="add tag" class="" contenteditable="true" ></div>
//         </div>
//         ${mappedTags}
//       </div>
//       <div id="tagConfirmDelete" class="tag-row">
//         <label class="controls_label">Confirm Delete${Icon_ThumbsUp('confirm-yes')} ${Icon_ThumbsDown('confirm-no')}</label>
//       </div>
      
//     </div>
//     `;
// }

export { Point, Quadratic, Cubic, Grid, Control, Range, Checkbox, Button, Choices };
