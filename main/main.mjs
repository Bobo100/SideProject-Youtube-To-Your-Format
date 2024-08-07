import { app, protocol } from "electron";
import { createWindow } from "./modules/createWindow.mjs";
import { setupDialogHandlers } from "./modules/handleDialogs.mjs";
import { setupDownloadHandler } from "./modules/downloadVideo.mjs";

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

app.whenReady().then(() => {
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
