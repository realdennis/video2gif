import { rootApp, gifEl, messageEl } from "./elements";

// Do a proxy and unify the DOM operation / Validation
// Using window.video2gif for debuging easily
window.video2gif = {};
window.video2gif.state = new Proxy(
  {},
  {
    set: (obj, prop, value) => {
      switch (prop) {
        case "ffmpegIsLoaded":
          // state ffmpegIsLoaded should not back to false
          if(obj[prop]) return true;
        case "isDraging":
          rootApp.dataset[prop] = value;
          break;
        case "gifSrc":
          gifEl.src = value;
          rootApp.dataset.canDownload = value !== "";
          break;
        case "messageText":
          messageEl.innerText = value;
          break;
        default:
          break;
      }
      obj[prop] = value;
      return true;
    },
  }
);

export const { state } = window.video2gif;
const initialState = {
  ffmpegIsLoaded: false,
  convertProcessPending: false,
  messageText: "Drop file here / Click button 📁📁📁",
  canDownload: false,
  gifSrc: "",
  isDraging: false,
};
// State initial
export const initializeState = () => Object.assign(state, initialState);
initializeState();
