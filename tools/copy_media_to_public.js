const fs = require('fs');
const path = require('path');

const srcRoot = path.resolve(__dirname, '..', 'src', 'assets');
const publicRoot = path.resolve(__dirname, '..', 'public', 'media');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log('copied', srcPath, '->', destPath);
    }
  });
}

// Copy images to public/media/img
copyRecursive(path.join(srcRoot, 'img'), path.join(publicRoot, 'img'));
// Copy videos to public/media/videos
copyRecursive(path.join(srcRoot, 'videos'), path.join(publicRoot, 'videos'));

console.log('done copying media to public/media/*');
