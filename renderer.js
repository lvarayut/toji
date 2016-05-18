const faces = require('cool-ascii-faces').faces;
const clipboard = require('electron').clipboard;
const ipc = require('electron').ipcRenderer;

// Display all the faces
document.querySelector('.main').innerHTML = faces.map(e => `<a class="emoji">${e}</a>`).join('');

// Add event listener
const elems = document.querySelectorAll('.emoji');
for (let i = 0; i < elems.length; i++) {
  elems[i].onclick = (e) => {
    clipboard.writeText(e.target.innerHTML);
    ipc.send('hide');
  };
}

