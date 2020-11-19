import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: false });
const globalState = {
  ffmpegIsLoaded: false,
  convertProcessPending: false,
  messageText: '',
  gifSrc: '',
};

// Define element
const rootApp = document.getElementById("app");
const messageEl = rootApp.getElementsByClassName("message")[0],
  gifEl = rootApp.getElementsByClassName("output-gif")[0];

const trim = async (file) => {
  const { name } = file;
  messageEl.innerHTML = "Loading ffmpeg-core.js";
  if (!globalState.ffmpegIsLoaded) {
    await ffmpeg.load();
    globalState.ffmpegIsLoaded = true;
  }
  messageEl.innerHTML = "Start trimming";
  ffmpeg.FS("writeFile", name, await fetchFile(file));
  await ffmpeg.run(
    "-i",
    name,
    "-t",
    "3",
    "output.gif"
  );
  messageEl.innerHTML = "Complete trimming";
  const data = ffmpeg.FS("readFile", "output.gif");
  gifEl.src = URL.createObjectURL(
    new Blob([data.buffer], { type: "image/mp4" })
  );
};

window.addEventListener("drop", (e) => e.preventDefault(), true);
window.addEventListener("dragover", (e) => e.preventDefault(), true);
rootApp.addEventListener("drop", (e) => {
  e.preventDefault();
  const { items, files } = e.dataTransfer;
  const file = (items[0] && items[0].getAsFile()) || files[0];
  file && file.type && file.type.includes('video') && trim(file);
});
