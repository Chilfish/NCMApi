const fs = require('node:fs')
const path = require('node:path')
const { cloud, login_cellphone } = require('../main')

async function main() {
  const result = await login_cellphone({
    phone: '手机号',
    password: '密码',
  })
  const filePath = './test.mp3'
  try {
    await cloud({
      songFile: {
        name: path.basename(filePath),
        data: fs.readFileSync(filePath),
      },
      cookie: result.body.cookie,
    })
  }
  catch (error) {
    console.log(error, 'error')
  }
}
main()
