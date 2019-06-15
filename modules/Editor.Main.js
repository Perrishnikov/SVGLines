//@ts-check

import Listener from './Listener.js';
import { Grid } from './Editor.Components.js';

/**
 * @typedef {import('./Editor').Anchor} anchor
 * @typedef {import('./Editor').Element} Element
 * @typedef {import('./Editor').default} Editor
 * @typedef {{x:number,y:number}} coords
 * @typedef {MouseEvent} e
 * @typedef {import('./Editor').State} State
 * 
 */
export default class Main {
  /**
   * @param {Editor} editor 
   */
  constructor(editor) {
    // this.editor = editor;
    this.CORE = editor.CORE;
    this.setState = editor.setState;
    this.getState = editor.getState;
    // this.handleMouseMove = editor.handleMouseMove;
    // this.getMouseCoords = editor.getMouseCoords;
    // this.generatePath = editor.generatePath;

    // this.registerListener();

  }
  listeners(){
    return [
      new Listener({
        type: 'keydown',
        callback: this.CORE.handleKeyDown,
        cgId: '#main',
        keys: ['Alt', 'Shift', 'Meta'],
      }),
      new Listener({
        type: 'keyup',
        callback: this.CORE.handleKeyUp,
        cgId: '#main',
        keys: null,
      }),
      new Listener({
        type: 'mouseup',
        callback: (e) => {
          let { draggedPoint, draggedQuadratic, draggedCubic } = this.getState();

          if (draggedPoint || draggedQuadratic || draggedCubic) {
            this.CORE.cancelDragging();
          }
        },
        cgId: '#main',
        keys: null
      }),
      new Listener({
        type: 'mousedown',
        callback: this.CORE.mousedown.bind(this),
        cgId: '#main',
        keys: null
      }),
      new Listener({
        type: 'mousemove',
        callback: this.CORE.handleMouseMove,
        cgId: '#main',
        keys: null
      })
    ]
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
          const path = this.CORE.generatePath(line.points);
          const circles = this.CORE.generateCircles(line.points, activePointIndex, al );
          
          return `
            <path class="ad-Path" d="${path}"></path>
            <g data-lineindex="${index}" class="ad-Points">${circles}</g>
          `;
        }).join('')}

        ${grid}
      </svg>
    </div>
    `;
  }

}

Main.Render = () => {

}
