const menubar = require('menubar');
const electron = require('electron');
const path = require('path');
const Config = require('electron-config');
const AutoLaunch = require('auto-launch');

const ipc = electron.ipcMain;
const globalShortcut = electron.globalShortcut;
const shell = electron.shell;
const mb = menubar({ dir: path.join(__dirname, 'app'), preloadWindow: true, icon: path.join(__dirname, 'app', 'icons', 'IconTemplate.png') });
const app = mb.app;
const conf = new Config();
const autoLauncher = new AutoLaunch({
  name: 'Toji',
  path: process.execPath.match(/.*?\.app/)[0]
});

require('electron-debug')();

function setGlobalShortcut() {
  const toggleKey = conf.get('toggleKey') || 'CommandOrControl+Space';
  globalShortcut.register(toggleKey, () => {
    if (mb.window.isVisible()) mb.hideWindow();
    else mb.showWindow();
  });
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('ready', () => {
  // register a show/hide window hotkey
  setGlobalShortcut();

  mb.window.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });
});

ipc.on('set-toggle-key', (event, key, value) => {
  conf.set(key, value);
  globalShortcut.unregisterAll();
  setGlobalShortcut();
});

ipc.on('hide', () => {
  mb.hideWindow();
});

ipc.on('enable-login', () => {
  autoLauncher.enable();
});

ipc.on('disable-login', () => {
  autoLauncher.disable();
});
