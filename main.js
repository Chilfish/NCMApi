const fs = require('node:fs')
const path = require('node:path')
const { cookieToJson } = require('./util')

/** @type {Record<string, any>} */
const obj = {}

const modulePath = path.join(__dirname, 'module')

fs.readdirSync(modulePath)
  .reverse()
  .forEach((file) => {
    if (!file.endsWith('.js'))
      return
    const fileModule = require(path.join(modulePath, file))

    const fn = file.split('.').shift() || ''
    obj[fn] = function (data = {}) {
      if (typeof data.cookie === 'string')
        data.cookie = cookieToJson(data.cookie)

      return fileModule(
        {
          ...data,
          cookie: data.cookie ? data.cookie : {},
        },
        async (...args) => {
          // 待优化
          const request = require('./util/request')

          return request(...args)
        },
      )
    }
  })

/**
 * @type {Record<string, any> & import("./server")}
 */
module.exports = {
  ...require('./server'),
  ...obj,
}
