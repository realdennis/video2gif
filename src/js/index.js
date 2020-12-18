import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { downloadEl, fileInputEl, gifEl, rootApp } from "./elements";
import { state, initializeState } from "./stateManager";
const ffmpeg = createFFmpeg({ log: false });

const converter = async (file) => {
  initializeState();
  if (!state.ffmpegIsLoaded) {
    state.messageText = "Loading ffmpeg-core.js 🌐🌐🌐";
    try {
      await ffmpeg.load();
      state.ffmpegIsLoaded = true;
    } catch (e) {
      state.messageText = `Error: ${e.message}`;
      return;
    }
  }

  state.messageText = "Start converting...⏳⏳⏳";
  const { name } = file;
  state.filename = name;
  ffmpeg.FS("writeFile", "VIDEO", await fetchFile(file));
  await ffmpeg.run("-i", "VIDEO", "-r", "5", "-f", "gif", "output.gif");
  state.messageText = "";

  // Set state
  const data = ffmpeg.FS("readFile", "output.gif");
  state.gifSrc = URL.createObjectURL(
    new Blob([data.buffer], { type: "image/gif" })
  );
};

gifEl.addEventListener("mousedown", (e) => e.preventDefault());
window.addEventListener("drop", (e) => e.preventDefault(), true);
window.addEventListener("dragover", (e) => e.preventDefault(), true);
rootApp.addEventListener("drop", (e) => {
  state.isDraging = false;
  state.messageText = "Dropped";
  const { items, files } = e.dataTransfer;
  const file = (items[0] && items[0].getAsFile()) || files[0];
  if (file && file.type && file.type.includes("video")) {
    converter(file);
  } else {
    state.messageText =
      "Read file failed, please check the file type is video.";
  }
});

fileInputEl.addEventListener("change", (e) => {
  const [file] = e.target.files || [];
  if (file && file.type && file.type.includes("video")) {
    converter(file);
  } else {
    state.messageText =
      "Read file failed, please check the file type is video.";
  }
});
rootApp.addEventListener(
  "dragover",
  () => {
    state.gifSrc = "";
    state.canDownload = false;
    state.isDraging = true;
    state.messageText = "Dropping...🖱️🖱️🖱️";
  },
  true
);
rootApp.addEventListener("dragleave", initializeState, true);

downloadEl.addEventListener("click", () => {
  if (state.gifSrc === "") return;
  const shadowAnchor = document.createElement("a");
  shadowAnchor.href = state.gifSrc;
  shadowAnchor.download = state.filename.split(".")[0] + ".gif";
  shadowAnchor.click();
});
