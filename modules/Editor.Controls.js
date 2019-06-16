//@ts-check

// import { Section } from './Controls.Wrappers.js';
import Nav from './Controls.Nav.js';
import { Icon_Line, Icon_Shuffle, Icon_Settings, Icon_Help } from '../icons/index.js';
import LineFunctions from './CG/LineFunctions.js';
import TagLine from './CG/TagLine.js';
import TagManager from './CG/TagManager.js';
import PointTypes from './CG/PointTypes.js';
import LineID from './CG/LineID.js';
import Export from './CG/Export.js';

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
 * @typedef {import('./CG/_ControlGroup').default} ControlGroup
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

    /**
     * CONTROL GROUPS
     */
    const cg_lineId = new LineID({
      getState: this.editor.getState,
      setState: this.editor.setState,
    });

    const cg_lineFunctions = new LineFunctions({
      getState: this.editor.getState,
      setState: this.editor.setState,
      CORE: this.editor.CORE,
    });

    const cg_tagLine = new TagLine({
      getState: this.editor.getState,
      setState: this.editor.setState,
      getLocalState: this.getLocalState.bind(this),
      setLocalState: this.setLocalState.bind(this)
    });

    const cg_tagManager = new TagManager({
      setState: this.editor.setState,
      getState: this.editor.getState,
      getLocalState: this.getLocalState.bind(this),
      setLocalState: this.setLocalState.bind(this)
    });

    const cg_pointTypes = new PointTypes({
      setState: this.editor.setState,
      getState: this.editor.getState,
      CORE: this.editor.CORE,
    });

    const cg_export = new Export({
      setState: this.editor.setState,
      getState: this.editor.getState,
      // CORE: this.editor.CORE,
    })

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
          cg_export
        ],
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
   */
  render = (props) => {
    const { h, grid, } = props.state;

    const step = grid.snap ? grid.size : 1;

    // let path = `d="${this.editor.CORE.generatePath(lines[activeLineIndex].points)}"`;

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


class Section {
  /**
   * Sections do not get listeners() - just Control Groups
   * @param {object} props 
   * @param {import('./Editor.Controls').Title} props.title
   * @param {string} props.icon
   * @param {Array<ControlGroup>} props.controlGroups
   */
  constructor(props) {
    this.title = props.title;
    this.sectionClass = '.control-section';
    this.icon = props.icon;
    this.controlGroups = props.controlGroups;
  }

  /**
   * @param {object} props
   * @param {Active} props.active - Active Section
   * @param {State} props.state - State
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
