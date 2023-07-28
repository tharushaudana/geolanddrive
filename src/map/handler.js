class MapHandler {
  constructor(map) {
    this.map = map;
    this.drawControls = [];
  }

  addDrawControlAndRemoveOlds(control, land) {
    this.removeCurrentDrawControls();

    this.drawControls.push({ control: control, land: land });
    this.map.addControl(control);
  }

  removeCurrentDrawControls() {
    for (var i = 0; i < this.drawControls.length; i++) {
      this.map.removeControl(this.drawControls[i].control);
      this.drawControls[i].land.editingEnabled = false;
    }

    this.drawControls = [];
  }
}

export default MapHandler;
