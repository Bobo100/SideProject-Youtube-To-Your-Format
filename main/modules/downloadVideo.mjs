import { ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import log from "electron-log";

export const setupDownloadHandler = (app) => {
  ipcMain.on(
    "download-video",
    async (event, youtubeUrl, outputPath, format) => {
      log.info(`youtubeUrl: ${youtubeUrl}`);
      log.info(`outputPath: ${outputPath}`);
      log.info(`format: ${format}`);
      try {
        if (!youtubeUrl) {
          // throw new Error("No URL provided");
          //不要用throw new Error，因為這樣會返回 Error 讓我不好帶入i18n
          event.reply("download-response", "urlError");
          return;
        }

        const resourcesPath = app.isPackaged
          ? path.join(process.resourcesPath)
          : path.join(app.getAppPath());
        log.info(`resourcesPath: ${resourcesPath}`);

        const ytDlpSourcePath = path.join(
          resourcesPath,
          "resources",
          "yt-dlp",
          "yt-dlp.exe"
        );
        log.info(`ytDlpSourcePath: ${ytDlpSourcePath}`);

        const ffmpegSourcePath = path.join(
          resourcesPath,
          "resources",
          "ffmpeg",
          "ffmpeg.exe"
        );
        log.info(`ffmpegSourcePath: ${ffmpegSourcePath}`);

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
          command = `"${ytDlpSourcePath}" --ffmpeg-location "${ffmpegSourcePath}" --output "${path.join(
            outputPath,
            "%(title)s.%(ext)s"
          )}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4" --merge-output-format mp4 "${youtubeUrl}"`;
        } else if (format === "mp3") {
          command = `"${ytDlpSourcePath}" --ffmpeg-location "${ffmpegSourcePath}" --output "${path.join(
            outputPath,
            "%(title)s.%(ext)s"
          )}" -f "bestaudio[ext=m4a]/bestaudio" --extract-audio --audio-format mp3 "${youtubeUrl}"`;
        } else {
          // throw new Error("Unsupported format");
          event.reply("download-response", "formatError");
          return;
        }

        const execProcess = exec(command, { shell: true });

        // 監聽進度
        execProcess.stdout.on("data", (data) => {
          const progressMatch = data.match(/(\d+\.\d+)%/);
          if (progressMatch) {
            let progress = parseFloat(progressMatch[1]);
            // 限制進度最大值 因為要等到合成完才會100%
            if (progress >= 99) {
              progress = 99;
            }
            event.reply("download-progress", progress);
          }
          console.log(`stdout: ${data}`);
          log.info(`stdout: ${data}`);
        });

        execProcess.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
          log.error(`stderr: ${data}`);
        });

        execProcess.on("close", (code) => {
          if (code === 0) {
            event.reply("download-progress", 100);
            event.reply(
              "download-response",
              "Download and conversion complete!"
            );
          } else {
            event.reply(
              "download-response",
              `Download failed with code ${code}`
            );
          }
        });
      } catch (error) {
        console.error(`Error: ${error.message}`);
        log.error(`Error: ${error.message}`);
        event.reply("download-response", `Error: ${error.message}`);
      }
    }
  );
};
