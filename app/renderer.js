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

function copyTextToClipboard(e) {
  clipboard.writeText(e.target.innerHTML);
  ipc.send('hide');
}

// Display all the faces
function renderEmojis() {
  mainElem.innerHTML = faces.map((e, idx) => `<a class="emoji" tabindex="${idx}">${e}</a>`).join('');

  // Bind onclick and onkeydown "enter" to emoji elements
  const elems = $$('.emoji');
  for (let i = 0; i < elems.length; i++) {
    elems[i].onclick = copyTextToClipboard;
    elems[i].onkeydown = (e) => {
      const enterKeyCode = 13;
      if (e.which === enterKeyCode || e.keyCode === enterKeyCode) copyTextToClipboard(e);
    };
  }
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
  const emojiElems = $$('.emoji');
  const focusElem = $('.emoji:focus');
  const firstEmojiElem = $('.emoji:first-child');
  const focusIndex = Array.prototype.indexOf.call(emojiElems, focusElem);

  switch (e.which || e.keyCode) {
    case 37: // left
      // Move to the left if the focus is on the right
      if (focusIndex % 2 !== 0) emojiElems[focusIndex - 1].focus();
      break;
    case 38: // up
      // Jump backward two elements if the element is exist
      if (focusIndex - 2 >= 0) emojiElems[focusIndex - 2].focus();
      break;
    case 39: // right
      // Move to the right if the focus is on the left
      if (focusIndex % 2 === 0) emojiElems[focusIndex + 1].focus();
      break;
    case 40: // down
      // Focus on the first element, if no element was focused
      if (!focusElem) firstEmojiElem.focus();

      // Jump forward two elements if the element is exist
      else if (focusIndex + 2 < emojiElems.length) emojiElems[focusIndex + 2].focus();
      break;
    default: return;
  }
};
