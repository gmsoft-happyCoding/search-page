<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [可用的脚本](#%E5%8F%AF%E7%94%A8%E7%9A%84%E8%84%9A%E6%9C%AC)
  - [`yarn start`](#yarn-start)
  - [`yarn test`](#yarn-test)
  - [`yarn run docz:dev`](#yarn-run-doczdev)
  - [`yarn run bad`](#yarn-run-bad)
  - [`yarn gen:api`](#yarn-genapi)
- [路径别名](#%E8%B7%AF%E5%BE%84%E5%88%AB%E5%90%8D)
- [其他](#%E5%85%B6%E4%BB%96)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

这项目使用 [stormrage](https://github.com/gmsoft-happyCoding/stormrage) 初始化

## 可用的脚本

在此目录中你可以使用以下脚本:

### `yarn start`

启动项目开发调试, 默认端口 3000

### `yarn test`

启动项目单元测试

### `yarn run docz:dev`

启动项目 docz 开发调试, 默认端口 3000

docz 是什么? 详见: https://www.docz.site/documentation

### `yarn run bad`

编译&发布(build and deploy) app 项目
发布信息可以通过以下环境变量(在此目录 /env 对应的配置文件中)配置:

```
REACT_APP_DEPLOY_TYPE
有效值: zip | scp

zip: 生成用于发布的打包文件
scp: 上传到发布目标服务器
```

```
REACT_APP_DEPLOY_SERVERS
接受一组发布目标服务器信息设置包括
1. 登录服务器需要的信息(密码等敏感信息可以不配置, 在发布时通过命令行提交)
2. 上传目标目录
示例:
[{
    "host": "192.168.2.11",
    "username": "root",
    "privateKey":"C:/Users/xb/.ssh/id_rsa",
    "passphrase":"",
    "path": "/root/test"
}]

发布服务器可以通过 privateKey + passphrase 登录
也可以通过 password 登录
```

> 发布信息可以不配置或者部分配置, 执行命令后未配置的信息可通过命令行交互填写

### `yarn gen:api`

生成 `api` 代码

---

## 路径别名

@ -> src

> 如果相对路径较长例如 ../../components/\* 可以改写为 @/components/\*

如果你想要定义自己的路径别名, 请修改一下文件

```
1. packages/*/config/webpack.config.dev.js
2. packages/*/config/webpack.config.prod.js
3. packages/*/tsconfig.json
4. packages/*/doczrc.js
5. packages/*/jest.config.js
```

## 其他

`npx jest --clearCache`

清除 jest 缓存
