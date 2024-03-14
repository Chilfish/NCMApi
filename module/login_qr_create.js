const QRCode = require('qrcode')

module.exports = async (query, request) => {
  const url = `https://music.163.com/login?codekey=${query.key}`
  return {
    code: 200,
    status: 200,
    body: {
      code: 200,
      data: {
        qrurl: url,
        qrimg: query.qrimg ? await QRCode.toDataURL(url) : '',
      },
    },
  }
}
