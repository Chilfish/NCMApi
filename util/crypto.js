const CryptoJS = require('crypto-js')
const forge = require('node-forge')

const iv = '0102030405060708'
const presetKey = '0CoJUm6Qyw8W8jud'
const linuxapiKey = 'rFgB&h#%2?^eDg:Q'
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB
-----END PUBLIC KEY-----`
const eapiKey = 'e82ckenh8dichen8'

function aesEncrypt(text, mode, key, iv, format = 'base64') {
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(text),
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode[mode.toUpperCase()],
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  if (format === 'base64')
    return encrypted.toString()

  return encrypted.ciphertext.toString().toUpperCase()
}

function rsaEncrypt(str, key) {
  const forgePublicKey = forge.pki.publicKeyFromPem(key)
  const encrypted = forgePublicKey.encrypt(str, 'NONE')
  return forge.util.bytesToHex(encrypted)
}

function weapi(object) {
  const text = JSON.stringify(object)
  let secretKey = ''
  for (let i = 0; i < 16; i++)
    secretKey += base62.charAt(Math.round(Math.random() * 61))

  return {
    params: aesEncrypt(
      aesEncrypt(text, 'cbc', presetKey, iv),
      'cbc',
      secretKey,
      iv,
    ),
    encSecKey: rsaEncrypt(secretKey.split('').reverse().join(''), publicKey),
  }
}

function linuxapi(object) {
  const text = JSON.stringify(object)
  return {
    eparams: aesEncrypt(text, 'ecb', linuxapiKey, '', 'hex'),
  }
}

function eapi(url, object) {
  const text = typeof object === 'object' ? JSON.stringify(object) : object
  const message = `nobody${url}use${text}md5forencrypt`
  const digest = CryptoJS.MD5(message).toString()
  const data = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`
  return {
    params: aesEncrypt(data, 'ecb', eapiKey, '', 'hex'),
  }
}

function decrypt(cipher) {
  const decipher = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Hex.parse(cipher),
    },
    eapiKey,
    {
      mode: CryptoJS.mode.ECB,
    },
  )
  const decryptedBytes = CryptoJS.enc.Utf8.stringify(decipher)
  return decryptedBytes
}

module.exports = { weapi, linuxapi, eapi, decrypt, aesEncrypt }
