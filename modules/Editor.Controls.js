//@ts-check
import { Control, NavComponent, ReturnTags, TagList } from './Editor.Components.js';

/**
 * @typedef {import('./Editor').anchor} anchor
 * @typedef {import('./Editor').State} State
 * @typedef {import('./Editor').Element} Element
 * @typedef {import('./Editor').default} Editor
 * @typedef {{x:number,y:number}} coords
 * @typedef {MouseEvent} e 
 */
export default class Controls {
  /**
   * @param {Editor} editor 
   * @param {Element} targetId
   */
  constructor(editor, targetId) {
    this.id = targetId;
    this.setState = editor.setState;
    this.positiveNumber = editor.positiveNumber;
    this.setPointCoords = editor.setPointCoords;
    this.setQuadraticCoords = editor.setQuadraticCoords;
    this.setCubicCoords = editor.setCubicCoords;
    this.getState = editor.getState;

    this.localState = {
      LINE: 'line',
      SAVE: 'save',
      SETTINGS: 'settings',
      HELP: 'help',
      ACTIVE: 'line',
      TAG_TO_DELETE: ''
    };

    /** CONTROLS Event Listeners */
    this.id.addEventListener('click', (e) => {
      // e.stopPropagation();
      e.preventDefault();

      const classList = [...e.target.classList];
      const id = e.target.id;
      const dataset = e.target.dataset ? e.target.dataset : 'NULL';
      const parent = e.target.parentNode;
      const parentClasses = [...parent.classList];

      //REMOVE ACTIVE POINT
      // if (classList.includes('ad-Button--removePoint')) {
      //   this.removeActivePoint();
      // } else if (classList.includes('form-radio-points')) {
      //   // console.log(`setPointType`);
      //   this.setPointType(e);
      // }

      // LINE -> BUTTON ACTIONS (addPoint, removePoint, addLine, removeLine, resetLine,...)
      let action = e.target.dataset.action;
      console.log(action);
      switch (action) {
        case 'resetLine': '';
        break;
        case 'addLine': '';
        break;
        case 'removeLine': ''
        break;
        case 'setPointType': this.setPointType(e.target.value);
        break;
        case 'addPoint': '';
        break;
        case 'removePoint': this.removeActivePoint();
        break;
        default: console.log(`No action here.`);
      }

      // if(e.target)

      //NAVIGATION ICONS
      if (classList.includes('nav_icon')) {
        //target = <nav><div id="icon_lines" class="nav_icons">

        this.activateThisIcon(e.target);
        this.showThisSection(e.target);
      }

      //SAVE -> TAGS - ADD TAG
      if (e.target.id === 'newTagText') {
        // @ts-ignore
        this.toggleAddTagFocus(e.target);
      }

      //SAVE -> TAGS - In EDITOR, the ADD TAG is handled

      //SAVE -> TAGS - REMOVE TAG when (x) clicked
      if (classList.includes('svg_tag') && dataset.tag) {
        //target = <div><svg class="svg-tag">
        //set localState so we have a handle on the tag to delete
        this.localState.TAG_TO_DELETE = dataset.tag;

        //Open Confirm Delete Dialogue
        this.toggleTagConfirmDelete();
      }

      //SAVE -> TAGS -Confirm Delete
      if (dataset.value === 'confirm-yes') {
        this.handleRemoveGlobalTag(this.localState.TAG_TO_DELETE);
        // console.log(dataset);
      } else if (dataset.value === 'confirm-no') {
        this.toggleTagConfirmDelete();
      }

      //LINE -> TAGS 
      if (parentClasses.includes('line-tag')) {
        //LINE -> TAGS - Add
        if (parent.dataset.value === 'true') {
          this.handleLineRemoveTag(parent.dataset.tag);
        }
        //LINE -> TAGS - Remove
        else if (parent.dataset.value === 'false') {
          this.handleLineAddTag(parent.dataset.tag);
        }

      }

    });
  }

  /**
   * When User clicks a Tag in Line -> Line Tags, add this Tag to the Line's Tags
   * @param {string} addTag 
   */
  handleLineAddTag(addTag) {
    const { activeLineIndex, lines } = this.getState();
    let activeLine = lines[activeLineIndex];

    activeLine.tags ? activeLine.tags : [];

    activeLine.tags.push(addTag);

    this.setState({ lines });
  }

  /**
   * When User clicks a Tag in Line -> Line Tags, remove this Tag from the Line's Tags
   * @param {string} removeTag 
   */
  handleLineRemoveTag(removeTag) {
    const { activeLineIndex, lines } = this.getState();
    let activeLine = lines[activeLineIndex];

    const filtered = activeLine.tags.filter(tag => tag !== removeTag);

    //assign the Tags to the Line
    activeLine.tags = filtered;

    this.setState({ lines });
  }


  /**
   * When user clicks (x) to delete Tag, open the Tag Confirm Dialogue
   * Toggle the active class 
   */
  toggleTagConfirmDelete() {
    const d = document.querySelector('#tagConfirmDelete');

    d.classList.toggle('active');
  }

  /**
   * When User clicks on or off on NewTag, update the text
   * @param {Element} target 
   */
  toggleAddTagFocus(target) {
    if (target.innerText) {
      target.innerText = '';
    } else {
      target.innerText = 'newTag';
    }
  }


  /**
   * When User hits Enter, add the new Tag to State
   * Called from Editor keydown Event Listener
   * @param {Element} target 
   */
  handleAddTag(target) {
    let { tags } = this.getState();

    //if all the Tags have been deleted, create a new array
    tags = tags ? tags : [];

    //Clean use input on Tag name
    const newTag = target.innerText.trim();
    //TODO: validation
    target.blur();

    //If the Tag is valid, proceed....
    if (newTag && newTag.length < 15) {
      tags.push(newTag);
      this.toggleAddTagFocus(target);
      this.setState({ tags });
    }
  }


  /**
   * When User clicks Tag's X, pop Tag from State
   * Then remove the Tag from all Lines
   * @param {string} target 'subway'
   */
  handleRemoveGlobalTag(target) {
    const { tags: gtags, lines } = this.getState();
    const cleanedTags = gtags.filter(tag => tag !== target);
    const cleanedLines = lines.map(line => {
      const cleanTags = line.tags.filter(tag => tag !== target);
      line.tags = cleanTags;
      return line;
    });

    this.setState({ tags: cleanedTags, lines: cleanedLines });
  }

  /// UI metods

  /**
   * Takes all Nav Sections and turns them on or off
   * param {Element} target -  of Controls Section
   */
  showThisSection = (target) => {
    const sections = [...document.querySelectorAll('.control-section')];

    sections.forEach(section => {
      // <div data-component="controls-section" id="section_lines">

      section.classList.remove('active_section');

      // console.log(`icon: ${section.dataset.icon}, taget id: ${target.id}`);
      if (section.dataset.icon === target.id) {
        section.classList.add('active_section');
      }
    });
  }

  /**
   * Activate the Nav when clicked
   *`Remove and add class active_nav'
   * param {Element} target
   */
  activateThisIcon = (target) => {
    //get all the NAV icons
    const icons = [...document.querySelectorAll('.nav_icon')];

    icons.forEach(icon => {
      // remove 'active_icon' from all svg icons
      icon.children[0].classList.remove('active_icon');
      // console.log(element.classList);
    });

    // make the target svg icon active
    target.children[0].classList.add('active_icon');

    const sub = target.id.substring(5);
    this.localState.ACTIVE = sub;
  }

  /** LOGIC methods */

  setHeight = (e) => {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ h: v });
  }


  setWidth = (e) => {
    let v = this.positiveNumber(e.target.value),
      min = 1;
    if (v < min) v = min;

    this.setState({ w: v });
  }


  setPointType = (value) => {
    const { lines, activePointIndex, activeLineIndex } = this.getState();
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

      this.setState({ lines });
    }
  }


  setArcParam = (param, e) => {
    const { lines, activePointIndex, activeLineIndex } = this.getState();
    const ap = lines[activeLineIndex];
    // const cstate = this.getState();

    // const points = cstate.points;
    // const active = cstate.activePointIndex;
    let v;

    if (['laf', 'sf'].indexOf(param) > -1) {
      v = e.target.checked ? 1 : 0;
    } else {
      v = this.positiveNumber(e.target.value);
    }

    ap.points[activePointIndex].a[param] = v;

    this.setState({ lines });
  }


  setPointPosition = (coord, e) => {
    const { lines, activePointIndex, activeLineIndex, w, h } = this.getState();
    const ap = lines[activeLineIndex];

    // const cstate = this.getState();

    const coords = ap.points[activePointIndex];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > w) v = w;
    if (coord === 'y' && v > h) v = h;

    coords[coord] = v;

    this.setPointCoords(coords);
  }


  setQuadraticPosition = (coord, e) => {
    const { lines, activePointIndex, activeLineIndex, w, h } = this.getState();
    const ap = lines[activeLineIndex];
    // const cstate = this.getState();

    const coords = ap.points[activePointIndex].q;
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > w) v = w;
    if (coord === 'y' && v > h) v = h;

    coords[coord] = v;

    this.setQuadraticCoords(coords);
  }


  setCubicPosition = (coord, anchor, e) => {
    const { lines, activePointIndex, activeLineIndex, w, h } = this.getState();
    const ap = lines[activeLineIndex];
    // const cstate = this.getState();

    const coords = ap.points[activePointIndex].c[anchor];
    let v = this.positiveNumber(e.target.value);

    if (coord === 'x' && v > w) v = w;
    if (coord === 'y' && v > h) v = h;

    coords[coord] = v;

    this.setCubicCoords(coords, anchor);
  }


  removeActivePoint = () => {
    const { activePointIndex, lines, activeLineIndex } = this.getState();
    // const points = cstate.points;
    // const active = cstate.activePointIndex;

    if (lines[activeLineIndex].points.length > 1 && activePointIndex !== 0) {
      lines[activeLineIndex].points.splice(activePointIndex, 1);

      this.setState({
        lines,
        activePointIndex: lines[activeLineIndex].points.length - 1
      });
    }
    console.log(`Point removed`);
  }


  reset = (e) => {
    const cstate = this.getState();
    const w = cstate.w;
    const h = cstate.h;

    this.setState({
      points: [{ x: w / 2, y: h / 2 }],
      activePointIndex: 0
    });
  }


  setTextInputs = () => {
    //TODO:
    console.log(`setText: ${this.getState().w}`);
    // document.querySelector('#Width').value = this.getState().w;
  }

  /**
   *Creates a Line Tag
   *
   * @memberof Controls
   */
  createTag = () => {

  }

  render = (props) => {
    const { w, h, lines, activeLineIndex, activePointIndex, grid, tags } = props.state;
    const active = lines[activeLineIndex].points[activePointIndex];
    const step = grid.snap ? grid.size : 1;

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

    const { LINE, SAVE, SETTINGS, HELP, ACTIVE } = this.localState;
    // console.log(`ACTIVE: ${ACTIVE}`);

    return (
      `<nav>
        ${NavComponent({
          icon:'line',
          id:`icon_${LINE}`,
          active: ACTIVE
        })}
        ${NavComponent({
          icon: 'save',
          id: `icon_${SAVE}`,
          active: ACTIVE
        })}    
        ${NavComponent({
          icon: 'settings',
          id:`icon_${SETTINGS}`,
          active: ACTIVE
        })}
        ${NavComponent({
          icon: 'help',
          id:`icon_${HELP}`,
          active: ACTIVE
        })}
      </nav>

      ${this.Line({
        id:`section_${LINE}`,
        icon:`icon_${LINE}`,
        title: LINE,
        active: ACTIVE,
        activeLineIndex,
        tags,
        lines,
        pointType
      })} 

      ${this.Save({
        id:`section_${SAVE}`,
        icon:`icon_${SAVE}`,
        title: SAVE,
        active: ACTIVE,
        tags
      })}
      
      ${this.Settings({
        id:`section_${SETTINGS}`,
        icon:`icon_${SETTINGS}`,
        title: SETTINGS,
        active: ACTIVE,
        w, 
        h, 
        grid
      })}

      ${this.Help({
        id:`section_${HELP}`,
        icon:`icon_${HELP}`,
        title: HELP,
        active: ACTIVE,
      })}
        
    `);
  }


  Title = (props) => {
    let { title } = props;

    return `
      <div class="">
          <h3 class="section-title">${title}</h3>
      </div>      
      `;
  }


  Save = (props) => {
    //id="section_save" title="save" icon="icon_save"
    const { id, title, icon, tags } = props;
    let { ACTIVE } = this.localState;
    const active = ACTIVE == title ? ' active_section' : '';

    return `
      <div data-icon="${icon}" class="control-section${active}" id="${id}">

        ${this.Title({title})}

        <div class="controls_div flex_row">
          <h3 class="">Import/Export</h3>
        </div>

        <div class="flex_row">

        ${Control({
          type:'button',
          action:'importFile',
          value:'Import JSON',
          // onclick: log()
        })}
        ${Control({
          type:'button',
          action:'exportFile',
          value:'export JSON',
          // onclick: this.removeActivePoint
          // onClick={ (e) => props.removeActivePoint(e) } />
        })}
                  
        </div>

        <div class="controls_div flex_row">
            <h3 class="ad-Controls-title">Tags</h3>
        </div>

        <div class="ad-Controls-container controls_div flex_row">
        
          ${ReturnTags({
            name:'Create Tag (x to remove)',
            tags
          })}

        </div>

        <div class="controls_div flex_row">
            <h3 class="ad-Controls-title">Display Lines</h3>
        </div>

        <div class="ad-Controls-container controls_div flex_row">
        ${Control({
          type:'button',
          action:'assignUID',
          value:'Assign UIDs',
          // onclick: this.removeActivePoint
          // onClick={ (e) => props.removeActivePoint(e) } />
        })}
        ${Control({
          name:'Line List (x to remove line)',
          type:'StaticText',
          value: ''
          // onchange:log()
        })}
        </div>

    </div>`;
  }


  Line = (props) => {
    const { pointType, title, id, icon, lines, tags, activeLineIndex } = props;
    let { ACTIVE } = this.localState;
    const active = ACTIVE == title ? ' active_section' : '';
    const parsedLine = JSON.stringify(lines[activeLineIndex], null, '  ');
    const activeLine = lines[activeLineIndex];

    return `
      <section data-icon="${icon}" class="control-section${active}" id="${id}">
        ${this.Title({title})}

        <div class="control-group">
          <span class="control-group-title">Line Functions (i)</span>
          <div class="control-row">
            ${Control({
              type: 'button',
              action: 'resetLine',
              value: 'Reset Line'
            })}
            ${Control({
              type:'button',
              action:'addLine',
              value:'Add Line',
            })}
            ${Control({
              type:'button',
              action:'removeLine',
              value:'Remove Line',
            })}
          </div>
        </div>

        <div class="control-group">
          <span class="control-group-title">Line Tags (i)</span>
          ${TagList({
            name:'Line Tags',
            tags,
            activeLine
          })}
        </div>

        <div class="control-group">
          <span class="control-group-title">Line ID (i)</span>
          ${Control({
            name:'Line ID',
            type:'EditableText',
            value: '000',
            activeLine
          })}
        </div>

      <div class="control-group">
        <span class="control-group-title">Points (i)</span>

          ${Control({
            name:'Point type',
            type:'choices',
            id:'pointType',
            choices:[
                { name: 'L', value: 'l', checked: pointType == 'l' },
                { name: 'Q', value: 'q', checked: pointType == 'q' },
                { name: 'C', value: 'c', checked: pointType == 'c' },
                { name: 'A', value: 'a', checked: pointType == 'a' }
            ]
          })}

          
        <div class="control-row">
          ${Control({
            type:'button',
            action:'addPoint',
            value:'Add',
            // onclick: log()
          })}
          ${Control({
            type:'button',
            action:'removePoint',
            value:'Remove',
            // onclick: this.removeActivePoint
            // onClick={ (e) => props.removeActivePoint(e) } />
          })} 
          </div>
        </div>

        <div class="control-group">
          <span class="control-group-title">LINE DATA (toggle JSON and <path>. Mimic https://iconsvg.xyz/) (i)</span>

          ${Control({
            name:'Line path',
            type:'StaticText',
            value: parsedLine
            // onchange:log()
          })}

        </div>
      </section>`;
  }


  Settings = (props) => {
    const { w, h, grid, title, id, icon } = props;
    let { ACTIVE } = this.localState;
    const active = ACTIVE == title ? ' active_section' : '';

    return `
      <div data-icon="${icon}" class="control-section${active}" id="${id}">
        ${this.Title({title})}

        <div class="ad-Controls-container controls_div flex_row">
        ${Control({
          name:'Width',
          type:'EditableText',
          value: w,
          // onchange:log()
        })}
        ${Control({
          name:'Height',
          type:'EditableText',
          value: h,
          // onChange={ (e) => props.setHeight(e) } />
        })}
      </div>
      <div class="ad-Controls-container controls_div flex_row">
        ${Control({
          name:'Grid size',
          type:'EditableText',
          value: grid.size
          // onChange={ (e) => props.setGridSize(e) }
        })}
        ${Control({
          name:'Snap grid',
          type:'checkbox',
          checked: grid.snap,
          // onChange={ (e) => props.setGridSnap(e) } />
        })}
        ${Control({
          name:'Show grid',
          type:'checkbox',
          checked: grid.show
          // onChange={ (e) => props.setGridShow(e) } />
        })}
      </div>

      <div class="controls_div flex_row">
        <h3 class="ad-Controls-title">JSON</h3>
      </div>

      <div class="ad-Controls-container controls_div flex_row">
      ${Control({
        name:'Show Settings State',
        type:'text',
        value: ''
        // onchange:log()
      })}
      </div>

      <div id="coords">
      </div>

    </div>`;
  }


  Help = (props) => {
    let { title, id, icon } = props;
    let { ACTIVE } = this.localState;
    const active = ACTIVE == title ? ' active_section' : '';

    return `
    <div data-icon="${icon}" class="control-section${active}" id="${id}">
        ${this.Title({title})}
      </div>
    `
  }
}
// export { Controls, addControlListeners };


Controls.Render = (props) => {

};
