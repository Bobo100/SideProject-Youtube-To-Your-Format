import { ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { extractExecutable } from "./extractExecutable.mjs";

export const setupDownloadHandler = (app) => {
  console.log("setupDownloadHandler");
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
};
