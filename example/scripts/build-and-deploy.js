const yarnInstall = require('./utils/yarn-install');
// 如果没有安装依赖, 先安装依赖
yarnInstall();

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const paths = require('../config/paths');
const child_process = require('child_process');
const loadDeployEnv = require('./utils/load-deploy-env');

function printSegment(title) {
  console.log(chalk.magenta(`---------------------------${title}---------------------------`));
}

function buildAndDeploy(whichDeploy) {
  // project build
  printSegment('project build');
  child_process.execSync('yarn build', { stdio: 'inherit' });
  // deploy
  printSegment('deploy');
  child_process.execSync(`yarn deploy ${whichDeploy}`, { stdio: 'inherit' });
}

async function run() {
  const whichDeploy = await loadDeployEnv();
  buildAndDeploy(whichDeploy);
}

run();
