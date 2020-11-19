import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { downloadEl, rootApp } from "./elements";
import { state } from "./stateManager";
const ffmpeg = createFFmpeg({ log: false });

const converter = async (file) => {
  state.canDownload = false;
  if (!state.ffmpegIsLoaded) {
    state.messageText = "Loading ffmpeg-core.js from CDN 🌐🌐🌐";
    await ffmpeg.load();
    state.ffmpegIsLoaded = true;
  }

  state.messageText = "Start converting...⏳⏳⏳";
  const { name } = file;
  state.filename = name;
  ffmpeg.FS("writeFile", name, await fetchFile(file));
  await ffmpeg.run("-i", name, "-t", "3", "output.gif");
  state.messageText = "";

  // Set state
  const data = ffmpeg.FS("readFile", "output.gif");
  state.gifSrc = URL.createObjectURL(
    new Blob([data.buffer], { type: "image/gif" })
  );
};

window.addEventListener("drop", (e) => e.preventDefault(), true);
window.addEventListener("dragover", (e) => e.preventDefault(), true);
rootApp.addEventListener("drop", (e) => {
  state.isDraging = false;
  const { items, files } = e.dataTransfer;
  const file = (items[0] && items[0].getAsFile()) || files[0];
  file && file.type && file.type.includes("video") && converter(file);
});
rootApp.addEventListener(
  "dragover",
  () => {
    state.gifSrc = '';
    state.canDownload = false;
    state.isDraging = true;
    state.messageText = "Dropping...🖱️🖱️🖱️"
  },
  true
);
rootApp.addEventListener("dragleave", () => (state.isDraging = false), true);

downloadEl.addEventListener("click", () => {
  if (state.gifSrc === "") return;
  const shadowAnchor = document.createElement("a");
  shadowAnchor.href = state.gifSrc;
  shadowAnchor.download = state.filename.split(".")[0] + ".gif";
  shadowAnchor.click();
});
