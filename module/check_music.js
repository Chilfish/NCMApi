// 歌曲可用性

module.exports = (query, request) => {
  const data = {
    ids: `[${Number.parseInt(query.id)}]`,
    br: Number.parseInt(query.br || 999000),
  }
  return request(
    'POST',
    `https://music.163.com/weapi/song/enhance/player/url`,
    data,
    {
      crypto: 'weapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
    },
  ).then((response) => {
    let playable = false
    if (response.body.code === 200) {
      if (response.body.data[0].code === 200)
        playable = true
    }
    if (playable) {
      response.body = { code: 200, success: true, message: 'ok' }
      return response
    }
    else {
      // response.status = 404
      response.body = { code: 200, success: false, message: '亲爱的,暂无版权' }
      return response
      // return Promise.reject(response)
    }
  })
}
