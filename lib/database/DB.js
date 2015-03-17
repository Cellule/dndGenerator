var update = require("react/lib/update");

export default class DB {
  constructor(initialData) {
    this.data = initialData || {};
  }

  get(id, createDefaultData) {
    var d = this.data["_" + id];
    if(!d) {
      this.data["_" + id] = createDefaultData;
      d = createDefaultData;
    }
    return d;
  }

  update(id, upd) {
    var d = update(this.data["_" + id], upd);
    this.data["_" + id] = d;
    return d;
  }

  set(id, data) {
    this.data["_" + id] = data;
    return data;
  }
}
