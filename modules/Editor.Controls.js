//@ts-check

import { Section } from './Controls.Wrappers.js';
import Nav from './Controls.Nav.js';
import { Icon_Line, Icon_Shuffle, Icon_Settings, Icon_Help } from '../icons/index.js';
import LineFunctions from './CG/LineFunctions.js';
import TagLine from './CG/TagLine.js';
import TagManager from './CG/TagManager.js';
import ControlGroup from './CG/ControlGroup.js';

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

    // const state = this.editor.getState();

    /**
     * CONTROL GROUPS
     */
    const cg_lineFunctions = new LineFunctions({
      getState: this.editor.getState,
      setState: this.editor.setState,
    });

    const cg_tagLine = new TagLine({
      // activeLine: state.lines[state.activeLineIndex],
      // tags: state.tags
      getState: this.editor.getState,
      setState: this.editor.setState,
      getLocalState: this.getLocalState.bind(this),
      setLocalState: this.setLocalState.bind(this)
    });

    const cg_tagManager = new TagManager({
      // tags: state.tags,
      setState: this.editor.setState,
      getState: this.editor.getState,
      getLocalState: this.getLocalState.bind(this),
      setLocalState: this.setLocalState.bind(this)
    });

    /**
     * SECTIONS
     * Make all the sections here. Place name in localState.
     */
    this.sections = [
      new Section({
        title: this.localState.LINE,
        icon: Icon_Line(),
        controlGroups: [
          cg_lineFunctions,
          cg_tagLine,
        ],
      }),
      new Section({
        title: this.localState.LINES,
        icon: Icon_Shuffle(),
        controlGroups: [
          cg_tagManager
        ],
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
    //- will find all the controlGroups in CG and call it's passive listener method.
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

  }

  getLocalState() {
    // console.log(this);
    return Object.assign({}, this.localState);
  }

  setLocalState(obj) {
    this.localState = Object.assign({}, this.localState, obj)
    // console.log(`TAG_TO_DELETE after update: ${this.getLocalState().TAG_TO_DELETE}`);
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



  /** LOGIC methods */
  //TODO: Move to CanvasSettings.js
  setHeight = (e) => {
    let v = this.editor.CORE.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.editor.setState({ h: v });
  }


  //TODO: Move to CanvasSettings.js
  setWidth = (e) => {
    let v = this.editor.CORE.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.editor.setState({ w: v });
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

    let path = `d="${this.editor.CORE.generatePath(lines[activeLineIndex].points)}"`;

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

      // Sections are in Controls.Wrappers
      return section.render({
        active: this.localState.ACTIVE,
        state: props.state
      });
    }).join('');

    return `
    <div id="controls" class="controls_wrap">
      ${this.nav.render(this.localState.ACTIVE)}
      ${sections}
    </div>
    `;
  }
}