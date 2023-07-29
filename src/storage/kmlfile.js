class KmlFile {
    constructor(name, content) {
      this.name = name;
      this.dirname = "";
      this.content = content;
    }

    create(dirname) {
      localStorage.setItem(KmlFile._fileKey(this.name, dirname), this.content);
      this.dirname = dirname;
    }
  
    rename(newName) {
      localStorage.removeItem(KmlFile._fileKey(this.name, this.dirname));
      localStorage.setItem(KmlFile._fileKey(newName, this.dirname), this.content);
      this.name = newName;
    }

    reloadContent() {
      this.content = localStorage.getItem(KmlFile._fileKey(this.name, this.dirname));
    }

    rewriteContent(content) {
      localStorage.setItem(KmlFile._fileKey(this.name, this.dirname), content);
    }

    static load(name, dirname) {
      //if (!this.exists(name, dirname)) return null;
      
      const content = localStorage.getItem(this._fileKey(name, dirname));
      
      if (content === null) return;

      const file = new KmlFile(name, content);
      file.dirname = dirname;

      return file;
    }
  
    static delete(file) {
      localStorage.removeItem(this._fileKey(file.name, file.dirname));
    }

    static exists(name, dirname) {

    }

    static _fileKey(name, dirname) {
      return dirname + '.' + name;
    }
  }
  
  export default KmlFile;
  