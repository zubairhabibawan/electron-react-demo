const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Correct path to preload.js
            nodeIntegration: true,                      // Disable nodeIntegration for security
            contextIsolation: true,                      // Enable contextIsolation for contextBridge
            enableRemoteModule: true                     // If needed (Electron 10+), otherwise avoid using it
        },
    });

    win.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html')).catch(err => {
        console.error("Failed to load index.html:", err);
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    const schedulerPath = path.join(__dirname, 'backend', 'scheduler.js');
    const schedulerProcess = fork(schedulerPath);

    schedulerProcess.on('message', (data) => {
        console.log("Message received from scheduler:", data);
        if (data) {
            BrowserWindow.getAllWindows()[0].webContents.send('file-scheduler', data);
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

