const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  onSystemInfo: (callback) => ipcRenderer.on('system-info', (event, data) => callback(data))
});
