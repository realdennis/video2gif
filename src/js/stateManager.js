import { rootApp, gifEl, messageEl } from "./elements";

// Do a proxy and unify the DOM operation / Validation
// Using window.video2gif for debuging easily
window.video2gif = {};
window.video2gif.state = new Proxy(
  {},
  {
    set: (obj, prop, value) => {
      switch (prop) {
        case "canDownload":
          rootApp.dataset.canDownload = value;
          break;
        case "ffmpegIsLoaded":
          rootApp.dataset.ffmpegIsLoaded = value;
          break;
        case "gifSrc":
          gifEl.src = value;
          window.video2gif.state.canDownload = true;
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

// State initial
Object.assign(state, {
  ffmpegIsLoaded: false,
  convertProcessPending: false,
  messageText: "Drop file here",
  canDownload: false,
});
