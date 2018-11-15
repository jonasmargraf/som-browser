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
// TODO: For whatever reason dev isnt' actually false when it needs to be,
// so we are creating another variable, actuallyDev, and only set it to true
// inside the if condition in createMainWindow (line 42).
// This should probably be done in a cleaner fashion.
let actuallyDev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
  // console.log('dev-mode in main.js: ' + actuallyDev)
}

function createMainWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1142,
    height: 768,
    minWidth: 1142,
    minHeight: 768,
    show: false,
    titleBarStyle: 'hidden'
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
    actuallyDev = true;
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
      // win.webContents.send('dev-mode', dev)
    }
  });

  // Emitted when the window is closed.
  win.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  return win;
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  mainWindow = createMainWindow();
  // mainWindow.webContents.send('dev-mode', dev)
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

ipcMain.on('dev-request', (event, arg) => {
  // console.log(dev)
  // console.log('dev-mode in main.js on dev-request: ' + actuallyDev)
  mainWindow.webContents.send('dev-mode', actuallyDev)
})

ipcMain.on('from-background', (event, arg) => {
  // mainWindow.webContents.send(arg.path, arg)
  mainWindow.webContents.send('features-done', arg)
})

ipcMain.on('progress', (event, arg) => {
  mainWindow.webContents.send('display-progress', arg)
  // console.log(arg)
})
//
// ipcMain.on('normalize', (event, arg) => {
//   mainWindow.webContents.send('normalize-progress', arg)
// })
//
// ipcMain.on('initialize', (event, arg) => {
//   mainWindow.webContents.send('initialize-progress', arg)
// })
//
//
// ipcMain.on('train', (event, arg) => {
//   mainWindow.webContents.send('train-progress', arg)
// })
//
//
// ipcMain.on('bestMatches', (event, arg) => {
//   mainWindow.webContents.send('bestMatches-progress', arg)
// })

ipcMain.on('from-som', (event, arg) => {
  mainWindow.webContents.send('som-done', arg)
  mainWindow.webContents.send('display-progress', 'Done.')
  // console.log(arg)
})
