process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const inquirer = require('inquirer');
const zip = require('./utils/zip');
const scp = require('./utils/scp');
const loadDeployEnv = require('./utils/load-deploy-env');
const paths = require('../config/paths');

const DEPLOY_TYPE = {
  ZIP: 'zip',
  SCP: 'scp',
};

/**
 * 支持2种部署模式
 * scp: 使用scp复制文件到指定的目标服务器
 * zip: 在本地生成打包文件, 需要手动部署到目标服务器
 */
async function deploy(whichDeploy) {
  // 部署方式
  let deployType = process.env.REACT_APP_DEPLOY_TYPE;

  if (!deployType) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'deployType',
        message: '选择部署方式?',
        choices: [DEPLOY_TYPE.ZIP, DEPLOY_TYPE.SCP],
      },
    ]);
    deployType = answers.deployType;
  }

  switch (deployType) {
    case DEPLOY_TYPE.ZIP:
      zip(paths.appBuild, whichDeploy);
      break;
    case DEPLOY_TYPE.SCP:
      // 部署服务器信息
      const deployServers = process.env.REACT_APP_DEPLOY_SERVERS
        ? JSON.parse(process.env.REACT_APP_DEPLOY_SERVERS)
        : [{}];
      for (const deployServer of deployServers) {
        await scp(paths.appBuild, deployServer, true);
      }
      break;
  }
}

async function run() {
  const whichDeploy = await loadDeployEnv();
  deploy(whichDeploy);
}

run();
