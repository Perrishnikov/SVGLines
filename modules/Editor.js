//@ts-check
// import store from './store/index.js'; //use store INSTANCE to get State
import Controls from './Editor.Controls.js';
import Main from './Editor.Main.js';
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
    this.id = id;

    //must be added to document, not Main. Needed in Main, but cant place it in div??
    document.addEventListener('keydown', this.handleKeyDown, true);
    document.addEventListener('keyup', this.handleKeyUp, false);

    /**@type {HTMLDivElement} */
    const mainId = document.querySelector('#main');
    this.main = new Main(this, mainId);

    

    /**@type {HTMLDivElement} */
    const controlId = document.querySelector('#controls');
    this.controls = new Controls(this, controlId);

    //trigger the everything render()
    this.setState(state);
  }


  handleKeyDown = (e) => {
    console.log(`handleKeyDown: ${e.key}`);
    if (e.key === 'Alt' || e.key === 'Meta') {
      this.setState({ ctrl: true });
    }
  }


  handleKeyUp = (e) => {
    console.log(`handleKeyUp`);
    if (this.state.ctrl === true) {
      this.setState({ ctrl: false });
    }
  }


  /** Deep Copies this.state */
  // bestCopyEver = (src) => {
  //   return Object.assign({}, src);
  // }


  getState = () => {
    return Object.assign({}, this.state);
    // return this.bestCopyEver(this.state);
  }


  /** 
   * setState for this Editor
   * @param {object} obj
   * @returns void
   */
  setState = (obj) => {
    new Promise((resolve, reject) => {
      resolve(this.state = Object.assign({}, this.state, obj));

    }).then((state) => {
      const props = {
        state: this.getState(), // Cloned
        // id: this.id,
        path: this.generatePath(),
        // controls: this.controls,
        // main: this.main,
      };

      this.render(props);
    });

  }


  /**
   * Called from Class SVGRedner
   *
   * @memberof Editor
   */
  generatePath = () => {
    let { points, closePath } = this.getState();
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
   * Called from handleMouseMove
   * calls setState
   * @memberof Editor
   * @param {coords} coords
   */
  setPointCoords = (coords) => {
    const cstate = this.getState();

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
    const cstate = this.getState();

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
    const cstate = this.getState();

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
   * passed to Editor.Main
   * @param {e} e 
   * 
   */
  handleMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
  render = (props) => {
    const mainId = document.querySelector('#main');
    mainId.innerHTML = this.main.render(props);

    /**Controls - auto adds listeners */
    const controlId = document.querySelector('#controls');
    controlId.innerHTML = this.controls.render(props);
    // Editor.SVGRender({
    //   state: this.bestCopyEver(this.state), // Cloned
    //   id: this.id,
    //   path: this.generatePath(),
    //   controls: this.controls,
    //   main: this.main,
    // });
  }
}


/** 
 * @param {object} props
 * @param {HTMLElement} props.id
 * @param {string} props.path
 * @param {object} props.state
 * @param {Controls} props.controls
 * @param {Main} props.main
 */
Editor.SVGRender = (props) => {
  const { id, controls, main } = props;
  // const { w, h, points, activePoint } = props.state;

  // const m = document.createElement('div');
  // m.innerHTML = main.render(props);
  // id.appendChild(m);

  // const c = document.createElement('div');
  // c.innerHTML = controls.render(props);
  // id.appendChild(c);

  // id.innerHTML = `
  //     <div id="main" class="ad-Container-main">
  //       ${main.render(props)}
  //     </div>
  //     ${controls.render(props)}`;
};
