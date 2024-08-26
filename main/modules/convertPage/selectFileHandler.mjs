import { ipcMain, dialog } from "electron";

export const setUpSelectFileHandler = () => {
  ipcMain.handle("select-file", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
    });

    if (canceled) {
      return null;
    } else {
      return filePaths[0]; // 返回選擇的文件路徑
    }
  });
};
