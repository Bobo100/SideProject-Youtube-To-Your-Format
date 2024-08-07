import { app, BrowserWindow, ipcMain, dialog, protocol } from "electron";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import serve from "electron-serve";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

const loadURL = serve({ directory: "out" });

const extractExecutable = (source, destination) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(destination)) {
      fs.copyFile(source, destination, (err) => {
        if (err) reject(err);
        resolve(destination);
      });
    } else {
      resolve(destination);
    }
  });
};

const createWindow = async () => {
  let win = new BrowserWindow({
    width: 960,
    height: 480,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    await loadURL(win);
    win.webContents.openDevTools(); // 在打包环境中打开开发者工具
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

ipcMain.on("download-video", async (event, youtubeUrl, outputPath) => {
  try {
    if (!youtubeUrl) {
      throw new Error("No URL provided");
    }

    const resourcesPath = app.isPackaged
      ? path.join(process.resourcesPath, "..", "..")
      : path.join(app.getAppPath());

    const ytDlpSourcePath = path.join(
      resourcesPath,
      "resources",
      "yt-dlp",
      "yt-dlp.exe"
    );
    const ffmpegSourcePath = path.join(
      resourcesPath,
      "resources",
      "ffmpeg",
      "ffmpeg.exe"
    );

    const tempPath = app.getPath("temp");
    const ytDlpPath = path.join(tempPath, "yt-dlp.exe");
    const ffmpegPath = path.join(tempPath, "ffmpeg.exe");

    await extractExecutable(ytDlpSourcePath, ytDlpPath);
    await extractExecutable(ffmpegSourcePath, ffmpegPath);

    const defaultPath = path.join(
      app.getPath("downloads"),
      "youtube-downloads"
    );
    outputPath = outputPath || defaultPath;

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const command = `"${ytDlpPath}" --ffmpeg-location "${ffmpegPath}" --output "${path.join(
      outputPath,
      "%(title)s.%(ext)s"
    )}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4" --merge-output-format mp4 "${youtubeUrl}"`;

    console.log("command:", command);

    exec(command, { shell: true }, (error, stdout, stderr) => {
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
  } catch (error) {
    console.error(`Error: ${error.message}`);
    event.reply("download-response", `Error: ${error.message}`);
  }
});
