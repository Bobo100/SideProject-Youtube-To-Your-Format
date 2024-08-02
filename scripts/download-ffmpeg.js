const https = require("https");
const fs = require("fs");
const path = require("path");
const extract = require("extract-zip"); // 如果ffmpeg是zip文件

function downloadFile(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https
    .get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => {
          // 验证文件大小
          fs.stat(dest, (err, stats) => {
            if (err) {
              cb(err.message);
            } else if (stats.size < 1024) {
              // 假设文件大小至少为1KB，实际情况可能不同
              fs.unlink(dest, () => {
                cb("Downloaded file is too small, likely corrupted.");
              });
            } else {
              cb();
            }
          });
        });
      });
    })
    .on("error", (err) => {
      fs.unlink(dest, () => cb(err.message));
    });
}

const ffmpegUrl =
  "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip";
const localFfmpegPath = path.join(__dirname, "local-ffmpeg.zip"); // 预先下载好的本地文件路径
const tempZipPath = path.join(__dirname, "..", "resources", "ffmpeg.zip");
const ffmpegExtractPath = path.join(__dirname, "..", "resources", "ffmpeg");

async function downloadAndExtractFFmpeg() {
  if (!fs.existsSync(ffmpegExtractPath)) {
    console.log("Downloading FFmpeg...");
    downloadFile(ffmpegUrl, tempZipPath, (err) => {
      if (err) {
        console.error(`Error downloading ffmpeg: ${err}`);
        console.log("Falling back to local file...");
        extractAndLog(localFfmpegPath);
      } else {
        console.log("Extracting FFmpeg...");
        extractAndLog(tempZipPath);
      }
    });
  } else {
    console.log("FFmpeg already exists.");
  }
}

function extractAndLog(zipPath) {
  extract(zipPath, { dir: ffmpegExtractPath }, (err) => {
    if (err) {
      console.error(`Error extracting ffmpeg: ${err}`);
    } else {
      if (zipPath !== localFfmpegPath) {
        fs.unlinkSync(zipPath); // 解压后删除 ZIP 文件
      }
      console.log("FFmpeg downloaded and extracted successfully.");
    }
  });
}

downloadAndExtractFFmpeg().catch((err) => {
  console.error(`Error: ${err.message}`);
});
