//@ts-check

import { Listener, LISTENERS } from './Listener.js';


export default class Main {
  /**
   * @param {import('./Editor').default} editor 
   */
  constructor(editor) {
    this.CORE = editor.CORE;
    this.setState = editor.setState;
    this.getState = editor.getState;
    this.name = 'main';
    this.id = `#${this.name}`;

    editor.registerListener([
      new Listener({
        type: LISTENERS.KEYDOWN,
        callback: this.CORE.handleKeyDown,
        cgId: this.id,
        keys: ['Alt', 'Shift', 'Meta'],
      }),
      new Listener({
        type: LISTENERS.KEYUP,
        callback: this.CORE.handleKeyUp,
        cgId: this.id,
        keys: null,
      }),
      new Listener({
        type: LISTENERS.MOUSEUP,
        callback: this.CORE.cancelDragging,
        cgId: this.id,
        keys: null
      }),
      new Listener({
        type: LISTENERS.MOUSEDOWN,
        callback: this.CORE.handleMousedown,
        cgId: this.id,
        keys: null
      }),
      new Listener({
        type: LISTENERS.MOUSEMOVE,
        callback: this.CORE.handleMousemove,
        cgId: this.id,
        keys: null
      })
    ]);

  }


  Grid = (width) => {
    const { h } = this.getState(); //dont use State width, use modified version
    const { size, numbers, steps } = this.getState().grid;
    let grid = '';
    let text = '';

    for (let i = 1; i < (width / size); i++) {
      grid +=
        `<line
              class="grid_line"
              x1="${i * size }"
              y1="0"
              x2="${i * size }"
              y2="${h}"/>
            `;

      if (numbers && i % steps == 0) {
        text +=
          `<text x="${i * size}" y="10" class="small">${i * size}</text>`;
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

      if (numbers && i % steps == 0) {
        text +=
          `<text x="10" y="${i * size}" class="small">${i * size}</text>`;
      }

    }

    return `
      <g class="grid ">
        ${grid}
        ${text}
      </g>
    `;
  }


  setBackgroundImage(props) {
    const { width, h, background } = props;
    const { top, left, imagePath, opacity, } = background;

    return `
    <img style="background-size: cover; position:absolute; z-index: -5; opacity: ${opacity}; top:${top}px; left:${left}px; background-image:url(${imagePath}); background-color:black; background-blend-mode: normal;" width="${width}px" height="${h}px">
    `;
  }

  /**
   * Render this on every State change
   * @param {object} props
   * @param {import('./Editor').State} props.state
   * @returns {string}
   */
  render = (props) => {
    const { w, h, activePointIndex, activeLineIndex, grid, background } = props.state;

    const lines = props.state.lines;
    const cpWidth = 300;
    const width = parseInt(w.toString());

    // console.log(`width: ${width}`);
    // <div style="min-height:${h}px; min-width:${width}px" 
    return `
    <div id="main" style="min-width:${width + cpWidth}px" class="main_wrap">
      ${background.show ? this.setBackgroundImage({width, h, background}) : ''}

      <svg viewBox="0 0 ${width + cpWidth} ${h}" class="ad-SVG">
      
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
