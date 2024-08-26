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

      const convertedFilePath = await convertVideo(
        inputFilePath,
        outputFormat,
        outputPath,
        ffmpegPath
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
 * Convert video to the specified format using ffmpeg.
 *
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} outputFormat - The desired output video format (e.g., mp4, avi, mkv).
 * @param {string} outputPath - The directory where the converted video will be saved.
 * @param {string} ffmpegPath - The path to the ffmpeg executable.
 * @returns {Promise<string>} - Resolves with the path to the converted video file.
 */
const convertVideo = (inputFilePath, outputFormat, outputPath, ffmpegPath) => {
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

    execProcess.stdout.on("data", (data) => {
      Logs(`stdout: ${data}`, logType.info);
    });

    execProcess.stderr.on("data", (data) => {
      Logs(`stderr: ${data}`, logType.error);
    });
  });
};
