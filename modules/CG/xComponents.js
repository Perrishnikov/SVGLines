//@ts-check

/**
 * Creates Button 
 * @param {object} props 
 * @param {string} props.dataAction
 * @param {string} props.name
 * @param {string} [props.info] - tooltip
 * @returns {string}
 */
export function Button(props) {
  const { dataAction, name, info = null } = props;

  return `
  <button ${info ? `data-tooltip="${info}"` : ''} data-action="${dataAction}"
    class="control-button">
    ${ name }
  </button>
  `;
}


/**
 * 
 * @param {object} props 
 * @param {string} props.dataType - added to DOM "data-${type}" (Category)
 * @param {string} [props.dataAction] - data-${action}
 * @param {0|1|boolean} props.value - checked er no 
 * @param {string} props.name - label DOM
 * @param {string} [props.info] - tooltip
 */
export function CheckBox(props) {
  const {
    dataAction = null,
      value,
      name,
      dataType,
      info = null,
  } = props;

  return `
    <input type="checkbox" data-type="${dataType}" data-action="${dataAction ? dataAction : ''}" class="form-radio-points" id="" ${value ? 'checked' : ''}><label ${info ? `data-tooltip="${info}"` : ''} style="">${name}</label>
  `;
}

/**
 * 
 * @param {object} props
 * @param {string} props.dataType 
 * @param {string} [props.dataAction] - data-${action}
 * @param {number} props.value
 * @param {number} props.min
 * @param {number} props.max
 * @param {number} [props.step]
 * @param {string} props.name - label
 * @param {string} [props.id] - capture for ondragstart
 * param {string} props.id - need id
 */
export function Range(props) {
  const { min, max, step = (min + max) / 2, name, dataAction = '', dataType, value, id = null } = props;
  // onChange={ props.onChange } />
  return `
  <div class="ad-Range" >
    <input
      id= ${id}
      data-type="${dataType}"
      data-action="${dataAction}"
      class="ad-Range-input"
      type="range"
      min="${ min }"
      max="${ max }"
      step="${ step }"
      value="${value}"
      >
    <label>${name} : ${value} </label>
  </div>
  `;
}
