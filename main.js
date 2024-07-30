const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("select-output-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return result.filePaths[0];
});

ipcMain.on("download-video", (event, youtubeUrl, outputPath) => {
  const ytDlpPath = path.join(
    __dirname,
    "resources",
    process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
  );
  const defaultPath = path.join(app.getPath("downloads"), "youtube-downloads");

  // If no output path is provided, use the default path
  outputPath = outputPath || defaultPath;

  // Ensure the output directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Construct command with appropriate escaping
  const command = `"${ytDlpPath}" --output "${path.join(
    outputPath,
    "%(title)s.%(ext)s"
  )}" --merge-output-format mp4 -S "vcodec:h264,res,acodec" "${youtubeUrl}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      event.reply("download-response", `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    event.reply("download-response", "Download and conversion complete!");
  });
});
