class MapHandler {
  constructor(map) {
    this.map = map;
    this.currentDrawControl = null;
  }

  addDrawControlAndRemoveOlds(control) {
    this.removeCurrentDrawControls();

    this.currentDrawControl = control;
    this.map.addControl(control);
  }

  removeCurrentDrawControls() {
    if (this.currentDrawControl != null) {
      this.currentDrawControl.land.editingEnabled = false;
      this.map.removeControl(this.currentDrawControl);
    }

    this.currentDrawControl = null;
  }
}

export default MapHandler;
