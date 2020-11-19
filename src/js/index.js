import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { rootApp } from "./elements";
import { state } from "./stateManager";
const ffmpeg = createFFmpeg({ log: false });

const converter = async (file) => {
  state.messageText = "Loading ffmpeg-core.js from CDN";
  if (!state.ffmpegIsLoaded) {
    await ffmpeg.load();
    state.ffmpegIsLoaded = true;
  }

  state.messageText = "Start converting...";
  const { name } = file;
  ffmpeg.FS("writeFile", name, await fetchFile(file));
  await ffmpeg.run("-i", name, "-t", "3", "output.gif");
  state.messageText = "Complete converting!";

  // Set state
  const data = ffmpeg.FS("readFile", "output.gif");
  state.gifSrc = URL.createObjectURL(
    new Blob([data.buffer], { type: "image/gif" })
  );
};

window.addEventListener("drop", (e) => e.preventDefault(), true);
window.addEventListener("dragover", (e) => e.preventDefault(), true);
rootApp.addEventListener("drop", (e) => {
  e.preventDefault();
  const { items, files } = e.dataTransfer;
  const file = (items[0] && items[0].getAsFile()) || files[0];
  file && file.type && file.type.includes("video") && converter(file);
});
