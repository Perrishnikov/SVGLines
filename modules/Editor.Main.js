//@ts-check

import Listener from './Listener.js';


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


  Grid = (width) => {
    const { h } = this.getState(); //dont use State width, use modified version
    const {size, numbers, show} = this.getState().grid;

    let grid = '';
    let text = '';

    // if (show) {
    for (let i = 1; i < (width / size); i++) {
      grid +=
        `<line
              class="grid_line"
              x1="${i * size }"
              y1="0"
              x2="${i * size }"
              y2="${h}"/>
            `;

      if (numbers) {
        text +=
          `<text x="${i*size}" y="10" class="small">${i*size}</text>`;
      }
    }

    for (let i = 1; i < (h / size); i++) {
      grid +=
        `<line
            class="grid_line"
            x1="0"
            y1="${i * size}"
            x2="${width}"
            y2="${i * size}"/>
          `;

      if (numbers) {
        text +=
          `<text x="10" y="${i*size}" class="small">${i*size}</text>`;
      }

    }

    // }
    return `
      <g class="grid ${!show ? ' is-hidden"' : ''}">
        ${grid}
        ${text}
      </g>
    `;
  }


  /**
   * Render this on every State change
   * @param {object} props
   * @param {import('./Editor').State} props.state
   * @returns {string}
   */
  render = (props) => {
    const { w, h, activePointIndex, activeLineIndex, grid } = props.state;

    const lines = props.state.lines;
    const cpWidth = 300;
    const width = parseInt(w.toString());

    // console.log(`width: ${width}`);
    // <div style="min-height:${h}px; min-width:${width}px" 
    return `
    <div id="main" style="min-width:${width + cpWidth}px" class="main_wrap">
      
      <svg class="ad-SVG" width="${width}" height="${h}">
      
      ${grid.show ? this.Grid(width): ''}

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
      <div style="min-width:${cpWidth}px"></div>
    </div>
    
    `;
  }

}
