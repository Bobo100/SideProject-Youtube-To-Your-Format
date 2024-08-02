const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 960,
    height: 480,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    const serve = (await import("electron-serve")).default;
    const appServe = serve({ directory: path.join(__dirname, "../out") });

    await appServe(win);
    win.loadURL("app://-");
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
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
    app.getAppPath(),
    "resources",
    "yt-dlp",
    process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp"
  );
  const ffmpegPath = path.join(
    app.getAppPath(),
    "resources",
    "ffmpeg",
    process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
  );

  const defaultPath = path.join(app.getPath("downloads"), "youtube-downloads");

  // If no output path is provided, use the default path
  outputPath = outputPath || defaultPath;

  // Ensure the output directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  // Construct command with appropriate escaping
  const command = `"${ytDlpPath}" --ffmpeg-location "${ffmpegPath}" --output "${path.join(
    outputPath,
    "%(title)s.%(ext)s"
  )}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4" --merge-output-format mp4 "${youtubeUrl}"`;

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
