//@ts-check
// import store from './store/index.js'; //use store INSTANCE to get State
import { Controls } from './Editor.Controls.js';
import { Point, Quadratic, Cubic, Grid } from './Editor.Components.js';
/**
 * @typedef {object} Editor.state
 * @typedef {HTMLBaseElement} id
 * @typedef {function} Editor.setState
 * @typedef {{x:number,y:number}} coords
 * @typedef {0 | 1} anchor
 * @typedef {MouseEvent} e
 */
export default class Editor {
  /**
   * @constructor
   */
  constructor(props) {
    let { state, id } = props;

    this.state = state;
    /**@type {HTMLDivElement} */
    this.id = id;

    /** controls */
    // this.reset = this.reset.bind(this);
    // this.removeActivePoint = this.removeActivePoint.bind(this);
    // this.setPointPosition = this.setPointPosition.bind(this);
    // this.setQuadraticPosition = this.setQuadraticPosition.bind(this);
    // this.setCubicPosition = this.setCubicPosition.bind(this);
    // this.setArcParam = this.setArcParam.bind(this);
    // this.setPointType = this.setPointType.bind(this);
    // this.setWidth = this.setWidth.bind(this);
    // this.setHeight = this.setHeight.bind(this);

    document.addEventListener('keydown', this.handleKeyDown, false);
    document.addEventListener('keyup', this.handleKeyUp, false);
    document.addEventListener('mouseup', this.cancelDragging, false);

    document.addEventListener('mousedown', (e) => {
      /**@type {String[]} */
      const classList = [...e.target.classList];
      const index = e.target.dataset.index;

      if (classList.includes('ad-Anchor-point')) {
        //if the target has an anchor, it is Cubic
        const anchor = e.target.dataset.anchor ? e.target.dataset.anchor : null;

        if (anchor) {
          /** for Cubic - props = index, anchor */
          this.setDraggedCubic(index, anchor);
        } else {
          /** for Quadratic - props = index */
          this.setDraggedQuadratic(index);
        }
      } /** This is a regular Point */
      else if (classList.includes('ad-Point')) {
        this.setDraggedPoint(index);
      } else {
        /** Add the AddPoint Event */
        this.addPoint(e);
      }
    });

    document.addEventListener('mousemove', e => {
      this.handleMouseMove(e);
    });
  }

  // EVENTS CALLED BY LISTENERS
  /**
   *
   * @memberof Editor
   * @param {KeyboardEventInit} e
   */
  handleKeyDown = (e) => {
    if (e.key === 'Alt') {this.setState({ ctrl: true });}
    // console.log(state);
  }

  handleKeyUp = () => {
    this.setState({ ctrl: false });
  }

  cancelDragging = () => {
    this.setState({
      draggedPoint: false,
      draggedQuadratic: false,
      draggedCubic: false
    });
  }


  /** Deep Copies this.state */
  bestCopyEver = (src) => {
    return Object.assign({}, src);
  }

  /** 
   * setState for this Editor
   * @param {object} obj
   * @returns void
   */
  setState = (obj) => {
    // console.log(`this.setState`);

    this.state = Object.assign({}, this.state, obj);
    // console.log(this.state);
    this.render();
  }


  /**
   * Called from Class SVGRedner
   *
   * @memberof Editor
   */
  generatePath = () => {
    let { points, closePath } = this.bestCopyEver(this.state);
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

    if (closePath) { d += 'Z'; }

    return d;
  }

  /**
   * Callled from mousedown event
   * @memberof Editor
   * calls setState
   * @param {e} e
   * 
   */
  addPoint = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('addPoint');

    if (this.state.ctrl) {
      const coords = this.getMouseCoords(e);
      const { points } = this.bestCopyEver(this.state);
      // console.log(points);
      points.push(coords);

      this.setState({
        points,
        activePoint: points.length - 1
      });
    }
  }


  /**
   * Called from mousedown event
   * @param {number} index 
   */
  setDraggedPoint = (index) => {
    // console.log(`draggedPoint`);
    if (!this.state.ctrl) {
      this.setState({
        activePoint: index,
        draggedPoint: true
      });
    }
  }

  /**
   * Called from mousedown event
   * Sets the active point to this
   * @param {number} index 
   */
  setDraggedQuadratic = (index) => {
    // console.log(`setDraggedQuadratic`);
    if (!this.state.ctrl) {
      this.setState({
        activePoint: index,
        draggedQuadratic: true
      });
    }
  }

  /**
   * Called from mousedown event
   * Sets the active point to this, and draggedCubic to the anchor
   * calls setState
   * @param {anchor} anchor
   * @param {number} index
   */
  setDraggedCubic = (index, anchor) => {
    // console.log(`setDraggedCubic`);
    if (!this.state.ctrl) {
      this.setState({
        activePoint: index,
        draggedCubic: anchor
      });
    }
  }


  /**
   * Called from handleMouseMove
   * calls setState
   * @memberof Editor
   * @param {coords} coords
   */
  setPointCoords = (coords) => {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;

    points[active].x = coords.x;
    points[active].y = coords.y;

    this.setState({ points });
  }

  /**
   * Called from handleMouseMove
   * calls setState
   * @memberof Editor
   * @param {coords} coords
   * @param {anchor} anchor
   */
  setCubicCoords = (coords, anchor) => {
    const cstate = this.bestCopyEver(this.state);

    let points = cstate.points;
    let active = cstate.activePoint;

    points[active].c[anchor].x = coords.x;
    points[active].c[anchor].y = coords.y;

    this.setState({ points });
  }

  /**
   * Called from handleMouseMove
   * calls setState
   * @memberof Editor
   * @param {coords} coords
   */
  setQuadraticCoords = (coords) => {
    const cstate = this.bestCopyEver(this.state);

    let points = cstate.points;
    let active = cstate.activePoint;

    points[active].q.x = coords.x;
    points[active].q.y = coords.y;

    this.setState({ points });
  }


  /**
   * @param {e} e 
   * @returns {coords}
   */
  getMouseCoords = (e) => {
    // const rect = ReactDOM.findDOMNode(this.refs.svg).getBoundingClientRect()
    const rect = this.id.getBoundingClientRect();
    // console.log(rect);
    // console.log(`e.pageX ${e.pageX}, rect.left ${rect.left}`);
    let x = Math.round(e.pageX - rect.left);
    let y = Math.round(e.pageY - rect.top);

    if (this.state.grid.snap) {
      x = this.state.grid.size * Math.round(x / this.state.grid.size);
      y = this.state.grid.size * Math.round(y / this.state.grid.size);
    }

    return { x, y };
  }

  /**
   * @param {e} e 
   */
  handleMouseMove = (e) => {
    // console.log(`mousemove`);
    if (!this.state.ctrl) {
      if (this.state.draggedPoint) {

        this.setPointCoords(this.getMouseCoords(e));
      } else if (this.state.draggedQuadratic) {

        this.setQuadraticCoords(this.getMouseCoords(e));
      } else if (this.state.draggedCubic !== false) {

        this.setCubicCoords(
          this.getMouseCoords(e),
          this.state.draggedCubic
        );
      }
    }
  }


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


  /**
   * Grid
   * calls setState
   * @memberof Editor
   * @param {e} e
   */
  setGridSize = (e) => {
    let grid = this.state.grid;
    let v = this.positiveNumber(e.target.value);
    const min = 1;
    const max = Math.min(this.state.w, this.state.h);

    if (v < min) { v = min; }
    if (v >= max) { v = max / 2; }

    grid.size = v;

    this.setState({ grid });
  };


  /**
   * Grid
   * calls setState
   * @memberof Editor
   * @param {e} e
   */
  setGridSnap = (e) => {
    let grid = this.state.grid;
    grid.snap = e.target.checked;

    this.setState({ grid });
  };


  /**
   * Grid
   * calls setState
   * @memberof Editor
   * @param {e} e
   */
  setGridShow = (e) => {
    let grid = this.state.grid;
    grid.show = e.target.checked;

    this.setState({ grid });
  };


  /**
   * Calls Class SVGRender - sorta interface
   * @memberof Editor
   */
  render = () => {

    Editor.SVGRender({
      state: this.bestCopyEver(this.state), // Cloned
      id: this.id,
      path: this.generatePath(),
    });
  }
}


/** 
 * @param {object} props
 * @param {HTMLElement} props.id
 * @param {string} props.path
 * @param {object} props.state
 */
Editor.SVGRender = (props) => {
  const { id, path } = props;
  const { w, h, points, activePoint } = props.state;

  // console.log(`ap: ${activePoint}, index:`);
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
          //setDraggedQuadratic: setDraggedQuadratic //needs to be caslled higher up
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
          // setDraggedCubic: setDraggedCubic //needs to be caslled higher up
        })
      );
    }

    const isFirst = i === 0 ? ' ad-PointGroup--first' : '';
    const ap = activePoint.toString() === i.toString() ? ' is-active' : '';

    return (
      `<g class="ad-PointGroup${isFirst}${ap}">
          ${Point({
            index:i,
            x:p.x,
            y:p.y,
            rad: 16,
            // setDraggedPoint:setDraggedPoint //needs to be caslled higher up
          })}
          ${anchors}
      </g>`
    );
  }).join('');

  const grid = Grid(props.state);

  const controls = Controls(props.state);

  id.innerHTML =
    `<div class="ad-Container">
      <div class="ad-Container-main">
        <div class="ad-Container-svg">
          <svg class="ad-SVG" width="${w}" height="${h}">
            <path class="ad-Path" d="${path}"></path>
            <path d="M 100 100 L 200 200"
            fill="#59fa81" stroke="#d85b49" stroke-width="3" />
            <g class="ad-Points">
            ${circles}
            </g>
            ${grid}
          </svg>
        </div>
      </div>
      <div class="ad-Container-controls">
        <div id="controls" class=""></div>
        ${controls}
      </div>
    </div>`;

};



Editor.InitGetState = () => {

};
Editor.PostState = () => {

};
