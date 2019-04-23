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
  const { x, y, rad = 4 } = props;
  //onMouseDown = { (e) => props.setDraggedPoint(props.index) }
  return `
    <circle class="ad-Point"  cx="${x}" cy="${y}" r="${rad}"/>
  `;
}

function Grid(props) {
  console.log(props);
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
          y2="${ h }"/>
        `;
  }

  for (let i = 1; i < (h / size); i++) {
    grid +=
      `<line
        class="ad-Anchor-line"
        x1="0"
        y1="${i * size}"
        x2="${w }"
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
    <g class="ad-Grid ${!show ? ' is-hidden"' : '"'}>
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

export { Point, Quadratic, Cubic, Grid };
