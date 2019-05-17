//@ts-check
import { Point, Quadratic, Cubic, Grid } from './Editor.Components.js';
/**
 * @typedef {import('./Editor').anchor} anchor
 * @typedef {import('./Editor').Element} Element
 * @typedef {import('./Editor').default} Editor
 * @typedef {{x:number,y:number}} coords
 * @typedef {MouseEvent} e 
 * 
 */
export default class Main {
  /**
   * @param {Editor} editor 
   * @param {Element} target 
   */
  constructor(editor, target) {
    this.id = target;
    this.setState = editor.setState;
    this.getState = editor.getState;
    this.handleMouseMove = editor.handleMouseMove;
    // this.bestCopyEver = editor.bestCopyEver;
    this.getMouseCoords = editor.getMouseCoords;
    // this.generatePath = editor.generatePath;

    target.addEventListener('mouseup', (e) => {
      let state = this.getState();

      if (state.draggedPoint || state.draggedQuadratic || state.draggedCubic) {
        this.cancelDragging();
      }
    }, false);

    target.addEventListener('mousemove', this.handleMouseMove, false);

    target.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();

      /**@type {string[]} */
      const classList = [...e.target.classList];
      /**@type {string} */
      const index = e.target.dataset.index; //point index value

      // console.log(classList);

      if (classList.includes('ad-Anchor-point')) {
        //if the target has an anchor, it is Cubic
        const anchor = e.target.dataset.anchor ? e.target.dataset.anchor : null;

        console.log(`index: ${index}, anchor: ${anchor}`);

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
          console.log(`addPoint`);
          this.addPoint(e);
        } else if (this.getState().ctrl && this.getState().shift) {
          console.log(`addLine`);
          this.addLine(e);
        }

      } else {
        console.log(`There might be an error here`);
      }
    });

  }

  // EVENTS CALLED BY LISTENERS


  cancelDragging = () => {
    // console.log(`cancelDragging`);
    this.setState({
      draggedPoint: false,
      draggedQuadratic: false,
      draggedCubic: false
    });
  }


  /**
   * Called from mousedown event
   * @param {string} index 
   * @param {string} lineindex
   */
  setDraggedPoint = (index, lineindex) => {
    console.log(`draggedPoint`);
    if (!this.getState().ctrl) {
      this.setState({
        activeLine: parseInt(lineindex),
        activePoint: parseInt(index),
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
    console.log(`setDraggedQuadratic`);
    if (!this.getState().ctrl) {
      this.setState({
        activeLine: parseInt(lineindex),
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
  setDraggedCubic = (index, anchor, lineindex) => {
    console.log(`setDraggedCubic`);
    if (!this.getState().ctrl) {
      this.setState({
        activeLine: parseInt(lineindex),
        activePoint: parseInt(index),
        draggedCubic: anchor
      });
    }
  }


  /**
   * Called from mousedown event
   * calls setState
   * param {e} e
   */
  addLine = (e) => {
    const coords = this.getMouseCoords(e);
    const { lines, activeLine } = this.getState();

    const newPoints = { points: [coords] };
    lines.push(newPoints);

    this.setState({
      lines,
      activePoint: 0, //first point
      activeLine: lines.length - 1 // on new line
    });
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
    const { lines, activeLine } = this.getState();
    // const { points } = this.getState();
    // console.log(points);
    // points.push(coords);
    lines[activeLine].points.push(coords);

    this.setState({
      lines,
      //points
      activePoint: lines[activeLine].points.length - 1
    });
    // }
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
      const ap2 = ap == i && al == true ? ' is-active' : '';

      return (
        `<g class="ad-PointGroup${isFirst}${ap2}">
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

  }

  render = (props) => {
    console.log(`from Main render()`);
    console.log(props);
    const { w, h, activePoint, activeLine } = props.state;
    const grid = Grid(props.state);
    const lines = props.state.lines;

    return `
        <svg class="ad-SVG" width="${w}" height="${h}">
          ${lines.map((line, index) => {
            let al = activeLine == index ? true : false; //if the line matches, we are halfway there. Still need to match point index
            const path = this.generatePath(line.points);
            const circles = this.generateCircles(line.points, activePoint, al );
            
            return (`
              <path class="ad-Path" d="${path}"></path>
              <g data-lineindex="${index}" class="ad-Points">${circles}</g>
            `);
          }).join('')}

          ${grid}
        </svg>`;
  }

}

Main.Render = () => {

}
