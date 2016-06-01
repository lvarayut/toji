const fs = require('fs');
const path = require('path');

function loadPage(fileName) {
  return fs.readFileSync(path.join(__dirname, `${fileName}.html`));
}

module.exports = {
  loadPage
};

