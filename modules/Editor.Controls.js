/** Controls ***************************/
export default class Controls {
  renderControls() {

    Editor.ControlsRender({
      state: this.bestCopyEver(this.state), // Cloned
      removeActivePoint: this.removeActivePoint,
    });
  }

  positiveNumber(n) {
    n = parseInt(n)
    if (isNaN(n) || n < 0) n = 0

    return n
  }
  setHeight(e) {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ h: v });
  }

  setWidth(e) {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ w: v });
  }

  setPointType(e) {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;

    // not the first point
    if (active !== 0) {
      let v = e.target.value;

      switch (v) {
        case 'l':
          points[active] = {
            x: points[active].x,
            y: points[active].y
          };
          break;
        case 'q':
          points[active] = {
            x: points[active].x,
            y: points[active].y,
            q: {
              x: (points[active].x + points[active - 1].x) / 2,
              y: (points[active].y + points[active - 1].y) / 2
            }
          };
          break;
        case 'c':
          points[active] = {
            x: points[active].x,
            y: points[active].y,
            c: [{
                x: (points[active].x + points[active - 1].x - 50) / 2,
                y: (points[active].y + points[active - 1].y) / 2
              },
              {
                x: (points[active].x + points[active - 1].x + 50) / 2,
                y: (points[active].y + points[active - 1].y) / 2
              }
            ]
          };
          break;
        case 'a':
          points[active] = {
            x: points[active].x,
            y: points[active].y,
            a: {
              rx: 50,
              ry: 50,
              rot: 0,
              laf: 1,
              sf: 1
            }
          };
          break;
      }

      this.setState({ points });
    }
  }

  setArcParam(param, e) {
    const cstate = this.bestCopyEver(this.state);

    const points = cstate.points;
    const active = cstate.activePoint;
    let v;

    if (['laf', 'sf'].indexOf(param) > -1) {
      v = e.target.checked ? 1 : 0;
    } else {
      v = this.positiveNumber(e.target.value);
    }

    points[active].a[param] = v;

    this.setState({ points });
  }

  setPointPosition(coord, e) {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setPointCoords(coords);
  }


  setQuadraticPosition(coord, e) {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint].q;
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setQuadraticCoords(coords);
  }


  setCubicPosition(coord, anchor, e) {
    const cstate = this.bestCopyEver(this.state);

    const coords = cstate.points[cstate.activePoint].c[anchor];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > cstate.w) v = cstate.w;
    if (coord === 'y' && v > cstate.h) v = cstate.h;

    coords[coord] = v;

    this.setCubicCoords(coords, anchor);
  }

  removeActivePoint(e) {
    const cstate = this.bestCopyEver(this.state);
    const points = cstate.points;
    const active = cstate.activePoint;

    if (points.length > 1 && active !== 0) {
      points.splice(active, 1);

      this.setState({
        points,
        activePoint: points.length - 1
      });
    }
  }

  reset(e) {
    const cstate = this.bestCopyEver(this.state);
    const w = cstate.w;
    const h = cstate.h;

    this.setState({
      points: [{ x: w / 2, y: h / 2 }],
      activePoint: 0
    });
  }



}

Controls.ControlsRender = (props) => {

};