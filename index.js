#!/usr/bin/env node
const { generateCookie } = require('./util/generateCookie')
const { serveNcmApi } = require('./server')

generateCookie()
  .then(() => {
    serveNcmApi({ checkVersion: true })
  })
