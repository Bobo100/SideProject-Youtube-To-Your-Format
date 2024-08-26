import { dialog, ipcMain } from 'electron';

export const setupDialogHandler = () => {
  ipcMain.handle('select-output-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    return result.filePaths[0];
  });
};
