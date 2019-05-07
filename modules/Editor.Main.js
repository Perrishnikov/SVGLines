//@ts-check
import { Point, Quadratic, Cubic, Grid } from './Editor.Components.js';
/**
 * @typedef {import('./Editor').anchor} anchor
 * @typedef {number} activePoint
 */
export default class Main {
  constructor(editor, target) {
    this.id = target;
    this.setState = editor.setState;
    this.getState = editor.getState;
    this.handleMouseMove = editor.handleMouseMove;
    this.bestCopyEver = editor.bestCopyEver;
    this.getMouseCoords = editor.getMouseCoords;

    target.addEventListener('mouseup', this.cancelDragging, false);
    target.addEventListener('mousemove', this.handleMouseMove, false);

    target.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();

      /**@type {string[]} */
      const classList = [...e.target.classList];
      /**@type {string} */
      const index = e.target.dataset.index;
      console.log(classList);

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
        // console.log('ad-Point classList');
        this.setDraggedPoint(index);
      } else if (classList.includes('ad-SVG')) {
        //This is the canvas area
        /** Add the AddPoint Event */
        // console.log(`this.state.ctrl:${this.state().ctrl}, true:${true}, equal:${this.state().ctrl == true}`);

        if (this.getState().ctrl === true) {
          console.log(`addPoint`);
          this.addPoint(e);
        }
      } else {
        console.log(`There might be an error here`);
      }
    });

  }

  // EVENTS CALLED BY LISTENERS


  cancelDragging = () => {
    console.log(`cancelDragging`);
    this.setState({
      draggedPoint: false,
      draggedQuadratic: false,
      draggedCubic: false
    });
  }


  /**
   * Called from mousedown event
   * @param {string} index 
   */
  setDraggedPoint = (index) => {
    console.log(`draggedPoint`);
    if (!this.getState().ctrl) {
      this.setState({
        activePoint: parseInt(index),
        draggedPoint: true
      });
    }
  }

  /**
   * Called from mousedown event
   * Sets the active point to this
   * @param {string} index 
   */
  setDraggedQuadratic = (index) => {
    console.log(`setDraggedQuadratic`);
    if (!this.getState().ctrl) {
      this.setState({
        activePoint: parseInt(index),
        draggedQuadratic: true
      });
    }
  }

  /**
   * Called from mousedown event
   * Sets the active point to this, and draggedCubic to the anchor
   * calls setState
   * @param {anchor} anchor
   * @param {string} index
   */
  setDraggedCubic = (index, anchor) => {
    console.log(`setDraggedCubic`);
    if (!this.getState().ctrl) {
      this.setState({
        activePoint: parseInt(index),
        draggedCubic: anchor
      });
    }
  }

  /**
   * Callled from mousedown event
   * @memberof Editor
   * calls setState
   * param {e} e
   */
  addPoint = (e) => {
    // console.log('addPoint ' + this.getState().ctrl);

    // if (this.state().ctrl === true) {
      const coords = this.getMouseCoords(e);
      const { points } = this.getState();
      // console.log(points);
      points.push(coords);

      this.setState({
        points,
        activePoint: points.length - 1
      });
    // }
  }

  render = (props) => {
    console.log(`from Main render()`);
    console.log(props);
    const { path } = props;
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
      const ap = activePoint == i ? ' is-active' : '';

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
    // console.log(`Main Ctrl: ${props.state.ctrl}`);
    // console.log(this);
    return `
      
      <div class="ad-Container-svg">
        <svg class="ad-SVG" width="${w}" height="${h}">
          <path class="ad-Path" d="${path}"></path>
          <g class="ad-Points">${circles}</g>
          ${grid}
        </svg>
      </div>`;
  }

}

Main.Render = () => {

}
