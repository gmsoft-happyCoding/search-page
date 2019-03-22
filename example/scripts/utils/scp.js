const fs = require('fs');
const nodeJsPath = require('path');
const scp2 = require('scp2');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * 登录方式
 * 密码 | 私钥文件
 */
const LOGIN_TYPE = {
  PASSWORD: 'password',
  PRIVATE_KEY: 'privateKey',
};
/**
 * 执行scp命令
 * @param {string} srcPath - 本地目录或文件
 * @param {Object} dest - {
    port = 22,  // ssh 端口号
    host,       // 服务器地址
    username,   // 登录用户名
    password,   // 密码
    privateKey, // 私钥文件路径
    passphrase, // 私钥密码
    path,       // 上传到服务器的路径
  },
 * @param {boolean} verbose - 是否打印传输日志
 */
function scpExec(
  srcPath,
  { port, host, username, password, privateKey, passphrase, path },
  verbose
) {
  return new Promise((resolve, reject) => {
    /**
     * 读取从文件私钥
     */
    if (privateKey) {
      privateKey = fs.readFileSync(nodeJsPath.normalize(privateKey));
    }

    const sshClient = new scp2.Client({
      port,
      host,
      username,
      password,
      privateKey,
      passphrase,
    });
    let startTime;
    let endTime;
    // 链接成功flag
    let connectSuccess = false;

    sshClient.on('ready', function() {
      connectSuccess = true;
      startTime = new Date();
      console.log(chalk.cyan(host + ' [开始上传] ' + startTime));
    });

    if (verbose)
      sshClient.on('write', function(p) {
        console.log(chalk.yellow(p.source + ' => ' + host + '@' + p.destination));
      });

    sshClient.on('end', function() {
      endTime = new Date();
      if (connectSuccess) console.log(chalk.cyan(host + ' [上传结束] ' + new Date()));
    });

    sshClient.on('error', function(err) {
      reject(`${host}: ${err}`);
    });

    sshClient.on('close', function() {
      if (connectSuccess) {
        console.log(chalk.cyan(host + ' 上传用时: [' + (+endTime - +startTime) / 1000 + '] 秒!'));
        resolve();
      }
    });

    scp2.scp(srcPath, { path }, sshClient, function(err) {
      if (err) {
        reject(`${host}: ${err}`);
      }
    });
  });
}

/**
 * 拷贝文件到目标服务器
 * ssh 默认使用端口 22
 * 如果没有配置密码, 会提示输入用户密码或私钥密码
 * @param {string} srcPath - 本地目录或文件
 * @param {Object} dest - {
    port = 22,  // ssh 端口号
    host,       // 服务器地址
    username,   // 登录用户名
    password,   // 密码
    privateKey, // 私钥文件路径
    passphrase, // 私钥密码
    path,       // 上传到服务器的路径
  },
 * @param {boolean} verbose - 是否打印传输日志
 *
 */
async function scp(
  srcPath,
  { port = 22, host, username, password, privateKey, passphrase, path },
  verbose
) {
  const questions = [];

  if (host === undefined) {
    questions.push({
      type: 'input',
      name: 'host',
      message: '你要部署到哪个服务器?',
    });
  }

  if (username === undefined) {
    questions.push({
      type: 'input',
      name: 'username',
      message: '服务器登录用户名?',
    });
  }

  if (password === undefined && privateKey === undefined) {
    questions.push({
      type: 'list',
      name: 'loginType',
      message: '你要使用哪种方式登录?',
      choices: [LOGIN_TYPE.PASSWORD, LOGIN_TYPE.PRIVATE_KEY],
    });
  }

  if (password === undefined) {
    questions.push({
      type: 'password',
      name: 'password',
      message: '登录密码?',
      mask: '*',
      when: answers => {
        return answers.loginType === LOGIN_TYPE.PASSWORD;
      },
    });
  }

  if (privateKey === undefined) {
    questions.push({
      type: 'input',
      name: 'privateKey',
      message: '登录私钥路径?',
      when: answers => {
        return answers.loginType === LOGIN_TYPE.PRIVATE_KEY;
      },
    });
  }

  if (passphrase === undefined) {
    questions.push({
      type: 'password',
      name: 'passphrase',
      message: '登录私钥密码?',
      mask: '*',
      when: answers => {
        return answers.loginType === LOGIN_TYPE.PRIVATE_KEY || privateKey;
      },
    });
  }

  if (!path) {
    questions.push({
      type: 'input',
      name: 'path',
      message: '上传到服务器哪个目录?',
    });
  }

  let answers = {};
  if (questions.length > 0) {
    answers = await inquirer.prompt(questions);
  }

  try {
    await scpExec(
      srcPath,
      { port, host, username, password, privateKey, passphrase, path, ...answers },
      verbose
    );
  } catch (err) {
    console.log(chalk.red(`[scp error] ${err}`));
    const { retry } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'retry',
        message: '上传文件失败, 你想要重试吗?',
        default: true,
      },
    ]);
    if (retry)
      await scp(srcPath, { port, host, username, password, privateKey, passphrase, path }, verbose);
  }
}

module.exports = scp;
