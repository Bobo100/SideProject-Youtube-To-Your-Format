import { dialog, ipcMain } from 'electron';

export const setupDialogHandlers = () => {
  console.log('setupDialogHandlers');
  ipcMain.handle('select-output-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    return result.filePaths[0];
  });
};
