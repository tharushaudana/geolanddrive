class MapHandler {
  constructor(map) {
    this.map = map;
    this.drawControls = [];
  }

  addDrawControlAndRemoveOlds(control) {
    for (var i = 0; i < this.drawControls.length; i++) {
        console.log("sdsd");
      this.map.removeControl(this.drawControls[i]);
    }

    this.drawControls = [];

    this.drawControls.push(control);
    this.map.addControl(control);
  }
}

export default MapHandler;
