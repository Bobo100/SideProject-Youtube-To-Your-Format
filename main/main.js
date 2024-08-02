const { app, BrowserWindow, ipcMain, dialog, protocol } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 960,
    height: 480,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    // npx http-server ./out -p 3000
    // 改成先執行http-server ./out -p 3000 然後再loadURL
    const serverProcess = exec(
      "npx http-server ./out -p 3001",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error starting http-server: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`http-server stderr: ${stderr}`);
          return;
        }
        console.log(`http-server stdout: ${stdout}`);
      }
    );
    win.loadURL("http://localhost:3001");
    win.webContents.openDevTools(); // 在打包环境中打开开发者工具

    win.on("closed", () => {
      win = null;
      // Terminate the server process when the window is closed
      if (serverProcess) {
        serverProcess.kill();
        serverProcess = null;
      }
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.whenReady().then(createWindow);

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
    "yt-dlp.exe"
  );
  const ffmpegPath = path.join(
    app.getAppPath(),
    "resources",
    "ffmpeg",
    "ffmpeg.exe"
  );

  const defaultPath = path.join(app.getPath("downloads"), "youtube-downloads");
  outputPath = outputPath || defaultPath;

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
