//@ts-check

import { Section } from './Controls.Wrappers.js';
import Nav from './Controls.Nav.js';
import { Icon_Line, Icon_Shuffle, Icon_Settings, Icon_Help } from '../icons/index.js';
import LineFunctions from './CG/LineFunctions.js';
import LineTags from './CG/LineTags.js';

/**
 * @typedef {import('./Editor').Anchor} Anchor
 * @typedef {import('./Editor').State} State
 * @typedef {import('./Editor').Element} Element
 * @typedef {import('./Editor').default} Editor
 * @typedef {import('./Editor').PointType} PointType
 * @typedef {import('./Editor').Line} Line
 * @typedef {import('./Editor').Coords} Coords
 * @typedef {import('./Editor').E} E
 * 
 * @typedef {{LINE:string, LINES:string,  SETTINGS:string, HELP:string, ACTIVE:string, TAG_TO_DELETE:string }} LocalState
 * @typedef {string} Title
 * @typedef {string} Id
 * @typedef {string} Icon
 * @typedef {string} Active
 * @typedef {string} Html
 * @typedef {Array<Section>} Sections
 */
export default class Controls {
  /**
   * @param {Editor} editor 
   * param {Element} targetId
   */
  constructor(editor) {

    this.editor = editor;

    this.localState = {
      LINE: 'line',
      LINES: 'lines',
      SETTINGS: 'settings',
      HELP: 'help',
      ACTIVE: 'line',
      TAG_TO_DELETE: ''
    };

    //COMPONENTS 
    const lineFunctions = new LineFunctions({
      addLine: editor.addLine,
      resetLine: editor.resetLine,
      removeLine: editor.removeLine
    });

    const lineTags = new LineTags({
      activeLine: this.localState.ACTIVE,
      tags: this.editor.getState().tags,
    });

    /**
     * Make all the sections here. Place name in localState.
     */
    this.sections = [
      new Section({
        title: this.localState.LINE,
        icon: Icon_Line(),
        controlGroups: [
          lineFunctions,
          lineTags,
        ],
      }),
      new Section({
        title: this.localState.LINES,
        icon: Icon_Shuffle(),
        controlGroups: [],
      }),
      new Section({
        title: this.localState.SETTINGS,
        icon: Icon_Settings(),
        controlGroups: [],
      }),
      new Section({
        title: this.localState.HELP,
        icon: Icon_Help(),
        controlGroups: [],
      })
    ];

    //register all the Control Group's Listeners
    this.sections.forEach(section => {
      section.controlGroups.forEach(group => {
        editor.registerListener(group.listeners());
      });
    });

    /** 
     * NAV
     * This auto creates the Icon Nav sections
     * Then register the event handler for Nav
     */
    this.nav = new Nav({
      active: this.localState.ACTIVE,
      sections: this.sections
    });
    editor.registerListener(this.nav.listeners());

    // this.id.addEventListener('focusin', e => {
    //   const newTagText = document.querySelector('#newTagText');

    //   if (newTagText.id == e.target.id) {
    //     // this.toggleAddTagFocus(newTagText);
    //     newTagText.focus();
    //   }
    //   // console.dir(e.target);
    // });

    //TODO: Can prolly remove this.
    // this.id.addEventListener('focusout', e => {
    //   const newTagText = document.querySelector('#newTagText');

    //   // console.log(newTagText);
    //   // this.toggleAddTagFocus(newTagText);
    //   // console.dir(e.target);
    // });



    /** CONTROLS Event Listeners */
    // this.id.addEventListener('click', (e) => {
    //   e.stopPropagation();
    //   e.preventDefault();

    //   const classList = [...e.target.classList];
    //   const dataset = e.target.dataset ? e.target.dataset : 'NULL';
    //   const parent = e.target.parentNode;
    //   const parentClasses = [...parent.classList];

    //   // LINE -> BUTTON ACTIONS (addPoint, removePoint, addLine, removeLine, resetLine,...)
    //   const action = dataset.action; //'nav',...
    //   /**@type {string} */
    //   const value = dataset.value; //'line','lines','settings',...

    //   console.log(`controls action: ${action}`);
    //   switch (action) {
    //     //LINE
    //     case 'resetLine':
    //       '';
    //       break;
    //     case 'addLine':
    //       '';
    //       break;
    //     case 'removeLine':
    //       '';
    //       break;
    //     case 'setPointType':
    //       this.setPointType(e.target.value);
    //       break;
    //     case 'addPoint':
    //       '';
    //       break;
    //     case 'removePoint':
    //       this.removeActivePoint();
    //       break;
    //       //NAVIGATION ICONS
    //     case 'nav':
    //       this.showThisSection(value);
    //       this.activateThisIcon(value);
    //       break;
    //       //LINES
    //     case 'lineRules':
    //       // console.dir(e.target);
    //       switch (e.target.attributes.type.value) {
    //         case 'checkbox':
    //           // console.log(`id: ${e.target.id}`);
    //           this.handleLineRuleToggle(e.target.id);
    //       }
    //       break;
    //     case 'generateLineIds':
    //       this.handleGenerateLineId();
    //       break;
    //     default:
    //       console.log(`No action detected.`);
    //   }

    //   console.dir(`document.activeElement: ${document.activeElement.id}`);


    //   //SAVE -> TAGS - REMOVE TAG when (x) clicked
    //   if (classList.includes('svg_tag') && dataset.tag) {
    //     //target = <div><svg class="svg-tag">
    //     //set localState so we have a handle on the tag to delete
    //     this.localState.TAG_TO_DELETE = dataset.tag;

    //     //Open Confirm Delete Dialogue
    //     this.toggleTagConfirmDelete();
    //   }

    //   //SAVE -> TAGS -Confirm Delete
    //   if (dataset.value === 'confirm-yes') {
    //     this.handleRemoveGlobalTag(this.localState.TAG_TO_DELETE);
    //     // console.log(dataset);
    //   } else if (dataset.value === 'confirm-no') {
    //     this.toggleTagConfirmDelete();
    //   }

    //   //LINE -> TAGS 
    //   if (parentClasses.includes('line-tag')) {
    //     //LINE -> TAGS - Add
    //     if (parent.dataset.value === 'true') {
    //       this.handleLineRemoveTag(parent.dataset.tag);
    //     }
    //     //LINE -> TAGS - Remove
    //     else if (parent.dataset.value === 'false') {
    //       this.handleLineAddTag(parent.dataset.tag);
    //     }

    //   }

    // });
  }

  handleFocusIn(e) {
    e.stopPropagation();
    e.preventDefault();
    const newTagText = document.querySelector('#newTagText');

    if (newTagText.id == e.target.id) {
      // this.toggleAddTagFocus(newTagText);
      newTagText.focus();
    }
  }

  verifyUniqueId() {

  }
  handleGenerateLineId() {
    const { lineRules, lines } = this.editor.getState();
    //returns the value of the first element in the array.value
    /** @type {string} */
    const startingLineBasis = lineRules.find(rule => rule.id == 'lineStartingBasis').value;
    // console.log(`startingLineBasis: ${startingLineBasis}; type: ${typeof(startingLineBasis)} `);
    const padLength = startingLineBasis.length;

    /**@type {number} */
    let count = parseInt(startingLineBasis);
    // const parsed = parseInt(startingLineBasis);
    // if (isNaN(parsed)) { return 0; }

    const updatedLines = lines.map(line => {
      // let { id = count } = line;

      line.id = count.toString().padStart(padLength, '0');
      count++;

      return line;
    });

    // console.log(`startingLineBasis: ${startingLineBasis}`);
    this.editor.setState({
      lines: updatedLines,
      // lineRules
    });

    // console.log(this.getState());
  }

  handleLineRuleToggle(id) {
    const { lineRules } = this.editor.getState();

    //map all the lineRules, change enabled att if it matches
    const mappedLineRules = lineRules.map(rule => {
      if (rule.id === id) {
        rule.enabled = rule.enabled ? false : true;
      }
      return rule;
    });

    this.editor.setState({ lineRules: mappedLineRules });
  }

  handleLineIdUpdate(target) {
    const { lineRules = [], activeLineIndex, lines } = this.editor.getState();
    const activeLine = lines[activeLineIndex];

    const newLineId = target.innerText.trim();
    //TODO: validation
    target.blur();

    //If the Tag is valid, proceed....
    if (newLineId && newLineId.length < 15) {

      //Update the line's Id
      activeLine.id = newLineId;
      this.editor.setState({ lines });
    }
  }

  /**
   * When User clicks a Tag in Line -> Line Tags, add this Tag to the Line's Tags
   * @param {string} addTag 
   */
  handleLineAddTag(addTag) {
    const { activeLineIndex, lines } = this.editor.getState();
    let activeLine = lines[activeLineIndex];

    activeLine.tags ? activeLine.tags : [];

    activeLine.tags.push(addTag);

    this.editor.setState({ lines });
  }

  /**
   * When User clicks a Tag in Line -> Line Tags, remove this Tag from the Line's Tags
   * @param {string} removeTag 
   */
  handleLineRemoveTag(removeTag) {
    const { activeLineIndex, lines } = this.editor.getState();
    let activeLine = lines[activeLineIndex];

    const filtered = activeLine.tags.filter(tag => tag !== removeTag);

    //assign the Tags to the Line
    activeLine.tags = filtered;

    this.editor.setState({ lines });
  }


  /**
   * When user clicks (x) to delete Tag, open the Tag Confirm Dialogue
   * Toggle the active class 
   */
  toggleTagConfirmDelete() {
    const d = document.querySelector('#tagConfirmDelete');

    d.classList.toggle('active');
  }


  // removeAddToggleFocus() {
  //   document.querySelector('#newTagText').classList.remove('active');
  // }


  /**
   * When User hits Enter, add the new Tag to State
   * Called from Editor keydown Event Listener
   * @param {Element} target 
   */
  handleAddTag(target) {
    console.log('handleAddTag');
    let { tags = [] } = this.editor.getState();

    //if all the Tags have been deleted, create a new array
    // tags = tags ? tags : [];

    //Clean use input on Tag name
    const newTag = target.innerText.trim();
    //TODO: validation
    target.blur();

    //If the Tag is valid, proceed....
    if (newTag && newTag.length < 15) {
      tags.push(newTag);
      // this.toggleAddTagFocus(target);
      this.editor.setState({ tags });
    }
  }


  /**
   * When User clicks Tag's X, pop Tag from State
   * Then remove the Tag from all Lines
   * @param {string} target 'subway'
   */
  handleRemoveGlobalTag(target) {
    const { tags: gtags, lines } = this.editor.getState();
    const cleanedTags = gtags.filter(tag => tag !== target);
    const cleanedLines = lines.map(line => {
      const cleanTags = line.tags.filter(tag => tag !== target);
      line.tags = cleanTags;
      return line;
    });

    this.editor.setState({ tags: cleanedTags, lines: cleanedLines });
  }

  /// UI metods




  /** LOGIC methods */
  setHeight = (e) => {
    let v = this.editor.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.editor.setState({ h: v });
  }


  setWidth = (e) => {
    let v = this.editor.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.editor.setState({ w: v });
  }


  setPointType = (value) => {
    const { lines, activePointIndex, activeLineIndex } = this.editor.getState();
    const ap = lines[activeLineIndex];

    // not the first point
    if (activePointIndex !== 0) {
      // let v = e.target.value;
      let v = value;

      switch (v) {
        case 'l':
          ap.points[activePointIndex] = {
            x: ap.points[activePointIndex].x,
            y: ap.points[activePointIndex].y
          };
          break;
        case 'q':
          ap.points[activePointIndex] = {
            x: ap.points[activePointIndex].x,
            y: ap.points[activePointIndex].y,
            q: {
              x: (ap.points[activePointIndex].x + ap.points[activePointIndex - 1].x) / 2,
              y: (ap.points[activePointIndex].y + ap.points[activePointIndex - 1].y) / 2
            }
          };
          break;
        case 'c':
          ap.points[activePointIndex] = {
            x: ap.points[activePointIndex].x,
            y: ap.points[activePointIndex].y,
            c: [{
                x: (ap.points[activePointIndex].x + ap.points[activePointIndex - 1].x - 50) / 2,
                y: (ap.points[activePointIndex].y + ap.points[activePointIndex - 1].y) / 2
              },
              {
                x: (ap.points[activePointIndex].x + ap.points[activePointIndex - 1].x + 50) / 2,
                y: (ap.points[activePointIndex].y + ap.points[activePointIndex - 1].y) / 2
              }
            ]
          };
          break;
        case 'a':
          ap.points[activePointIndex] = {
            x: ap.points[activePointIndex].x,
            y: ap.points[activePointIndex].y,
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

      this.editor.setState({ lines });
    }
  }


  // setArcParam = (param, e) => {
  //   const { lines, activePointIndex, activeLineIndex } = this.getState();
  //   const ap = lines[activeLineIndex];

  //   let v;

  //   if (['laf', 'sf'].indexOf(param) > -1) {
  //     v = e.target.checked ? 1 : 0;
  //   } else {
  //     v = this.positiveNumber(e.target.value);
  //   }

  //   ap.points[activePointIndex].a[param] = v;

  //   this.setState({ lines });
  // }


  // setPointPosition = (coord, e) => {
  //   const { lines, activePointIndex, activeLineIndex, w, h } = this.getState();
  //   const ap = lines[activeLineIndex];

  //   // const cstate = this.getState();

  //   const coords = ap.points[activePointIndex];
  //   let v = this.positiveNumber(e.target.value);

  //   if (coord === 'x' && v > w) v = w;
  //   if (coord === 'y' && v > h) v = h;

  //   coords[coord] = v;

  //   this.setPointCoords(coords);
  // }


  // setQuadraticPosition = (coord, e) => {
  //   const { lines, activePointIndex, activeLineIndex, w, h } = this.getState();
  //   const ap = lines[activeLineIndex];
  //   // const cstate = this.getState();

  //   const coords = ap.points[activePointIndex].q;
  //   let v = this.positiveNumber(e.target.value);

  //   if (coord === 'x' && v > w) v = w;
  //   if (coord === 'y' && v > h) v = h;

  //   coords[coord] = v;

  //   this.setQuadraticCoords(coords);
  // }

  // /**
  //  *@param {Coords} coords
  //  @param {Anchor} anchor
  //  * @param {E} e
  //  */
  // setCubicPosition = (coords, anchor, e) => {
  //     const { lines, activePointIndex, activeLineIndex, w, h } = this.getState();
  //     const activeLine = lines[activeLineIndex];
  //     let newCoords = coords;

  //     // {x: y:}
  //     const coord = activeLine.points[activePointIndex].c[anchor];
  //     let v = this.positiveNumber(e.target.value);
  // console.log(`v: ${v}`);
  //     if (coords.x && v > w) v = w;
  //     if (coords.y && v > h) v = h;
  //     console.log(`v: ${v}`);

  //     coord[coords] = v;
  // console.dir(`coords: ${coord}`);
  //     console.log(coord);
  //     this.setCubicCoords(coord, anchor);
  //   }


  removeActivePoint = () => {
    const { activePointIndex, lines, activeLineIndex } = this.editor.getState();

    if (lines[activeLineIndex].points.length > 1 && activePointIndex !== 0) {
      lines[activeLineIndex].points.splice(activePointIndex, 1);

      this.editor.setState({
        lines,
        activePointIndex: lines[activeLineIndex].points.length - 1
      });
      console.log(`Point removed`);
    }
  }


  reset = () => {
    const cstate = this.editor.getState();
    const w = cstate.w;
    const h = cstate.h;

    this.editor.setState({
      points: [{ x: w / 2, y: h / 2 }],
      activePointIndex: 0
    });
  }


  setTextInputs = () => {
    //TODO:
    console.log(`setText: ${this.editor.getState().w}`);
    // document.querySelector('#Width').value = this.getState().w;
  }

  /**
   *Creates a Line Tag
   *
   * @memberof Controls
   */
  createTag = () => {

  }


  /**
   * Render this on every State change
   * @param {object} props
   * @param {import('./Editor').State} props.state
   * param {import('./Editor').State} props.tags
   */
  render = (props) => {
    const { w, h, lines, activeLineIndex, activePointIndex, grid, tags, lineRules } = props.state;

    const active = lines[activeLineIndex].points[activePointIndex];
    const step = grid.snap ? grid.size : 1;

    let path = `d="${this.editor.generatePath(lines[activeLineIndex].points)}"`;

    /**@type {PointType} */
    let pointType = 'l';

    if (active.q) {
      // console.log(`Hello Active Q`);
      pointType = 'q';
    } else if (active.c) {
      // console.log(`Hello Active C!`);
      pointType = 'c';
    } else if (active.a) {
      // console.log(`Hello Active A!`);
      pointType = 'a';
    }

    {
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="X Radius"
      //             type="range"
      //             min={ 0 }
      //             max={ props.w }
      //             step={ step }
      //             value={ active.a.rx }
      //             onChange={ (e) => props.setArcParam("rx", e) } />
      //     </div>
      // )
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="Y Radius"
      //             type="range"
      //             min={ 0 }
      //             max={ props.h }
      //             step={ step }
      //             value={ active.a.ry }
      //             onChange={ (e) => props.setArcParam("ry", e) } />
      //     </div>
      // )
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="Rotation"
      //             type="range"
      //             min={ 0 }
      //             max={ 360 }
      //             step={ 1 }
      //             value={ active.a.rot }
      //             onChange={ (e) => props.setArcParam("rot", e) } />
      //     </div>
      // )
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="Large arc sweep flag"
      //             type="checkbox"
      //             checked={ active.a.laf }
      //             onChange={ (e) => props.setArcParam("laf", e) } />
      //     </div>
      // )
      // params.push(
      //     <div className="ad-Controls-container">
      //         <Control
      //             name="Sweep flag"
      //             type="checkbox"
      //             checked={ active.a.sf }
      //             onChange={ (e) => props.setArcParam("sf", e) } />
      //     </div>
      // )
    }


    const sections = this.sections.map(section => {

      return section.render(this.localState.ACTIVE);
    }).join('');

    return `
    <div id="controls" class="controls_wrap">
      ${this.nav.render(this.localState.ACTIVE)}
      ${sections}
    </div>
    `;
  }
}
// ${Line({ 
//   icon: LINE,
//   title: LINE,
//   active: ACTIVE,
//   activeLineIndex,
//   path,
//   tags,
//   lines,
//   pointType,
// })} 

// ${Lines({
//   icon: LINES,
//   title: LINES,
//   active: ACTIVE,
//   tags,
//   lineRules
// })}

// ${Settings({
//   icon:SETTINGS,
//   title: SETTINGS,
//   active: ACTIVE,
//   w, 
//   h, 
//   grid,
// })}

// ${Help({
//   icon:HELP,
//   title: HELP,
//   active: ACTIVE,
// })}

Controls.Render = (props) => {

};
