'use strict';

// Import parts of electron to use
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

function createMainWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 722,
    minWidth: 1200,
    minHeight: 722,
    show: false
  });

  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  win.loadURL( indexPath );

  // Don't show until we are ready and loaded
  win.once('ready-to-show', () => {
    win.show();
    // Open the DevTools automatically if developing
    if ( dev ) {
      win.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  win.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // backgroundWindow = null;
    mainWindow = null;
    // win = null;
  });

  return win;
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  mainWindow = createMainWindow();
  // backgroundWindow = createBackgroundWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow();
  }
});

ipcMain.on('from-background', (event, arg) => {
  // mainWindow.webContents.send(arg.path, arg)
  mainWindow.webContents.send('features-done', arg)
})

ipcMain.on('from-som', (event, arg) => {
  mainWindow.webContents.send('som-done', arg)
  // console.log(arg)
})
