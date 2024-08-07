import { BrowserWindow } from "electron";
import serve from "electron-serve";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadURL = serve({ directory: "out" });

const createWindow = async (app) => {
  let win = new BrowserWindow({
    width: 960,
    height: 480,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
    },
  });

  if (app.isPackaged) {
    await loadURL(win);
    // win.webContents.openDevTools(); // 在打包环境中打开开发者工具
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }

  win.on("closed", () => {
    win = null;
  });

  return win;
};

export { createWindow };
