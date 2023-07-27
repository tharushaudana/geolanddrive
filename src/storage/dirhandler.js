import { ref } from "vue";
import Dir from "./dir";

var data = {};

function init(cb) {
  const json = localStorage.getItem("dirs");

  if (json === null) return;

  for (const [key, value] of Object.entries(JSON.parse(json))) {
    data[key] = value;
    //-----
    const dir = new Dir(key, this);
    cb(dir);
  }
}

function getDirByName(name) {
  const dir = new Dir(name, this);
  return dir;
}

function isDirExists(name) {
  return name in data;
}

function saveChanges() {
  localStorage.setItem("dirs", JSON.stringify(data));
}

const dirHandler = {
  init: init,
  getDirByName: getDirByName,
  isDirExists: isDirExists,
  saveChanges: saveChanges,
  data: data,
};

export default dirHandler;
