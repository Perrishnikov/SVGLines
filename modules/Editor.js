//@ts-check
// import store from './store/index.js'; //use store INSTANCE to get State

/**
 * @typedef {object} Editor.state
 * @typedef {HTMLBaseElement} Editor.id
 * @typedef {function} Editor.setState
 */
export default class Editor {
  /**
   * @constructor
   
   */
  constructor(element) {
    /** @param {HTMLElement} element */
    this.element = element;

    let { state, id } = props;

    let p = new Proxy(state, {
      set: (target, prop, value) => {
        console.log(target);
        console.log(prop);
        console.log(value);
        // console.log('write request to ' + prop + ' property with ' + value + ' value');
        return true;
      }
    });

    //this.state = p;
    this.state = state;
    this.id = id;
    this.setState = this.setState.bind(this); //change this to Editor if state moves outside
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.cancelDragging = this.cancelDragging.bind(this);
    this.generatePath = this.generatePath.bind(this);
    this.addPoint = this.addPoint.bind(this);
    /**@type setDraggedCubic */
    this.setDraggedCubic = this.setDraggedCubic.bind(this);
    this.setDraggedPoint = this.setDraggedPoint.bind(this);
    /**@type setDraggedQuadratic */
    this.setDraggedQuadratic = this.setDraggedQuadratic.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.setPointCoords = this.setPointCoords.bind(this);
    this.setCubicCoords = this.setCubicCoords.bind(this);
    this.setQuadraticCoords = this.setQuadraticCoords.bind(this);
    this.getMouseCoords = this.getMouseCoords.bind(this);

    /** controls */
    this.reset = this.reset.bind(this);
    this.removeActivePoint = this.removeActivePoint.bind(this);
    this.setPointPosition = this.setPointPosition.bind(this);
    this.setQuadraticPosition = this.setQuadraticPosition.bind(this);
    this.setCubicPosition = this.setCubicPosition.bind(this);
    this.setArcParam = this.setArcParam.bind(this);
    this.setPointType = this.setPointType.bind(this);
    this.setWidth = this.setWidth.bind(this);
    this.setHeight = this.setHeight.bind(this);

    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);
    document.addEventListener('mouseup', this.cancelDragging, false);

    document.addEventListener('mousedown', e => {
      //Quadrratic
      // console.log(`mousedown`);
      // console.dir(e.target);
      const classList = [...e.target.classList];
      // console.log(classList);


      if (classList.includes('ad-Anchor-point')) {
        //if the target has an anchor, it is Cubic
        const anchor = e.target.dataset.anchor ? e.target.dataset.anchor : null;
        const index = e.target.dataset.index;

        //if this is a Cubic Point, get the 'data-anchor attribute
        if (anchor) {
          /** for Cubic - props = index, anchor */
          this.setDraggedCubic(index, anchor);
        } else {
          /** for Quadratic - props = index */
          this.setDraggedPoint(index);
        }
      }

      //e.target.dataset.index
      // handleMouseMove(e);
      // addPoint(e);
    });

    document.addEventListener('click', e => {
      this.addPoint(e);
    });

  }

  
  /** 
   * setState for this Editor
   * @type Editor.setState
   * @param {object} obj
   * @returns void
   */
  setState(obj) {
    // console.log(`this.setState`);

    this.state = Object.assign(this.state, obj);
    // console.log(this.state);
    this.Render();
  }

  handleKeyDown(e) {
    if (e.key === 'Alt') this.setState({ ctrl: true });
    // console.log(state);
  }

  handleKeyUp(e) {
    this.setState({ ctrl: false });
  }

  cancelDragging(e) {
    this.setState({
      draggedPoint: false,
      draggedQuadratic: false,
      draggedCubic: false
    });
  }

  generatePath() {
    let { points, closePath } = this.state;

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

    if (closePath) d += 'Z';

    return d;
  }

  addPoint(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.ctrl) {
      console.log(`addPoint ok`);
      const coords = this.getMouseCoords(e);
      const { points } = this.bestCopyEver(this.state);
      console.log(points);
      points.push(coords);

      this.setState({
        points,
        activePoint: points.length - 1
      });
    }
  }

  /** Deep Copies this.state */
  bestCopyEver(src) {
    return Object.assign({}, src);
  }

  setDraggedPoint(index) {
    console.log(`draggedPoint`);

    if (!this.state.ctrl) {
      this.setState({
        activePoint: index,
        draggedPoint: true
      });
    }
  }

  /**
   * Sets the active point to this
   */
  setDraggedQuadratic(index) {
    console.log(`setDraggedQuadratic`);
    if (!this.state.ctrl) {
      this.setState({
        activePoint: index,
        draggedQuadratic: true
      });
    }
  }

  /**
   * Sets the active point to this, and draggedCubic to the anchor
   */
  setDraggedCubic(index, anchor) {
    if (!this.state.ctrl) {
      this.setState({
        activePoint: index,
        draggedCubic: anchor
      });
    }
  }

  setPointCoords(coords) {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;

    points[active].x = coords.x;
    points[active].y = coords.y;

    this.setState({ points });
  }

  setCubicCoords(coords, anchor) {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;

    points[active].c[anchor].x = coords.x;
    points[active].c[anchor].y = coords.y;

    this.setState({ points });
  }

  setQuadraticCoords(coords) {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;

    points[active].q.x = coords.x;
    points[active].q.y = coords.y;

    this.setState({ points });
  }

  getMouseCoords(e) {
    // const rect = ReactDOM.findDOMNode(this.refs.svg).getBoundingClientRect()
    const rect = this.id.getBoundingClientRect();
    // console.log(`e.pageX ${e.pageX}, rect.left ${rect.left}`);
    let x = Math.round(e.pageX - rect.left);
    let y = Math.round(e.pageY - rect.top);

    if (this.state.grid.snap) {
      x = this.state.grid.size * Math.round(x / this.state.grid.size);
      y = this.state.grid.size * Math.round(y / this.state.grid.size);
    }

    return { x, y };
  }


  handleMouseMove(e) {
    console.log(`mousemove`);
    if (!this.state.ctrl) {
      if (this.state.draggedPoint) {
        this.setPointCoords(this.getMouseCoords(e));
      } else if (this.state.draggedQuadratic) {
        this.setQuadraticCoords(this.getMouseCoords(e));
      } else if (this.state.draggedCubic !== false) {
        this.setCubicCoords(this.getMouseCoords(e), this.state.draggedCubic);
      }
    }
  }

  Render(props) {
    console.log(`renderSVG()`);
    //console.log(this.bestCopyEver(this.state));

    Editor.SVGRender({
      state: this.bestCopyEver(this.state), // Cloned
      id: this.id,
      path: this.generatePath(),
      addPoint: this.addPoint,
      setDraggedPoint: this.setDraggedPoint,
      setDraggedQuadratic: this.setDraggedQuadratic,
      setDraggedCubic: this.setDraggedCubic,
      handleMouseMove: this.handleMouseMove
    });
  }

  /** Controls ***************************/

  renderControls() {

    Editor.ControlsRender({
      state: this.bestCopyEver(this.state), // Cloned
      removeActivePoint: this.removeActivePoint,
    });
  }

  positiveNumber(n) {
    n = parseInt(n)
    if (isNaN(n) || n < 0) n = 0

    return n
  }
  setHeight(e) {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ h: v });
  }

  setWidth(e) {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ w: v });
  }

  setPointType(e) {
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

  setArcParam(param, e) {
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

  setPointPosition(coord, e) {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setPointCoords(coords);
  }


  setQuadraticPosition(coord, e) {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint].q;
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setQuadraticCoords(coords);
  }


  setCubicPosition(coord, anchor, e) {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint].c[anchor];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setCubicCoords(coords, anchor);
  }

  removeActivePoint(e) {
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

  reset(e) {
    const cstate = this.bestCopyEver(this.state);
    const w = cstate.w;
    const h = cstate.h;

    this.setState({
      points: [{ x: w / 2, y: h / 2 }],
      activePoint: 0
    });
  }



}

Editor.ControlsRender = (props) => {

};


/** Event needed  */
function Point(props) {
  const { x, y, rad = 4 } = props;
  //onMouseDown = { (e) => props.setDraggedPoint(props.index) }
  return `
    <circle class="ad-Point"  cx="${x}" cy="${y}" r="${rad}"/>
  `;
}

/** 
 * @param {object} props
 * @param {number} props.id
 * @param {string} props.path
 * @param {function} props.addPoint
 * @param {setDraggedCubic} props.setDraggedCubic
 * @param {setDraggedQuadratic} props.setDraggedQuadratic
 */
Editor.SVGRender = (props) => {
  const { id, path, addPoint, handleMouseMove, setDraggedPoint, setDraggedQuadratic, setDraggedCubic } = props;

  const { w, h, grid, points, activePoint } = props.state;

  const circles = points.map((p, i, a) => {
    let anchors = [];

    if (p.q) {
      anchors.push(
        Quadratic({
          index: i,
          p1x: a[i - 1].x,
          p1y: a[i - 1].y,
          p2x: p.x,
          p2y: p.y,
          x: p.q.x,
          y: p.q.y,
          // setDraggedQuadratic: setDraggedQuadratic
        })
      );
    } else if (p.c) {
      anchors.push(
        Cubic({
          index: i,
          p1x: a[i - 1].x,
          p1y: a[i - 1].y,
          p2x: p.x,
          p2y: p.y,
          x1: p.c[0].x,
          y1: p.c[0].y,
          x2: p.c[1].x,
          y2: p.c[1].y,
          // setDraggedCubic: setDraggedCubic
        })
      );
    }

    const isFirst = i === 0 ? ' ad-PointGroup--first' : '';
    const ap = activePoint === i ? ' is-active' : '';

    return (
      `<g class="ad-PointGroup${isFirst}${ap}">
          ${Point({
            index:i,
            x:p.x,
            y:p.y,
            rad: 16,
            // setDraggedPoint:setDraggedPoint
          })}
          ${anchors}
      </g>`
    );
  }).join('');


  id.innerHTML =
    `<svg class="ad-SVG" width="${w}" height="${h}">
      <path class="ad-Path" d="${path}"></path>
      <g class="ad-Points">
        ${circles}
      </g>
    </svg>`;

  // id.addEventListener('click', e => {
  //   addPoint(e);
  // });


  // id.addEventListener('mousedown', e => {
  //   //Quadrratic
  //   // console.log(`mousedown`);
  //   // console.dir(e.target);
  //   const classList = [...e.target.classList];
  //   // console.log(classList);


  //   if (classList.includes('ad-Anchor-point')) {
  //     //if the target has an anchor, it is Cubic
  //     const anchor = e.target.dataset.anchor ? e.target.dataset.anchor : null;
  //     const index = e.target.dataset.index;

  //     //if this is a Cubic Point, get the 'data-anchor attribute
  //     if (anchor) {
  //       /** for Cubic - props = index, anchor */
  //       setDraggedCubic(index, anchor);
  //     } else {
  //       /** for Quadratic - props = index */
  //       setDraggedPoint(index);
  //     }
  //   }

  //   //e.target.dataset.index
  //   // handleMouseMove(e);
  //   // addPoint(e);
  // });

  // id.addEventListener('click', e => {
  //   addPoint(e);
  // });

};

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
// Editor.setState = (obj) => {
//   console.log(obj);
//   // state = Object.assign({}, obj)
// }
