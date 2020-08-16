const START_TIME = Date.now();

// node libraries
const fs = require('fs');
const path = require('path');

// third party libraries
const mustache = require('mustache');

// constants
const BUILD_DIR = `${__dirname}/build`;
const EXTENSION_DIR = `${__dirname}/extension`;

// cli arguments
const mitmUrl = process.argv[2];

const log = (message, level = 0) => console.log(`${new Array(level * 2).fill(' ').join('')}-`, message);

if (process.argv.length !== 3) {
  console.log(`Usage: node ${path.basename(__filename)} [mitm_url]`);
  process.exitCode = 1;
  return;
}

if (!/\bhttps?:\/\/.+\.[a-z]{2,}\b/.test(mitmUrl)) {
  console.log(`Error: "${mitmUrl}" is not a valid HTTP(S) URL`);
  process.exitCode = 2;
  return;
}

if (fs.existsSync(BUILD_DIR)) {
  log('🔥 Removing existing build dir');
  fs.rmdirSync(BUILD_DIR, {
    recursive: true
  });
}

log('🚧 Creating build dir');
fs.mkdirSync(BUILD_DIR);

log('🚚 Copying in static files');
fs.readdirSync(EXTENSION_DIR)
  .filter((file) => !file.endsWith('.mustache'))
  .forEach((staticFile) => {
    log(staticFile, 1);
    fs.copyFileSync(`${EXTENSION_DIR}/${staticFile}`, `${BUILD_DIR}/${staticFile}`);
  });

log('🚧 Rendering template files');
[
  ['popup.js', {
    mitmUrl
  }]
].forEach(([templateFile, data]) => {
  log(templateFile, 1);
  log(data, 2)
  const raw = fs.readFileSync(`${EXTENSION_DIR}/${templateFile}.mustache`, {
    encoding: 'utf-8'
  });
  const rendered = mustache.render(raw, data);
  fs.writeFileSync(`${BUILD_DIR}/${templateFile}`, rendered);
});

log(`🎉 Done! (${Date.now() - START_TIME}ms)`);
log(`👉 Go to chrome://extensions, enable "Developer mode" then install Zoom Downloader by clicking "Load unpacked" and selecting ${BUILD_DIR} in the file browser`);
log(`👉 If you have already installed Zoom Downloader before from ${BUILD_DIR}, there is no need to do it again, it will update automatically with the new build`);
