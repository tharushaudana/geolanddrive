import { ref } from "vue";
import dirHandler from "./dirhandler";
import Dir from "./dir";

const dirs = ref([]);
var selectedDir = ref(null);

const indexOfDir = (name) => dirs.value.findIndex((dir) => dir.name === name);

dirHandler.init((dir) => {
  dirs.value.push(dir);
});

function selectDir(name) {
  if (!isDirExists(name)) return;
  selectedDir.value = dirHandler.getDirByName(name);
}

function createDir(name) {
  if (isDirExists(name)) return;
  dirs.value.push(Dir.create(name, dirHandler));
}

function deleteDir(dir) {
  Dir.delete(dir);
  dirs.value.splice(indexOfDir(dir.name, 1));
}

function isDirExists(name) {
  return dirHandler.isDirExists(name);
}

const storage = {
  selectDir: selectDir,
  createDir: createDir,
  deleteDir: deleteDir,
  isDirExists: isDirExists,
};

export { storage, dirs, selectedDir, };
