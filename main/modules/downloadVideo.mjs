import { ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { extractExecutable } from "./extractExecutable.mjs";

export const setupDownloadHandler = (app) => {
  ipcMain.on(
    "download-video",
    async (event, youtubeUrl, outputPath, format) => {
      try {
        if (!youtubeUrl) {
          // throw new Error("No URL provided");
          //不要用throw new Error，因為這樣會返回 Error 讓我不好帶入i18n
          event.reply("download-response", "urlError");
          return;
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

        let command;
        if (format === "mp4") {
          command = `"${ytDlpPath}" --ffmpeg-location "${ffmpegPath}" --output "${path.join(
            outputPath,
            "%(title)s.%(ext)s"
          )}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4" --merge-output-format mp4 "${youtubeUrl}"`;
        } else if (format === "mp3") {
          command = `"${ytDlpPath}" --ffmpeg-location "${ffmpegPath}" --output "${path.join(
            outputPath,
            "%(title)s.%(ext)s"
          )}" -f "bestaudio[ext=m4a]/bestaudio" --extract-audio --audio-format mp3 "${youtubeUrl}"`;
        } else {
          // throw new Error("Unsupported format");
          event.reply("download-response", "formatError");
          return;
        }

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
    }
  );
};
