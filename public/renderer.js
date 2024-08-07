document
  .getElementById("selectFolderButton")
  .addEventListener("click", async () => {
    const folderPath = await window.electron.invoke("select-output-folder");
    if (folderPath) {
      document.getElementById("outputPath").value = folderPath;
    }
  });

document.getElementById("downloadButton").addEventListener("click", () => {
  const youtubeUrl = document.getElementById("youtubeUrl").value;
  const outputPath = document.getElementById("outputPath").value;
  const format = document.getElementById("formatSelect").value;
  window.electron.send("download-video", youtubeUrl, outputPath, format);
});

window.electron.on("download-response", (message) => {
  document.getElementById("status").innerText = message;
});
