import KmlFile from "./kmlfile";

class Dir {
  constructor(name, handler) {
    this.name = name;
    this.files = [];
    this.handler = handler;
  }

  loadFiles() {
    for (var i = 0; i < this.handler.data[this.name].length; i++) {
      const fname = this.handler.data[this.name][i];
      this.files.push(KmlFile.load(fname, this.name));
    }
    console.log(this.files);
  }

  addFile(file) {
    file.create(this.name);
    //----
    if (!this.handler.data[this.name].includes(file.name)) {
        this.handler.data[this.name].push(file.name);
        this.files.push(file);
    }
    this.handler.saveChanges();
  }

  rename(newName) {
    delete this.handler.data[this.name];
    this.handler.data[newName] = this.files;
    this.handler.saveChanges();
    this.name = newName;
  }

  renameFile(file) {
    // Not completed yet :(
    const indexOfFile = this.files.value.findIndex((f) => f.name === file.name);

    if (indexOfFile < 0) return;

    //KmlFile.delete(file);
    //this.files.value.splice(indexOfFile, 1);  
  }

  deleteFile(file) {
    const indexOfFile = this.files.findIndex((f) => f.name === file.name);

    if (indexOfFile < 0) return;

    KmlFile.delete(file);
    this.files.splice(indexOfFile, 1);
    //----
    this.handler.data[this.name].splice(indexOfFile, 1);
    this.handler.saveChanges();
  }

  static delete(dir) {
    delete dir.handler.data[dir.name];
    dir.handler.saveChanges();
  }

  static create(name, handler) {
    handler.data[name] = [];
    console.log(handler.data);
    handler.saveChanges();
    return new Dir(name, handler);
  }
}

export default Dir;
