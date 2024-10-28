const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    onFileScheduler: (callback) => ipcRenderer.on('file-scheduler', (event, data) => callback(data)),
});
