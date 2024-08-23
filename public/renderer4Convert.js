function setupEventListeners() {
  let filePath = null; // 用于存储 filePath 的外部变量

  const selectFileButton = document.getElementById("selectFileButton");
  const convertButton = document.getElementById("convertButton");

  if (selectFileButton) {
    selectFileButton.addEventListener("click", async () => {
      filePath = await window.electron.invoke("select-file"); // 选择文件后更新 filePath
      console.log("filePath: ", filePath);
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

window.electron.on("convert-response", (event, message) => {
  console.log(message); //
});
