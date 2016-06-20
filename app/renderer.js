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
const quitElem = $('.quit');
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
  const onoffLogin = $('#onoff-login');
  const btnSaveElem = $('#btn-save');
  toggleKeyElem.value = conf.get('toggleKey') || '';
  submitFormElem.onsubmit = (e) => {
    e.preventDefault();
    ipc.send('set-toggle-key', 'toggleKey', toggleKeyElem.value);

    if (onoffLogin.checked) ipc.send('enable-login');
    else ipc.send('disable-login');
    btnSaveElem.innerHTML = '<i class="fa fa-check-circle-o"></i> Saved';
  };

  // Reset the text of save button when any fields in the form changed
  toggleKeyElem.onkeydown = () => {
    btnSaveElem.innerHTML = 'Save';
  };
  onoffLogin.onchange = () => {
    btnSaveElem.innerHTML = 'Save';
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

quitElem.onclick = () => {
  ipc.send('quit');
};

document.onkeydown = (e) => {
  e.preventDefault();

  switch (e.which || e.keyCode) {
    case 37: // left
      break;
    case 38: // up
      break;
    case 39: // right
      break;
    case 40: // down
      break;
    default: return;
  }
};
