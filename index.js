const menubar = require('menubar');
const electron = require('electron');
const path = require('path');

const ipc = electron.ipcMain;
const globalShortcut = electron.globalShortcut;
const mb = menubar({ dir: path.join(__dirname, 'app'), preloadWindow: true, icon: path.join(__dirname, 'app', 'icons', 'IconTemplate.png') });
const app = mb.app;

require('electron-debug')();

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('ready', () => {
  // register a show/hide window hotkey
  globalShortcut.register('Control+space', () => {
    if (mb.window.isVisible()) mb.hideWindow();
    else mb.showWindow();
  });
});

ipc.on('hide', () => {
  mb.hideWindow();
});

