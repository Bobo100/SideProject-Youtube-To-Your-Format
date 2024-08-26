import { app, protocol } from "electron";
import { createWindow } from "./modules/inital/createWindow.mjs";
import { startExpressServer } from "./modules/inital/startExpressServer.mjs";
import { setupDialogHandler } from "./modules/downloadPage/dialogHandler.mjs";
import { setupDownloadHandler } from "./modules/downloadPage/downloadHandler.mjs";
import { setUpSelectFileHandler } from "./modules/convertPage/selectFileHandler.mjs";
import { setupConvertHandler } from "./modules/convertPage/convertHandler.mjs";

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let serverProcess;

app.whenReady().then(async () => {
  startExpressServer();
  createWindow(app);

  // download page
  setupDialogHandler();
  setupDownloadHandler(app);

  // convert page
  setUpSelectFileHandler();
  setupConvertHandler(app);
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
