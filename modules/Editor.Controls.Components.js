export const Line_ = {
  LineIdComponent(id) {
    let { value = '*' } = id;
  
    return `
      <div class="control-row">
        <div data-tag="" data-value="" class="">
          <div id="lineId" class="" contenteditable="true" >${value}</div>
        </div>
      </div>
    `;
  }
  
};

export const Lines_ = {
  Rules: () => {

  }
}