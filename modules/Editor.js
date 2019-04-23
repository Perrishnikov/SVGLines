//@ts-check
// import store from './store/index.js'; //use store INSTANCE to get State
import { Controls } from './Editor.Controls.js';
import { Point, Quadratic, Cubic, Grid } from './Editor.Components.js';
/**
 * @typedef {object} Editor.state
 * @typedef {HTMLBaseElement} id
 * @typedef {function} Editor.setState
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
      //Quadrratic
      // console.log(`mousedown`);
      /**@type {String[]} */
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
      this.handleMouseMove(e);
      // this.addPoint(e);
    });

    document.addEventListener('click', e => {
      this.addPoint(e);
    });

  }

  // EVENTS CALLED BY LISTENERS
  handleKeyDown = (e) => {
    if (e.key === 'Alt') this.setState({ ctrl: true });
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


  /** 
   * setState for this Editor
   *
   * @param {object} obj
   * @returns void
   */
  setState = (obj) => {
    // console.log(`this.setState`);

    this.state = Object.assign({}, this.state, obj);
    // console.log(this.state);
    this.Render();
  }


  generatePath = () => {
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

  addPoint = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('click');
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
  bestCopyEver = (src) => {
    return Object.assign({}, src);
  }

  /**@param {number} index */
  setDraggedPoint = (index) => {
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
   * @param {number} index 
   */
  setDraggedQuadratic = (index) => {
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
  setDraggedCubic = (index, anchor) => {
    if (!this.state.ctrl) {
      this.setState({
        activePoint: index,
        draggedCubic: anchor
      });
    }
  }

  setPointCoords = (coords) => {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;

    points[active].x = coords.x;
    points[active].y = coords.y;

    this.setState({ points });
  }

  setCubicCoords = (coords, anchor) => {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;

    points[active].c[anchor].x = coords.x;
    points[active].c[anchor].y = coords.y;

    this.setState({ points });
  }

  setQuadraticCoords = (coords) => {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;

    points[active].q.x = coords.x;
    points[active].q.y = coords.y;

    this.setState({ points });
  }

  /**@param {MouseEvent} e */
  getMouseCoords = (e) => {
    // const rect = ReactDOM.findDOMNode(this.refs.svg).getBoundingClientRect()
    const rect = this.id.getBoundingClientRect();
    console.log(rect);
    // console.log(`e.pageX ${e.pageX}, rect.left ${rect.left}`);
    let x = Math.round(e.pageX - rect.left);
    let y = Math.round(e.pageY - rect.top);

    if (this.state.grid.snap) {
      x = this.state.grid.size * Math.round(x / this.state.grid.size);
      y = this.state.grid.size * Math.round(y / this.state.grid.size);
    }

    return { x, y };
  }


  handleMouseMove = (e) => {
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


  positiveNumber(n) {
    n = parseInt(n);
    if (isNaN(n) || n < 0) n = 0;

    return n;
  }
  setGridSize = (e) => {
    let grid = this.state.grid;
    let v = this.positiveNumber(e.target.value);
    let min = 1;
    let max = Math.min(this.state.w, this.state.h);

    if (v < min) v = min;
    if (v >= max) v = max / 2;

    grid.size = v;

    this.setState({ grid });
  };

  setGridSnap = (e) => {
    let grid = this.state.grid;
    grid.snap = e.target.checked;

    this.setState({ grid });
  };

  setGridShow = (e) => {
    let grid = this.state.grid;
    grid.show = e.target.checked;

    this.setState({ grid });
  };

  Render = () => {
    // console.log(`renderSVG()`);
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
}

/** 
 * @param {object} props
 * @param {HTMLElement} props.id
 * @param {string} props.path
 * @param {function} props.addPoint
 * @param {function} props.setDraggedPoint
 * @param {function} props.setDraggedCubic
 * @param {function} props.setDraggedQuadratic
 * @param {object} props.state
 * @param {function} props.handleMouseMove
 */
Editor.SVGRender = (props) => {
  const { id, path, addPoint, handleMouseMove, setDraggedPoint, setDraggedQuadratic, setDraggedCubic } = props;

  const { w, h, points, activePoint } = props.state;

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
          // setDraggedQuadratic: setDraggedQuadratic //needs to be caslled higher up
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
    const ap = activePoint === i ? ' is-active' : '';

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

};



Editor.InitGetState = () => {

};
Editor.PostState = () => {

};
