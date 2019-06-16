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