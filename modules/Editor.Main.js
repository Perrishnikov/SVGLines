//@ts-check

import Listener from './Listener.js';
import { Grid } from './Editor.Components.js';


export default class Main {
  /**
   * @param {import('./Editor').default} editor 
   */
  constructor(editor) {
    this.CORE = editor.CORE;
    this.setState = editor.setState;
    this.getState = editor.getState;
    this.id = 'main';

    editor.registerListener([
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
        callback: this.CORE.cancelDragging,
        cgId: '#main',
        keys: null
      }),
      new Listener({
        type: 'mousedown',
        callback: this.CORE.handleMousedown,
        cgId: '#main',
        keys: null
      }),
      new Listener({
        type: 'mousemove',
        callback: this.CORE.handleMousemove,
        cgId: '#main',
        keys: null
      })
    ]);

  }


  /**
   * Render this on every State change
   * @param {object} props
   * @param {import('./Editor').State} props.state
   * @returns {string}
   */
  render = (props) => {
    const { w, h, activePointIndex, activeLineIndex } = props.state;
    const grid = Grid(props.state);
    const lines = props.state.lines;

    return `
    <div style="min-height:${h}px; min-width:${w + 300}px" id="main" class="main_wrap">
      
      <svg class="ad-SVG" width="${w +300}" height="${h}">
      ${grid}

      ${lines.map((line, index) => {
        let al = activeLineIndex == index ? true : false; //if the line matches, we are halfway there. Still need to match point index
        const path = this.CORE.generatePath(line.points, line.closePath);
        const circles = this.CORE.generateCircles(line.points, activePointIndex.toString(), al );
        
        return `
          <path class="ad-Path" d="${path}"></path>
          <g data-lineindex="${index}" class="ad-Points">${circles}</g>
        `;
      }).join('')}

      </svg>
    </div>
    `;
  }

}

