const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

// 检测文件或者文件夹存在
function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

function install() {
  const root = process.cwd();
  const node_modules = path.join(root, 'node_modules');
  if (fsExistsSync(node_modules)) return;

  child_process.execSync('yarn', { stdio: 'inherit', cwd: root });
}

module.exports = install;
