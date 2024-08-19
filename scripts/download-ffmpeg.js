const https = require("https");
const fs = require("fs");
const path = require("path");
const extract = require("extract-zip");
const unzipper = require("unzipper");

const ffmpegUrl =
  "https://www.gyan.dev/ffmpeg/builds/packages/ffmpeg-7.0.2-essentials_build.zip";
const tempZipPath = path.join(__dirname, "..", "resources", "ffmpeg.zip");
const ffmpegExtractPath = path.join(__dirname, "..", "resources", "ffmpeg");
const localFfmpegPath = path.join(__dirname, "local-ffmpeg.zip");

const filesToExtract = ["ffmpeg.exe", "ffplay.exe", "ffprobe.exe"];

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            `Download failed: ${response.statusCode} ${response.statusMessage}`
          );
          return;
        }

        const totalSize = parseInt(response.headers["content-length"], 10);
        let downloadedSize = 0;

        response.on("data", (chunk) => {
          downloadedSize += chunk.length;
          const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
          process.stdout.write(`\rDownloading: ${progress}%`);
        });

        response.pipe(file);

        file.on("finish", () => {
          file.close(() => {
            // Verify file size
            fs.stat(dest, (err, stats) => {
              if (err) {
                reject(`Error getting file stats: ${err.message}`);
              } else if (stats.size < 1024) {
                fs.unlink(dest, () =>
                  reject("Downloaded file is too small, likely corrupted.")
                );
              } else {
                console.log("\nDownload complete.");
                resolve();
              }
            });
          });
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => reject(`Download error: ${err.message}`));
      });
  });
}

async function extractSpecificFiles(zipPath, extractTo, filesToExtract) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on("entry", (entry) => {
        const fileName = path.basename(entry.path);
        const directory = path.dirname(entry.path);
        console.log(`fileName: ${fileName}`);
        console.log(`Directory: ${directory}`);

        // Extract only files in "ffmpeg-7.0.2-essentials_build/bin" directory
        if (
          directory === "ffmpeg-7.0.2-essentials_build/bin" &&
          filesToExtract.includes(fileName)
        ) {
          console.log("Extracting file:", fileName);
          const targetPath = path.join(extractTo, fileName);
          entry.pipe(fs.createWriteStream(targetPath));
        } else {
          console.log('Skipping file:', fileName);
          entry.autodrain();
        }
      })
      .on("close", resolve)
      .on("error", reject);
  });
}

async function extractFile(zipPath, extractTo) {
  return new Promise((resolve, reject) => {
    extract(zipPath, { dir: extractTo }, (err) => {
      if (err) {
        reject(`Extraction failed: ${err.message}`);
      } else {
        resolve();
      }
    });
  });
}

async function downloadAndExtractFFmpeg() {
  try {
    if (!fs.existsSync(ffmpegExtractPath)) {
      console.log("Downloading FFmpeg...");

      try {
        await downloadFile(ffmpegUrl, tempZipPath);
      } catch (downloadError) {
        console.error(downloadError);
        console.log("Falling back to local file...");
        // await extractFile(localFfmpegPath, ffmpegExtractPath);
        await extractSpecificFiles(
          localFfmpegPath,
          ffmpegExtractPath,
          filesToExtract
        );
        return;
      }

      console.log("Extracting FFmpeg...");
      // await extractFile(tempZipPath, ffmpegExtractPath);
      await extractSpecificFiles(
        tempZipPath,
        ffmpegExtractPath,
        filesToExtract
      );
      fs.unlinkSync(tempZipPath); // Delete the ZIP file after extraction
      console.log("FFmpeg downloaded and extracted successfully.");
    } else {
      console.log("FFmpeg already exists.");
    }
  } catch (error) {
    console.error(`Failed to download and extract FFmpeg: ${error}`);
  }
}

downloadAndExtractFFmpeg();

// 做一個解壓縮測試
// extractSpecificFiles(tempZipPath, ffmpegExtractPath, filesToExtract);
