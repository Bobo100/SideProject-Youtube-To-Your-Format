import { app, protocol } from "electron";
import { createWindow } from "./modules/createWindow.mjs";
import { setupDialogHandlers } from "./modules/handleDialogs.mjs";
import { setupDownloadHandler } from "./modules/downloadVideo.mjs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { exec, execSync } from "child_process";
import log from "electron-log";
import next from "next";
import { parse } from "url";
import isDev from "electron-is-dev";
import { createServer } from "http";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let serverProcess;

app.whenReady().then(async () => {
  if (app.isPackaged) {
    // const serverPath = path.join(__dirname, "..", "..");
    // log.info(`Server path: ${serverPath}`);
    // serverProcess = exec(
    //   "npx next start",
    //   { cwd: serverPath },
    //   (error, stdout, stderr) => {
    //     if (error) {
    //       log.error(`exec error: ${error}`);
    //       log.error(`stderr: ${stderr}`);
    //       return;
    //     }
    //     log.info(`stdout: ${stdout}`);
    //   }
    // );
  }

  // const nextApp = next({
  //   dev: isDev,
  //   dir: app.getAppPath() + "/src",
  // });

  // const requestHandler = nextApp.getRequestHandler();

  // // Build the renderer code and watch the files
  // await nextApp.prepare();

  // // Create a new native HTTP server (which supports hot code reloading)
  // createServer((req, res) => {
  //   const parsedUrl = parse(req.url, true);
  //   requestHandler(req, res, parsedUrl);
  // }).listen(3000, () => {
  //   console.log("> Ready on http://localhost:3000");
  // });

  createWindow(app);
  setupDialogHandlers();
  setupDownloadHandler(app);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(app);
  }
});

app.on("quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
