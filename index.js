#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const tmpPath = require('node:os').tmpdir()

async function start() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token')))
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')

  // 启动时更新anonymous_token
  const generateConfig = require('./generateConfig')
  await generateConfig()
  require('./server').serveNcmApi({
    checkVersion: true,
  })
}
start()
