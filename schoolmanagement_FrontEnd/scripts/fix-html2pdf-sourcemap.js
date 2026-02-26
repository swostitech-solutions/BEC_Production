const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'html2pdf.js', 'dist', 'es6-promise.map');
const content = JSON.stringify({
  version: 3,
  file: 'es6-promise.js',
  sources: [],
  names: [],
  mappings: ''
}, null, 2);

try {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (!fs.existsSync(target)) {
    fs.writeFileSync(target, content);
    console.log('Created sourcemap:', target);
  } else {
    console.log('Sourcemap already exists:', target);
  }
} catch (err) {
  console.error('Failed to create sourcemap:', err.message || err);
  // Exit with 0 so postinstall won't fail the install
  process.exit(0);
}