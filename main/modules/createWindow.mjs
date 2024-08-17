import { BrowserWindow } from "electron";
import serve from "electron-serve";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
// import { spawn } from "child_process";
import log from "electron-log";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverPath = path.join(__dirname, "..", "..", "..", "out");
const appServe = serve({
  directory: serverPath,
});

const createWindow = async (app) => {
  let win = new BrowserWindow({
    width: 960,
    height: 480,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
    },
  });

  if (app.isPackaged) {
    // await loadURL(win);
    // win.loadURL("http://localhost:3000"); // => 改用npx next start啟動next.js伺服器了 所以有網址
    // win.webContents.openDevTools(); // 在打包环境中打开开发者工具

    // const { spawn } = await import("child_process");
    // const server = spawn("npx", ["next", "start"], {
    //   cwd: path.join(__dirname, "..", ".."), // 项目根目录
    //   shell: true,
    // });
    // log.info(`Next.js: Starting server in ${path.join(__dirname, "..", "..")}`);
    // server.stdout.on("data", (data) => {
    //   log.info(`Next.js: ${data}`);
    // });
    // server.stderr.on("data", (data) => {
    //   log.error(`Next.js Error: ${data}`);
    // });

    log.info("Next.js: Starting server", serverPath);

    appServe(win).then(() => {
      win.loadURL("app://-");
    });
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
