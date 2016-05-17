const menubar = require('menubar');
const mb = menubar({ preloadWindow: true });

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

mb.on('ready', () => {
});

