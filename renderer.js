const faces = require('cool-ascii-faces').faces;
const clipboard = require('electron').clipboard;
const ipc = require('electron').ipcRenderer;
const utils = require('./utils.js');

// Read up all the elements
const mainElem = document.querySelector('.root');
const settingsElem = document.querySelector('.settings');
const backElem = document.querySelector('.back');

// Display all the faces
function renderEmojis() {
  mainElem.innerHTML = faces.map(e => `<a class="emoji">${e}</a>`).join('');
}

// Bind onclick to emoji elements
const elems = document.querySelectorAll('.emoji');
for (let i = 0; i < elems.length; i++) {
  elems[i].onclick = (e) => {
    clipboard.writeText(e.target.innerHTML);
    ipc.send('hide');
  };
}

// Bind onclick to settings element
settingsElem.onclick = () => {
  mainElem.innerHTML = utils.loadPage('settings');
  backElem.classList.remove('hide');
};

// Bind onclick to back element
backElem.onclick = () => {
  backElem.classList.add('hide');
  renderEmojis();
};

renderEmojis();

