process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const paths = require('../../config/paths');

// 环境变量配置文件
const envFiles = fs.readdirSync(path.dirname(paths.dotenv));
// 可以发布的目标环境选项
const deploys = envFiles.filter(file => file.includes('.env.')).map(file => file.split('.')[2]);

/**
 * 加载配置文件中的配置到 process.env
 * @param {string} whichDeploy - 发布目标环境
 */
function loadEnvFile(whichDeploy) {
  // 设置标识, 确定使用哪一个配置文件
  process.env.DEPLOY_ENV = whichDeploy;
  // 加载配置文件中的配置到 process.env
  require('../../config/env');
}

function load() {
  // 尝试从命令行参数中获取 发布目标环境
  const whichDeploy = process.argv[2];
  /**
   * 从参数中获取了有效的目标名称直接使用
   * 否则询问需要发布到哪里?
   */
  return new Promise((resolve, reject) => {
    if (whichDeploy && deploys.includes(whichDeploy)) {
      loadEnvFile(whichDeploy);
      resolve(whichDeploy);
    } else {
      if (deploys.length === 0) {
        return console.log(chalk.red('没有可供发布的目标环境配置, 请检查 env 目录!'));
      }
      if (whichDeploy) console.log(chalk.cyan('项目中没有你指定的发布环境配置, 请选择!'));
      const questions = [
        {
          type: 'list',
          name: 'WHICH_DEPLOY',
          message: '你想要发布到哪个环境?',
          choices: deploys,
        },
      ];

      inquirer.prompt(questions).then(answers => {
        loadEnvFile(answers['WHICH_DEPLOY']);
        resolve(answers['WHICH_DEPLOY']);
      });
    }
  });
}

module.exports = load;
