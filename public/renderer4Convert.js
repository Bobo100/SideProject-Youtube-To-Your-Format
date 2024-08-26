function setupEventListeners() {
  let filePath = null; // 用於存儲選擇的文件路徑
  let isSelectingFile = false; // 用於標記是否正在選擇文件

  const selectFileButton = document.getElementById("selectFileButton");
  const selectFilePath = document.getElementById("selectFilePath");
  const convertButton = document.getElementById("convertButton");

  if (selectFileButton) {
    selectFileButton.addEventListener("click", async () => {
      if (isSelectingFile) {
        return; // 如果正在選擇文件，則不執行任何操作
      }

      isSelectingFile = true; // 正在選擇文件
      selectFileButton.disabled = true; // 禁用按鈕

      try {
        filePath = await window.electron.invoke("select-file"); // 調用主進程的 select-file 方法
        if (selectFilePath) {
          selectFilePath.innerText = filePath;
        }
      } finally {
        isSelectingFile = false; // 選擇文件結束
        selectFileButton.disabled = false; // 啟用按鈕
      }
    });
  }

  if (convertButton) {
    convertButton.addEventListener("click", async () => {
      if (!filePath) {
        console.log("No file selected");
        return;
      }

      const outputFormatSelect = document.getElementById("outputFormatSelect");
      const outputFormat = outputFormatSelect.value;

      console.log("filePath: ", filePath);
      console.log("outputFormat: ", outputFormat);

      if (outputFormat) {
        window.electron.send("convert-video", filePath, outputFormat);
      }
    });
  }
}

setupEventListeners();

window.electron.on("convert-response", (message) => {
  console.log(message); //
});

window.electron.on("convert-progress", (progress) => {
  const progressBar = document.getElementById("convert-progress");
  console.log('convert-progress', progress);
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${progress}%`;
  }
});
