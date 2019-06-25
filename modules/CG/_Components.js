//@ts-check

/**
 * Creates Button 
 * @param {object} props 
 * @param {string} props.action
 * @param {string} props.name
 * @returns {string}
 */
export function Button(props) {
  const { action, name } = props;
  
  return `
  <button data-action="${action}"
    class="control-button">
    ${ name }
  </button>
  `;
}


export function CheckBox(props) {
  const { action, value, name } = props;

  return `
    <input type="checkbox" data-action="${action}" class="form-radio-points" id="" ${value ? 'checked' : ''}><label style="">${name}</label>
  `;
}


export function Range(props) {
  const { min, max, step, value } = props;
  // onChange={ props.onChange } />
  return `
  <div class="ad-Range">
    <input
      class="ad-Range-input"
      type="range"
      min="${ min }"
      max="${ max }"
      step="${ step }"
      value="${ value }"
      />
    <input
      class="ad-Range-text ad-Text"
      type="text"
      value="${ value }"
      />
  </div>
  `;
}
