import { Component } from '../Component/Component.js';

export class Filter extends Component {
  constructor({ element }) {
    super();
    this._el = element;
    this._render();

    this.on('input', debounce(e => {
      let { value } = e.target;
      let filterEvent = new CustomEvent('filter', {
        detail: value.toLowerCase(),
      });
      this._el.dispatchEvent(filterEvent);

    }, 300));
  }

  _render() {
    this._el.innerHTML = `
          <div class="input-field col s4">
              <input type="text">
              <label>Filter</label>
          </div>
      `
  }
}

function debounce(f, delay) {
  let timerId;

  return function wrapper(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => { f.apply(this, args); }, delay);
  }
}