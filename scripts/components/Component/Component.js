export class Component {
  on(eventType, callback) {
    this._el.addEventListener(eventType, callback);
  }
}