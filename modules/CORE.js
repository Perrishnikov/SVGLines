//@ts-check

/**
 * @typedef {0 | 1 } Anchor
 * @typedef {import('./Editor').default} Editor
 * @typedef {{x:number,y:number}} Coords
 * @typedef {MouseEvent} E 
 * @typedef {'l'|'q'|'c'|'a'} PointType
 */
export class CORE {
  /**
   * @param {Editor} editor
   */
  constructor(editor) {
    this.setState = editor.setState;
    this.getState = editor.getState;
    this.mainId = ''; //assigned in Editor.js in constructor
  }

  /**
   * Called from LineEditor handleMouseMove
   * calls setState()
   * @param {Coords} coords
   */
  setPointCoords = (coords) => {
    const { activePointIndex, lines, activeLineIndex } = this.getState();

    lines[activeLineIndex].points[activePointIndex].x = coords.x;
    lines[activeLineIndex].points[activePointIndex].y = coords.y;

    this.setState({ lines });
  }


  /**
   * Called from handleMouseMove
   * calls setState()
   * @param {Coords} coords
   * @param {Anchor} anchor
   */
  setCubicCoords = (coords, anchor) => {
    // console.log('setCubicCoords');
    const { activePointIndex, lines, activeLineIndex } = this.getState();

    //Is normally false, but set to 0|1 depending on the active anchor
    if (typeof anchor === 'string') {

      lines[activeLineIndex].points[activePointIndex].c[anchor].x = coords.x;
      lines[activeLineIndex].points[activePointIndex].c[anchor].y = coords.y;

      this.setState({ lines });
    }
  }


  /**
   * Called from handleMouseMove
   * calls setState()
   * @param {Coords} coords
   */
  setQuadraticCoords = (coords) => {
    const { activePointIndex, lines, activeLineIndex } = this.getState();

    lines[activeLineIndex].points[activePointIndex].q.x = coords.x;
    lines[activeLineIndex].points[activePointIndex].q.y = coords.y;

    this.setState({ lines });
  }


  /**
   * Get the mouse position
   * If null is passed as 'e' return position 100 x 100
   * @param {E} e 
   * @returns {Coords}
   */
  getMouseCoords = (e) => {
    const { grid } = this.getState();
    const rect = document.querySelector(`#${this.mainId}`);
    const top = rect.getBoundingClientRect().top;

    if (e) {
      let x = e.pageX;
      let y = e.clientY - top;

      if (grid.snap) {
        x = grid.size * Math.round(x / grid.size);
        y = grid.size * Math.round(y / grid.size);
      }

      // console.log(`x:${x}, y:${y}`);
      return { x, y };
    } else {
      return { x: 100, y: 100 };
    }
  }


  /**
   * Pass in a line's points. Returns the path
   * @param {object} points
   * @returns {string} - a single path
   */
  generatePath = (points) => {
    // let { points, closePath } = props;
    let d = '';

    points.forEach((p, i) => {
      if (i === 0) {
        // first point
        d += 'M ';
      } else if (p.q) {
        // quadratic
        d += `Q ${ p.q.x } ${ p.q.y } `;
      } else if (p.c) {
        // cubic
        d += `C ${ p.c[0].x } ${ p.c[0].y } ${ p.c[1].x } ${ p.c[1].y } `;
      } else if (p.a) {
        // arc
        d += `A ${ p.a.rx } ${ p.a.ry } ${ p.a.rot } ${ p.a.laf } ${ p.a.sf } `;
      } else {
        d += 'L ';
      }

      d += `${ p.x } ${ p.y } `;
    });

    // if (closePath) { d += 'Z'; }

    return d;
  }

  /**
   * passed to Editor.Main
   * @param {E} e 
   */
  handleMousemove = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    const { ctrl, shift, draggedCubic, draggedQuadratic, draggedPoint } = this.getState();

    //TESTING -> shows mouse coords
    // const { grid } = this.getState();
    // const rect = document.querySelector(`#{this.mainId}`); //TODO: side effect :()
    // const top = rect.getBoundingClientRect().top;
    // // const x = e.clientX + rect.scrollLeft;
    // const x = e.pageX;
    // const y = e.clientY - top;
    // const rx = grid.size * Math.round(x / grid.size);
    // const ry = grid.size * Math.round(y / grid.size);

    // document.querySelector('#coords').innerText = `
    // Screen X/Y: ${e.screenX}, ${e.screenY}
    // Client X/Y: ${e.clientX}, ${e.clientY}
    // Page X/Y: ${e.pageX}, ${e.pageY}
    // X/Y: ${x}, ${y}
    // rounded: ${rx}, ${ry}
    // top:${top}! scrollLeft:${rect.scrollLeft}!`;

    if (!ctrl && !shift) {
      if (draggedPoint) {
        // console.log(`setPoint`);
        this.setPointCoords(this.getMouseCoords(e));

      } else if (draggedQuadratic) {
        // console.log(`setQuad`);
        this.setQuadraticCoords(this.getMouseCoords(e));

      } else if (draggedCubic !== false) {
        // console.log(`setCubic: ${draggedCubic}`);
        this.setCubicCoords(this.getMouseCoords(e), draggedCubic);
      }
    }
  }


  /** From Editor.Main ------------------------------- */

  Quadratic(props) {
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

  Cubic(props) {
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
  Point(props) {
    const { index, x, y, rad = 4 } = props;
    //onMouseDown = { (e) => props.setDraggedPoint(props.index) }
    return `
      <circle class="ad-Point" data-index="${index}" cx="${x}" cy="${y}" r="${rad}"/>
    `;
  }


  handleMousedown = (e) => {
    // console.log('handleMousedown');
    e.preventDefault();

    /**@type {string[]} */
    const classList = [...e.target.classList];
    /**@type {string} */
    const index = e.target.dataset.index; //point index value

    console.log(classList);

    if (classList.includes('ad-Anchor-point')) {
      //if the target has an anchor, it is Cubic
      const anchor = e.target.dataset.anchor ? e.target.dataset.anchor : null;

      // console.log(`index: ${index}, anchor: ${anchor}`);

      if (anchor) {
        /** for Cubic - props = index, anchor */
        const lineindex = e.target.parentElement.parentElement.parentElement.dataset.lineindex;

        this.setDraggedCubic(index, anchor, lineindex);
      } else {
        /** for Quadratic - props = index */
        const lineindex = e.target.parentElement.parentElement.parentElement.dataset.lineindex;

        this.setDraggedQuadratic(index, lineindex);
      }
    } /** This is a regular Point */
    else if (classList.includes('ad-Point')) {
      // console.log('ad-Point classList');
      const lineindex = e.target.parentElement.parentElement.dataset.lineindex;
      // console.log(`lineindex: ${lineindex}`);

      this.setDraggedPoint(index, lineindex);
    } else if (classList.includes('ad-SVG')) {
      //This is the canvas area
      /** Add the AddPoint Event */
      // console.log(`this.state.ctrl:${this.getState().ctrl}, true:${true}, equal:${this.getState().ctrl == true}`);
      // console.log(`this.state.shift:${this.getState().shift}, true:${true}, equal:${this.getState().shift == true}`);

      if (this.getState().ctrl && !this.getState().shift) {
        this.addPoint(e);
      } else if (this.getState().ctrl && this.getState().shift) {
        console.log(`addLine`);
        this.addLine(e);
      }

    } else {
      console.log(`There might be an error here`);
    }
  };


  handleKeyDown = (e) => {
    // console.log(`Editor handleKeyDown: ${e.key}`);

    if (e.key === 'Alt' || e.key === 'Meta') {
      // console.log('meta or alt');
      this.setState({ ctrl: true });
    }
    if (e.key === 'Shift') {
      // console.log('shift');
      this.setState({ shift: true });
    }

    //If Enter is pressed in the Add Tag Div CONTROLS -> LINES
    // if (e.key === 'Enter' && document.activeElement.id === 'newTagText') {
    //   // handle the Add Tag
    //   console.log('Enter');
    //   // this.controls.handleAddTag(e.target);
    // }

    //If Enter is pressed in the LineId Div CONTROLS -> LINE
    // if (e.key === 'Enter' && document.activeElement.id === 'lineId') {
    //   // handle the Add Tag
    //   this.controls.handleLineIdUpdate(e.target);
    // }

  }


  handleKeyUp = () => {
    // console.log(`handleKeyUp`);
    if (this.getState().ctrl === true) {
      this.setState({ ctrl: false });
    }
    if (this.getState().shift === true) {
      this.setState({ shift: false });
    }
  }


  // EVENTS CALLED BY LISTENERS
  cancelDragging = () => {
    // console.log(`cancelDragging`);
    let { draggedPoint, draggedQuadratic, draggedCubic } = this.getState();

    if (draggedPoint || draggedQuadratic || draggedCubic) {
      this.setState({
        draggedPoint: false,
        draggedQuadratic: false,
        draggedCubic: false
      });
    }

  }


  /**
   * Called from mousedown event
   * @param {string} index 
   * @param {string} lineindex
   */
  setDraggedPoint = (index, lineindex) => {
    // console.log(`draggedPoint`);
    if (!this.getState().ctrl) {
      this.setState({
        activeLineIndex: parseInt(lineindex),
        activePointIndex: parseInt(index),
        draggedPoint: true
      });
    }
  }

  /**
   * Called from mousedown event
   * Sets the active point to this
   * @param {string} index 
   * @param {string} lineindex
   */
  setDraggedQuadratic = (index, lineindex) => {
    // console.log(`setDraggedQuadratic`);
    if (!this.getState().ctrl) {
      this.setState({
        activeLineIndex: parseInt(lineindex),
        activePointIndex: parseInt(index),
        draggedQuadratic: true
      });
    }
  }

  /**
   * Called from mousedown event
   * Sets the active point to this, and draggedCubic to the anchor
   * calls setState
   * @param {Anchor} anchor
   * @param {string} index
   */
  setDraggedCubic = (index, anchor, lineindex) => {
    // console.log(`setDraggedCubic`);
    if (!this.getState().ctrl) {
      this.setState({
        activeLineIndex: parseInt(lineindex),
        activePointIndex: parseInt(index),
        draggedCubic: anchor
      });
    }
  }


  /**
   * Called from mousedown event
   * calls setState
   * @param {MouseEvent} e
   * @param {string} id
   */
  addLine = (e, id) => {
    const coords = this.getMouseCoords(e);
    let { lines, activeLineIndex } = this.getState();

    // const newLine = new Line();

    const newPoints = { points: [coords], tags: [] };
    lines.push(newPoints);

    this.setState({
      lines,
      activePointIndex: 0, //first point
      activeLineIndex: lines.length - 1 // on new line
    });
  }


  /**
   * Adds a Point to active Line
   * calls setState
   * 
   * @param {MouseEvent | null} e
   */
  addPoint = (e) => {
    const coords = this.getMouseCoords(e);

    // console.log(`addPoint at x:${coords.x}, y:${coords.y}`);
    const { lines, activeLineIndex } = this.getState();
    lines[activeLineIndex].points.push(coords);

    this.setState({
      lines,
      //points
      activePointIndex: lines[activeLineIndex].points.length - 1
    });
  }


  removeActivePoint = () => {
    const { activePointIndex, lines, activeLineIndex } = this.getState();

    // if there are more than 1 Points && not last point...
    if (lines[activeLineIndex].points.length > 1 && activePointIndex !== 0) {
      lines[activeLineIndex].points.splice(activePointIndex, 1);
      const newIndex = lines[activeLineIndex].points.length - 1;

      this.setState({
        lines,
        activePointIndex: newIndex
      });
      console.log(`Point removed`);
    }
    // else, if this is the last point, remove Line
    else if (lines[activeLineIndex].points.length === 1) {

      this.removeActiveLine();
    }
  }


  removeActiveLine = () => {
    const { lines, activeLineIndex } = this.getState();

    lines.splice(activeLineIndex, 1);
    const newActiveLineIndex = 0;
    const newIndex = lines[newActiveLineIndex].points.length - 1;

    this.setState({
      activeLineIndex: newActiveLineIndex, //reset this to 0 TODO: make sure there is another Line
      lines,
      activePointIndex: newIndex
    });
  }


  /**
   * Pass in a line's points. Returns the path
   * @param {object} points
   * @param {string} ap
   * @returns {string} - a single path
   * @memberof Main
   */
  generateCircles = (points, ap, al) => {

    return points.map((p, i, a) => {
      let anchors = [];

      if (p.q) {
        anchors.push(
          this.Quadratic({
            index: i,
            p1x: a[i - 1].x,
            p1y: a[i - 1].y,
            p2x: p.x,
            p2y: p.y,
            x: p.q.x,
            y: p.q.y,
          })
        );
      } else if (p.c) {
        anchors.push(
          this.Cubic({
            index: i,
            p1x: a[i - 1].x,
            p1y: a[i - 1].y,
            p2x: p.x,
            p2y: p.y,
            x1: p.c[0].x,
            y1: p.c[0].y,
            x2: p.c[1].x,
            y2: p.c[1].y,
          })
        );
      }

      const isFirst = i === 0 ? ' ad-PointGroup--first' : '';
      const ap2 = ap == i && al == true ? ' is-active' : '';

      return (
        `<g class="ad-PointGroup${isFirst}${ap2}">
          ${this.Point({
            index:i,
            x:p.x,
            y:p.y,
            rad: 8,
          })}
          ${anchors}
      </g>`
      );
    }).join('');

  }

  /** End Editor.Main ------------------------------------ */

  /** From Editor.Controls-------------------------------- */
  /**
   *
   * @param {String} value - "l"|"q"|'c'|'a'
   * @memberof CORE
   */
  setPointType = (value) => {
    const { lines, activePointIndex, activeLineIndex } = this.getState();
    const ap = lines[activeLineIndex];

    // not the first point
    if (activePointIndex !== 0) {
      // let v = e.target.value;
      let v = value;

      switch (v) {
        case 'l':
          ap.points[activePointIndex] = {
            x: ap.points[activePointIndex].x,
            y: ap.points[activePointIndex].y
          };
          break;
        case 'q':
          ap.points[activePointIndex] = {
            x: ap.points[activePointIndex].x,
            y: ap.points[activePointIndex].y,
            q: {
              x: (ap.points[activePointIndex].x + ap.points[activePointIndex - 1].x) / 2,
              y: (ap.points[activePointIndex].y + ap.points[activePointIndex - 1].y) / 2
            }
          };
          break;
        case 'c':
          ap.points[activePointIndex] = {
            x: ap.points[activePointIndex].x,
            y: ap.points[activePointIndex].y,
            c: [{
                x: (ap.points[activePointIndex].x + ap.points[activePointIndex - 1].x - 50) / 2,
                y: (ap.points[activePointIndex].y + ap.points[activePointIndex - 1].y) / 2
              },
              {
                x: (ap.points[activePointIndex].x + ap.points[activePointIndex - 1].x + 50) / 2,
                y: (ap.points[activePointIndex].y + ap.points[activePointIndex - 1].y) / 2
              }
            ]
          };
          break;
        case 'a':
          ap.points[activePointIndex] = {
            x: ap.points[activePointIndex].x,
            y: ap.points[activePointIndex].y,
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
    const { lines, activePointIndex, activeLineIndex } = this.getState();
    const ap = lines[activeLineIndex];

    let v;

    if (['laf', 'sf'].indexOf(param) > -1) {
      v = e.target.checked ? 1 : 0;
    } else {
      v = this.positiveNumber(e.target.value);
    }

    ap.points[activePointIndex].a[param] = v;

    this.setState({ lines });
  }


  /** Not used - why/*/
  setPointPosition = (coord, e) => {
    const { lines, activePointIndex, activeLineIndex, w, h } = this.getState();
    const ap = lines[activeLineIndex];

    // const cstate = this.getState();

    const coords = ap.points[activePointIndex];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > w) v = w;
    if (coord === 'y' && v > h) v = h;

    coords[coord] = v;

    this.setPointCoords(coords);
  }


  setQuadraticPosition = (coord, e) => {
    const { lines, activePointIndex, activeLineIndex, w, h } = this.getState();
    const ap = lines[activeLineIndex];
    // const cstate = this.getState();

    const coords = ap.points[activePointIndex].q;
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > w) v = w;
    if (coord === 'y' && v > h) v = h;

    coords[coord] = v;

    this.setQuadraticCoords(coords);
  }

  /**
   * @param {Coords} coords
   * @param {Anchor} anchor
   * @param {E} e
   */
  setCubicPosition = (coords, anchor, e) => {
    const { lines, activePointIndex, activeLineIndex, w, h } = this.getState();
    const activeLine = lines[activeLineIndex];
    // let newCoords = coords;

    // {x: y:}
    const coord = activeLine.points[activePointIndex].c[anchor];
    let v = this.positiveNumber(e.target.value);
    console.log(`v: ${v}`);
    if (coords.x && v > w) v = w;
    if (coords.y && v > h) v = h;
    console.log(`v: ${v}`);

    coord[coords] = v;
    console.dir(`coords: ${coord}`);
    console.log(coord);
    this.setCubicCoords(coord, anchor);
  }


  reset = () => {
    const cstate = this.getState();
    const w = cstate.w;
    const h = cstate.h;

    this.setState({
      points: [{ x: w / 2, y: h / 2 }],
      activePointIndex: 0
    });
  }

  /** End Editor.Controls---------------------------- */

  /** Utility - Used by several --------------------- */
  /**
   * Grid
   * Parse a string number
   * @param {string} n 
   * @returns {number}
   */
  positiveNumber(n) {
    let parsed = parseInt(n);

    if (isNaN(parsed) || parsed < 0) { parsed = 0; }

    return parsed;
  }
}


/**
 * @typedef {object} line
 * @property {Array<{x:number,y:number, q?:{x:number,y:number}, c?:Array<{x:number,y:number}, {x:number,y:number}>, a?:{rx:number,ry:number,rot:number,laf:number,sf: number}}>}line.points
 * @property {Array<string>} line.tags - array of strings
 * @property {string} line.id - unique id
 * @property {string} line.z - z-index for css
 */
export class Line {
  constructor() {
    /**@type {line["points"]} */
    this.points = [{ x: null, y: null }];
    /**@type {line["z"]} */
    this.z = null;
    /**@type {line["tags"]} */
    this.tags = [null];
    /**@type {line["id"]} */
    this.id = null;

  }

}
