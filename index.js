const menubar = require('menubar');
const ipc = require('electron').ipcMain;
const mb = menubar({ preloadWindow: true, icon: __dirname + '/IconTemplate.png' });

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

ipc.on('hide', () => {
  mb.hideWindow();
});

