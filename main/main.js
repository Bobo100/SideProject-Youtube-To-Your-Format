const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
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
