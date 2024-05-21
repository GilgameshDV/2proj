const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os-utils');
const si = require('systeminformation');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: path.join(__dirname, "images.png"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  const platform = process.platform;
  let gpuModel = 'N/A';
  let cpuModel = 'N/A';

  try {
    const gpuInfo = await si.graphics();
    const gpuDevice = gpuInfo.controllers[0];
    gpuModel = `${gpuDevice.vendor} ${gpuDevice.model}`;
  } catch (error) {
    console.error("Error getting GPU information:", error);
  }

  try {
    const cpuInfo = await si.cpu();
    cpuModel = `${cpuInfo.manufacturer} ${cpuInfo.brand}`;
  } catch (error) {
    console.error("Error getting CPU information:", error);
  }

  setInterval(() => {
    os.cpuUsage((cpuUsage) => {
      const memUsage = ((1 - os.freememPercentage()) * 100).toFixed(2);
      const totalMem = (os.totalmem() / 1024).toFixed(2);

      mainWindow.webContents.send('system-info', {
        platform,
        gpuModel,
        cpuModel,
        cpuUsage: (cpuUsage * 100).toFixed(2),
        memUsage,
        totalMem
      });
    });
  }, 1000);
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
