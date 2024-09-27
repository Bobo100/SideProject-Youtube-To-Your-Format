import path from "path";
import fs from "fs";
import { exec } from "child_process";

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

export const getVideoTitle = (ytDlpPath, youtubeUrl) => {
  return new Promise((resolve, reject) => {
    const command = `"${ytDlpPath}" --print-json "${youtubeUrl}"`;
    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        return reject(`Error getting title: ${stderr}`);
      }
      try {
        const videoInfo = JSON.parse(stdout); // 解析JSON
        const sanitizedTitle = sanitizeFileName(videoInfo.title); // 清理文件名
        resolve(sanitizedTitle);
      } catch (parseError) {
        reject(`Error parsing video info: ${parseError.message}`);
      }
    });
  });
};

const sanitizeFileName = (title) => {
  return title.replace(/[\/\\?%*:|"<>]/g, "_");
};
