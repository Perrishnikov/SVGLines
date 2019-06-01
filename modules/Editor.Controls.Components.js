export const Line_ = {
  LineIdComponent(id) {
    let { value = '*' } = id;

    return `
      <div class="control-row">
        <div data-tag="" data-value="" class="">
          <div id="lineId" class="textInput" contenteditable="true" >${value}</div>
        </div>
      </div>
    `;
  }
};


export const Lines_ = {

  Rules: (props) => {
    const { rules } = props;
    // console.log(rules);

    const mappedRules = rules.map((rule, i) => {
      const { id, name, type, enabled, value, info } = rule;

      switch (type) {
        case 'checkbox':
          return `
          <div class="flex_row">
            <input data-action="lineRules" type="checkbox" name="" value="${id}" ${ enabled ? 'checked' : ''} id="${id}" class="form-radio-points">
            <label class="choices-label" for="">${ name }</label>
          </div>`;
        case 'text':
          return `
          <div class="flex-row">
            <div id="${id}" style="display:inline-block" class="textInput" contenteditable="true" >${value}</div>
            <span style="margin-left:-8px;">${name}</span>
        </div>`;
      }
    }).join('');

    return `
    <div class="flex_column">
      ${ mappedRules }
    </div>
  `;
  }
}
