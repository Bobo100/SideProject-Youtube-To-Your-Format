import { app, protocol } from "electron";
import { createWindow } from "./modules/createWindow.mjs";
import { setupDialogHandlers } from "./modules/handleDialogs.mjs";
import { setupDownloadHandler } from "./modules/downloadVideo.mjs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { exec } from "child_process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let serverProcess;

app.whenReady().then(() => {
  if (app.isPackaged) {
    const serverPath = path.join(__dirname, "..");
    console.log(`Server path: ${serverPath}`);
    serverProcess = exec(
      "npx next start",
      { cwd: serverPath },
      (error, stdout, stderr) => {
        if (error) {
          console.log(serverPath);
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );
  }

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
