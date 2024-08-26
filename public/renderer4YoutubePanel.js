function setupEventListeners() {
  const selectFolderButton = document.getElementById("selectFolderButton");
  const downloadButton = document.getElementById("downloadButton");
  const youtubeUrlInput = document.getElementById("youtubeUrl");
  const outputPathInput = document.getElementById("outputPath");
  const formatSelect = document.getElementById("formatSelect");

  if (selectFolderButton) {
    selectFolderButton.addEventListener("click", async () => {
      const folderPath = await window.electron.invoke("select-output-folder");
      if (folderPath && outputPathInput) {
        outputPathInput.value = folderPath;
      }
    });
  }

  if (downloadButton && youtubeUrlInput && outputPathInput && formatSelect) {
    downloadButton.addEventListener("click", () => {
      const youtubeUrl = youtubeUrlInput.value;
      const outputPath = outputPathInput.value;
      const format = formatSelect.value;
      window.electron.send("download-video", youtubeUrl, outputPath, format);
    });
  }
}
setupEventListeners();

window.electron.on("download-response", (message) => {
  const translatedMessage = window.i18n.t(message);
  document.getElementById("status").innerText = translatedMessage;
});

window.electron.on("download-progress", (progress) => {
  const progressBar = document.getElementById("download-progress");
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${progress}%`;
  }
});
