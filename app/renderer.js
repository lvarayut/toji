const faces = require('cool-ascii-faces').faces;
const clipboard = require('electron').clipboard;
const ipc = require('electron').ipcRenderer;
const Config = require('electron-config');
const utils = require('./utils.js');
const conf = new Config();

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Read up all the elements
const mainElem = $('.root');
const settingsElem = $('.gear');
const backElem = $('.back');

// Display all the faces
function renderEmojis() {
  mainElem.innerHTML = faces.map(e => `<a class="emoji">${e}</a>`).join('');
}

/**
 * Setup settings page
 */
function setupSettings() {
  const submitFormElem = $('#settings');
  const toggleKeyElem = $('#toggle-key');
  toggleKeyElem.value = conf.get('toggleKey') || '';
  submitFormElem.onsubmit = (e) => {
    e.preventDefault();
    ipc.send('save-preferences', 'toggleKey', toggleKeyElem.value);
  };
}

renderEmojis();

// Bind onclick to emoji elements
const elems = $$('.emoji');
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

  setupSettings();
};

// Bind onclick to back element
backElem.onclick = () => {
  backElem.classList.add('hide');
  renderEmojis();
};

