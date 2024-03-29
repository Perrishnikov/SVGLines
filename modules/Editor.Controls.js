//@ts-check

import Nav from './Controls.Nav.js';
import { Icon_Line, Icon_Shuffle, Icon_Settings, Icon_Help } from '../icons/index.js';
import LineFunctions from './CG/LineFunctions.js';
import TagLine from './CG/TagLine.js';
import TagManager from './CG/TagManager.js';
import PointTypes from './CG/PointTypes.js';
import LineID from './CG/LineID.js';
import Export from './CG/Export.js';
import LinePath from './CG/LinePath.js';
import CanvasSettings from './CG/CanvasSettings.js';
import  BackgroundImage from './CG/BackgroundImage.js';
import GridSettings from './CG/GridSettings.js';
import Info from './CG/Info.js';


export default class Controls {
  /**
   * @param {import('./Editor').default} editor 
   */
  constructor(editor) {
    // this.editor = editor;
    this.getState = editor.getState;
    this.setState = editor.setState;
    this.CORE = editor.CORE;
    this.validate = editor.validate;

    /**@type {LocalState} */
    this.localState = {
      LINE: 'line',
      LINES: 'lines',
      SETTINGS: 'settings',
      HELP: 'help',
      ACTIVE: 'settings',
      TAG_TO_DELETE: ''
    };

    /**
     * CONTROL GROUPS
     */
    const cg_lineId = new LineID({
      getState: this.getState,
      setState: this.setState,
    });

    const cg_lineFunctions = new LineFunctions({
      getState: this.getState,
      setState: this.setState,
      CORE: this.CORE,
    });

    const cg_tagLine = new TagLine({
      getState: this.getState,
      setState: this.setState,
      getLocalState: this.getLocalState,
      setLocalState: this.setLocalState,
    });

    const cg_tagManager = new TagManager({
      setState: this.setState,
      getState: this.getState,
      getLocalState: this.getLocalState,
      setLocalState: this.setLocalState,
    });

    const cg_pointTypes = new PointTypes({
      setState: this.setState,
      getState: this.getState,
      CORE: this.CORE,
    });

    const cg_export = new Export({
      setState: this.setState,
      getState: this.getState,
    });

    const cg_linePath = new LinePath({
      setState: this.setState,
      getState: this.getState,
      CORE: this.CORE,
    });

    const cg_canvasSettings = new CanvasSettings({
      setState: this.setState,
      getState: this.getState,
      validate: this.validate,
    });

    const cg_backgroundImage = new BackgroundImage({
      setState: this.setState,
      getState: this.getState,
    });

    const cg_gridSettings = new GridSettings({
      getState: this.getState,
      setState: this.setState,
      validate: this.validate,
    });

    const info = new Info({
      setState: this.setState,
      getState: this.getState,
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
          cg_pointTypes,
          cg_linePath,
          cg_lineId,
          cg_tagLine,
          cg_lineFunctions,
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
        controlGroups: [
          cg_gridSettings,
          cg_backgroundImage,
          cg_export,
          cg_canvasSettings,
        ],
      }),
      new Section({
        title: this.localState.HELP,
        icon: Icon_Help(),
        controlGroups: [
          info
        ],
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
      // active: this.localState.ACTIVE,
      // getActive: this.getLocalState().ACTIVE,
      setActive: this.setLocalState,
      sections: this.sections
    });
    editor.registerListener(this.nav.listeners());

  }

  getLocalState = () => {
    // console.log(this);
    return Object.assign({}, this.localState);
  }

  /**@param {object} obj */
  setLocalState = (obj) => {
    this.localState = Object.assign({}, this.localState, obj);
  }

  // handleGenerateLineId() {
  //   const { lineRules, lines } = this.editor.getState();
  //   //returns the value of the first element in the array.value
  //   /** @type {string} */
  //   const startingLineBasis = lineRules.find(rule => rule.id == 'lineStartingBasis').value;
  //   // console.log(`startingLineBasis: ${startingLineBasis}; type: ${typeof(startingLineBasis)} `);
  //   const padLength = startingLineBasis.length;

  //   /**@type {number} */
  //   let count = parseInt(startingLineBasis);
  //   // const parsed = parseInt(startingLineBasis);
  //   // if (isNaN(parsed)) { return 0; }

  //   const updatedLines = lines.map(line => {
  //     // let { id = count } = line;

  //     line.id = count.toString().padStart(padLength, '0');
  //     count++;

  //     return line;
  //   });

  //   // console.log(`startingLineBasis: ${startingLineBasis}`);
  //   this.editor.setState({
  //     lines: updatedLines,
  //     // lineRules
  //   });

  //   // console.log(this.getState());
  // }

  // handleLineRuleToggle(id) {
  //   const { lineRules } = this.editor.getState();

  //   //map all the lineRules, change enabled att if it matches
  //   const mappedLineRules = lineRules.map(rule => {
  //     if (rule.id === id) {
  //       rule.enabled = rule.enabled ? false : true;
  //     }
  //     return rule;
  //   });

  //   this.editor.setState({ lineRules: mappedLineRules });
  // }

  // handleLineIdUpdate(target) {
  //   const { lineRules = [], activeLineIndex, lines } = this.editor.getState();
  //   const activeLine = lines[activeLineIndex];

  //   const newLineId = target.innerText.trim();
  //   //TODO: validation
  //   target.blur();

  //   //If the Tag is valid, proceed....
  //   if (newLineId && newLineId.length < 15) {

  //     //Update the line's Id
  //     activeLine.id = newLineId;
  //     this.editor.setState({ lines });
  //   }
  // }



  /** LOGIC methods */
  //TODO: Move to CanvasSettings.js
  setHeight = (e) => {
    let v = this.CORE.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ h: v });
  }


  //TODO: Move to CanvasSettings.js
  setWidth = (e) => {
    let v = this.CORE.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ w: v });
  }



  /**
   * Render this on every State change
   * @param {object} props
   * @param {import('./Editor').State} props.state
   */
  render = (props) => {
    // const { h, grid, } = props.state;

    // const step = grid.snap ? grid.size : 1;

    const sections = this.sections.map(section => {
      // Sections are in Controls.Wrappers
      return section.render({
        active: this.getLocalState().ACTIVE,
        state: props.state
      });
    }).join('');

    return `
    <div id="controls" class="controls_wrap">
      ${this.nav.render(this.getLocalState().ACTIVE)}
      ${sections}
    </div>
    
    `;
  }
}

/** @type {SECTION} */
class Section {
  /**
   * Sections do not get listeners() - just Control Groups
   * @param {object} props 
   * @param {Title} props.title
   * @param {Icon} props.icon
   * @param {ControlGroups} props.controlGroups
   */
  constructor(props) {
    this.title = props.title;
    this.sectionClass = '.control-section';
    this.icon = props.icon;
    this.controlGroups = props.controlGroups;
  }

  /**
   * @param {object} props
   * @param {string} props.active - Active Section
   * @param {import('./Editor').State} props.state
   * @returns {string} HTML to render
   */
  render(props) {
    const { active, state } = props;
    const activeSec = active == this.title ? ' active_section' : '';

    const controlGroups = this.controlGroups.map(group => {

      // Control Groups return HTML from render()
      return group.render(state);
    }).join('');

    // return controlGroups;
    return `
    <section data-link="${this.title}" class="control-section${activeSec}" >
      <div class="">
        <h3 class="section-title">${this.title}</h3>
      </div>
      ${controlGroups}
    </section>`;
  }
}

/**
 * @typedef {{LINE:string, LINES:string,  SETTINGS:string, HELP:string, ACTIVE:string, TAG_TO_DELETE:string }} LocalState
 * 
 * @typedef {Array<import('./CG/xControlGroup').default>} ControlGroups
 * @typedef {string} Title
 * @typedef {string} Icon
 * 
 * @typedef {object} SECTION
 * @prop {Title} title
 * @prop {Icon} icon
 * @prop {ControlGroups} controlGroups
 */
