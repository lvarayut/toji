const menubar = require('menubar');
const ipc = require('electron').ipcMain;
const path = require('path');
const mb = menubar({ preloadWindow: true, icon: path.join(__dirname, 'icons', 'IconTemplate.png') });

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

ipc.on('hide', () => {
  mb.hideWindow();
});

