import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { Logs, logType } from "./log.mjs";
import { fileURLToPath } from "url";

export const generateUniqueFileName = (outputPath, fileName, ext) => {
  let filePath = path.join(outputPath, `${fileName}${ext}`);
  let baseName = path.basename(filePath, ext);
  let counter = 1;
  while (fs.existsSync(filePath)) {
    filePath = path.join(outputPath, `${baseName}(${counter})${ext}`);
    counter++;
  }

  return filePath;
};

export const generateUniqueOutputTemplate = (
  outputPath,
  baseFileName,
  ext = "%(ext)s"
) => {
  let count = 0;
  let template = `${sanitizeFileName(baseFileName)}`;
  let finalTemplate = path.join(outputPath, `${template}.%(${ext}).s`);
  let finalCheckName = path.join(outputPath, `${template}.${ext}`);

  while (fs.existsSync(finalCheckName.replace("%(ext)s", ext))) {
    count++;
    template = `${sanitizeFileName(baseFileName)}(${count})`;
    finalTemplate = path.join(outputPath, `${template}.%(ext)s`);
    finalCheckName = path.join(outputPath, `${template}.${ext}`);
  }

  return finalTemplate;
};

const sanitizeFileName = (title) => {
  return title.replace(/[\/\\?%*:|"<>]/g, "_");
};

const getDefaultCookiesPath = () => {
  const home = process.env.HOME || process.env.USERPROFILE;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const candidates = [
    path.join(home, "cookies.txt"),
    path.join(home, ".config", "yt-cookies", "cookies.txt"),
    path.join(__dirname, "cookies.txt"),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      Logs(`✅ Found cookies.txt at ${p}`, logType.info);
      return p;
    }
  }

  Logs(
    "⚠️  cookies.txt not found. yt-dlp may fail on protected videos.",
    logType.warning
  );
  return null;
};

export const getVideoTitle = (ytDlpPath, youtubeUrl) => {
  return new Promise((resolve, reject) => {
    const cookiesPath = getDefaultCookiesPath();

    const command = [
      `"${ytDlpPath}"`,
      cookiesPath ? `--cookies "${cookiesPath}"` : "",
      `--user-agent "Mozilla/5.0"`,
      `--no-warnings`,
      `--print-json "${youtubeUrl}"`,
    ]
      .filter(Boolean)
      .join(" ");

    Logs(`Executing yt-dlp command: ${command}`, logType.info);

    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        Logs(`stderr: ${stderr}`, logType.error);
        return reject(`Error getting title: ${stderr}`);
      }
      try {
        const videoInfo = JSON.parse(stdout); // 解析JSON
        const sanitizedTitle = sanitizeFileName(videoInfo.title); // 清理文件名
        resolve(sanitizedTitle);
      } catch (parseError) {
        Logs(`❌ JSON parse error: ${parseError.message}`, logType.error);
        reject(`Error parsing video info: ${parseError.message}`);
      }
    });
  });
};
