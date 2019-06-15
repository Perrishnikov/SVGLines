//@ts-check
import { Point, Quadratic, Cubic, Grid } from './Editor.Components.js';
import Listener from './Listener.js';

/**
 * @typedef {import('./Editor').Anchor} anchor
 * @typedef {import('./Editor').Element} Element
 * @typedef {import('./Editor').default} Editor
 * @typedef {{x:number,y:number}} coords
 * @typedef {MouseEvent} e 
 * 
 */
export default class Main {
  /**
   * @param {Editor} editor 
   */
  constructor(editor) {
    this.editor = editor;
    // this.setState = editor.setState;
    // this.getState = editor.getState;
    // this.handleMouseMove = editor.handleMouseMove;
    // this.getMouseCoords = editor.getMouseCoords;
    // this.generatePath = editor.generatePath;

    this.editor.registerListener([
      new Listener({
        // caller: 'Editor',
        // selector: 'document',
        type: 'keydown',
        callback: this.handleKeyDown,
        cgId: '#main',
        keys: ['Alt', 'Shift', 'Meta'],
      }),
      new Listener({
        // caller: 'Editor',
        // selector: 'document',
        type: 'keyup',
        callback: this.handleKeyUp,
        cgId: '#main',
        keys: null,
      }),
      new Listener({
        // caller: 'Editor',
        // selector: 'document',
        type: 'mouseup',
        callback: (e) => {
          let { draggedPoint, draggedQuadratic, draggedCubic } = this.editor.getState();

          if (draggedPoint || draggedQuadratic || draggedCubic) {
            this.cancelDragging();//TODO: move to CORE
          }
        },
        cgId: '#main',
        keys: null
      }),
      new Listener({
        type: 'mousedown',
        callback: this.mousedown.bind(this),
        cgId: '#main',
        keys: null
      }),
      new Listener({
        type: 'mousemove',
        callback: this.editor.handleMouseMove,
        cgId: '#main',
        keys: null
      })
    ]);

  }


  mousedown = (e) => {
    // e.preventDefault();
    // e.stopPropagation();

    /**@type {string[]} */
    const classList = [...e.target.classList];
    /**@type {string} */
    const index = e.target.dataset.index; //point index value

    // console.log(classList);

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
      console.log('meta');
      this.editor.setState({ ctrl: true });
    }
    if (e.key === 'Shift') {
      console.log('shift');
      this.editor.setState({ shift: true });
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


  handleKeyUp = (e) => {
    //need to account for text entry
    // if (!this.getState().focusText) {
    // console.log(`handleKeyUp`);
    if (this.editor.getState().ctrl === true) {
      this.editor.setState({ ctrl: false });
    }
    if (this.getState().shift === true) {
      this.setState({ shift: false });
    }
    // }
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
   * @param {anchor} anchor
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
   * param {e} e
   */
  addLine = (e) => {
    const coords = this.getMouseCoords(e);
    const { lines, activeLineIndex } = this.getState();

    const newPoints = { points: [coords], tags: [] };
    lines.push(newPoints);

    this.setState({
      lines,
      activePointIndex: 0, //first point
      activeLineIndex: lines.length - 1 // on new line
    });
  }

  /**
   * Callled from mousedown event
   * @memberof Editor
   * calls setState
   * param {e} e
   */
  addPoint = (e) => {


    // if (this.state().ctrl === true) {
    const coords = this.getMouseCoords(e);
    console.log(`addPoint at x:${coords.x}, y:${coords.y}`);
    const { lines, activeLineIndex } = this.getState();
    // const { points } = this.getState();
    // console.log(points);
    // points.push(coords);
    lines[activeLineIndex].points.push(coords);

    this.setState({
      lines,
      //points
      activePointIndex: lines[activeLineIndex].points.length - 1
    });
    // }
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
            rad: 8,
            // setDraggedPoint:setDraggedPoint //needs to be caslled higher up
          })}
          ${anchors}
      </g>`
      );
    }).join('');

  }

  /**
   * Render this on every State change
   * @param {object} props
   * @param {import('./Editor').State} props.state
   */
  render = (props) => {
    // console.log(`from Main render()`);
    const { w, h, activePointIndex, activeLineIndex } = props.state;
    const grid = Grid(props.state);
    const lines = props.state.lines;
    /* SIDE EFFECT - set the width and height of Main based off of line.json*/
    // this.id.style.minHeight = `${props.state.h}px`;
    // this.id.style.minWidth = `${props.state.w + 300}px`; //300px is width of Controls

    return `
    <div id="main" class="main_wrap">
        <svg class="ad-SVG" width="${w}" height="${h}">
          ${lines.map((line, index) => {
            let al = activeLineIndex == index ? true : false; //if the line matches, we are halfway there. Still need to match point index
            const path = this.editor.generatePath(line.points);
            const circles = this.generateCircles(line.points, activePointIndex, al );
            
            return (`
              <path class="ad-Path" d="${path}"></path>
              <g data-lineindex="${index}" class="ad-Points">${circles}</g>
            `);
          }).join('')}

          ${grid}
        </svg>
        </div>
        `;
  }

}

Main.Render = () => {

}
