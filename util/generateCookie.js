const fs = require('node:fs')
const path = require('node:path')
const tmpPath = require('node:os').tmpdir()
const { register_anonimous } = require('../main')
const { cookieToJson } = require('./index')

/**
 * 生成匿名 token，访客模式
 */
async function generateCookie() {
  try {
    const tokenPath = path.resolve(tmpPath, 'anonymous_token')
    if (!fs.existsSync(tokenPath))
      fs.writeFileSync(tokenPath, '', 'utf-8')

    const res = await register_anonimous()
    const cookie = res.body.cookie
    if (!cookie)
      throw new Error('匿名 token 为空')

    const cookieObj = cookieToJson(cookie)
    fs.writeFileSync(
      tokenPath,
      cookieObj.MUSIC_A,
      'utf-8',
    )
  }
  catch (error) {
    console.error(`匿名 token 生成失败: ${error}`)
  }
}
module.exports = {
  generateCookie,
}
