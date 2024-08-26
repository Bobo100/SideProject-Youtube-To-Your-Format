import { ipcMain, dialog } from "electron";
import path from "path";
import { exec } from "child_process";
import { Logs, logType } from "../../utils/log.mjs";

export const setupConvertHandler = (app) => {
  ipcMain.on("convert-video", async (event, inputFilePath, outputFormat) => {
    Logs(`Input file path: ${inputFilePath}`, logType.info);
    Logs(`Output format: ${outputFormat}`, logType.info);

    try {
      const resourcesPath = app.isPackaged
        ? path.join(process.resourcesPath)
        : path.join(app.getAppPath());

      const ffmpegPath = path.join(
        resourcesPath,
        "resources",
        "ffmpeg",
        "ffmpeg.exe"
      );
      Logs(`FFmpeg path: ${ffmpegPath}`, logType.info);

      const outputPath = path.dirname(inputFilePath);

      const duration = await getVideoDuration(inputFilePath, ffmpegPath);

      const convertedFilePath = await convertVideo(
        inputFilePath,
        outputFormat,
        outputPath,
        ffmpegPath,
        duration,
        event
      );

      event.reply(
        "convert-response",
        `Video converted successfully: ${convertedFilePath}`
      );
      Logs(`Video converted successfully: ${convertedFilePath}`, logType.info);
    } catch (error) {
      Logs(`Error during conversion: ${error.message}`, logType.error);
      event.reply("convert-response", `Conversion failed: ${error.message}`);
    }
  });
};

/**
 * Get video duration using ffmpeg.
 *
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} ffmpegPath - The path to the ffmpeg executable.
 * @returns {Promise<number>} - Resolves with the duration of the video in seconds.
 */
const getVideoDuration = (inputFilePath, ffmpegPath) => {
  return new Promise((resolve, reject) => {
    const command = `"${ffmpegPath}" -i "${inputFilePath}"`;

    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        const durationMatch = stderr.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
        if (durationMatch) {
          const hours = parseInt(durationMatch[1], 10);
          const minutes = parseInt(durationMatch[2], 10);
          const seconds = parseFloat(durationMatch[3]);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          resolve(totalSeconds);
        } else {
          reject(new Error("Could not determine video duration"));
        }
      }
    });
  });
};

/**
 * Convert video to the specified format using ffmpeg.
 *
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} outputFormat - The desired output video format (e.g., mp4, avi, mkv).
 * @param {string} outputPath - The directory where the converted video will be saved.
 * @param {string} ffmpegPath - The path to the ffmpeg executable.
 * @param {number} duration - The duration of the video in seconds.
 * @returns {Promise<string>} - Resolves with the path to the converted video file.
 */
const convertVideo = (
  inputFilePath,
  outputFormat,
  outputPath,
  ffmpegPath,
  duration,
  event
) => {
  return new Promise((resolve, reject) => {
    const inputFileName = path.basename(
      inputFilePath,
      path.extname(inputFilePath)
    );
    const outputFilePath = path.join(
      outputPath,
      `${inputFileName}.${outputFormat}`
    );
    Logs(`Output file path: ${outputFilePath}`, logType.info);

    const command = `"${ffmpegPath}" -i "${inputFilePath}" "${outputFilePath}"`;

    Logs(`Executing command: ${command}`, logType.info);

    const execProcess = exec(
      command,
      { shell: true },
      (error, stdout, stderr) => {
        if (error) {
          Logs(`Conversion failed: ${error.message}`, logType.error);
          return reject(error);
        }

        Logs(`Conversion output: ${stdout}`, logType.info);
        Logs(`Conversion stderr: ${stderr}`, logType.error);

        resolve(outputFilePath);
      }
    );

    execProcess.stderr.on("data", (data) => {
      const timeMatch = data.match(/time=(\d+):(\d+):(\d+\.\d+)/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const seconds = parseFloat(timeMatch[3]);
        const currentTime = hours * 3600 + minutes * 60 + seconds;

        const progress = (currentTime / duration) * 100;
        Logs(`Progress: ${progress.toFixed(2)}%`, logType.info);
        event.reply("convert-progress", progress.toFixed(2));
      }
    });

    execProcess.on("close", (code) => {
      if (code === 0) {
        event.reply("convert-progress", 100);
        event.reply("convert-response", "Conversion complete!");
      } else {
        event.reply("convert-response", `Conversion failed with code ${code}`);
      }
    });
  });
};
