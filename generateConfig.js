const fs = require('node:fs')
const path = require('node:path')
const tmpPath = require('node:os').tmpdir()
const { register_anonimous } = require('./main')
const { cookieToJson } = require('./util/index')

async function generateConfig() {
  try {
    const res = await register_anonimous()
    const cookie = res.body.cookie
    if (cookie) {
      const cookieObj = cookieToJson(cookie)
      fs.writeFileSync(
        path.resolve(tmpPath, 'anonymous_token'),
        cookieObj.MUSIC_A,
        'utf-8',
      )
    }
  }
  catch (error) {
    console.log(error)
  }
}
module.exports = generateConfig
