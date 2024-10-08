import { Bench } from 'tinybench'
import CryptoJS from 'crypto-js'
import {
  cryptoHash,
  cryptoHmac,
  decryptAes,
  encryptAes,
  hashEncode,
  hashToString,
} from './lib/crypto'

const keyStr = 'uuid1234-password12345'
const cookiesToEncrypt = JSON.stringify({
  cookie_data: ['1', '2', '3', 3, 4, 5, 6],
  local_storage_data: [],
  ownerDetails: {
    id: 899950,
    room: 0,
    username: 'test',
    guild: null,
    avatar: 'https://i0.hdslb.com/bfs/face/714779f18f9328ec27180a28ff38322d03c74b24.jpg',
    updatedAt: '2024-06-04T09:14:49.156Z',
  },
})

const cryptojsMd5Str = CryptoJS.MD5(keyStr).toString().substring(0, 16)
console.log(`cryptojsMd5Str`, cryptojsMd5Str)

const cryptojsSha1Str = CryptoJS.SHA1(keyStr).toString().substring(0, 16)
console.log(`\ncryptojsSha1Str`, cryptojsSha1Str)

const cryptojsAesStr = CryptoJS.AES.encrypt(cookiesToEncrypt, cryptojsMd5Str).toString()
console.log(`\ncryptojsAesStr`, cryptojsAesStr)

const cryptojsAesStrDecrypted = CryptoJS.AES.decrypt(cryptojsAesStr, cryptojsMd5Str).toString(
  CryptoJS.enc.Utf8
)
console.log(`\ncryptojsAesStrDecrypted`, cryptojsAesStrDecrypted)

const apiSha1Str = hashToString(await hashEncode(keyStr, 'SHA-256'))
console.log(`\napiSha1Str`, apiSha1Str)

const apiAesStr = await encryptAes(cookiesToEncrypt, keyStr)
console.log(`\napiAesStr`, apiAesStr)

const apiAesStrDecrypted = await decryptAes(apiAesStr, keyStr)
console.log(`\napiAesStrDecrypted`, apiAesStrDecrypted)

const bunMd5Str = cryptoHash(keyStr, { algorithm: 'md5' })
console.log(`\nbunMd5Str`, bunMd5Str)

const bunSha256HmacStr = cryptoHash(keyStr, { algorithm: 'sha256', key: 'secret-key' })
console.log(`\nbunSha256HmacStr`, bunSha256HmacStr)

const cryptoSha256HmacStr = cryptoHmac(keyStr, 'secret-key', { algorithm: 'sha256' })
console.log(`\ncryptoSha256HmacStr`, cryptoSha256HmacStr)

const bench = new Bench({ time: 1000 })

bench
  .add('bun-md5', async () => {
    cryptoHash(keyStr, { algorithm: 'md5' })
  })
  .add('bun-sha1', async () => {
    cryptoHash(keyStr, { algorithm: 'sha1' })
  })
  .add('bun-sha256', async () => {
    cryptoHash(keyStr, { algorithm: 'sha256' })
  })
  .add('cryptojs-md5', async () => {
    CryptoJS.MD5(keyStr).toString()
  })
  .add('cryptojs-sha1', async () => {
    CryptoJS.SHA1(keyStr).toString()
  })
  .add('cryptojs-sha256', async () => {
    CryptoJS.SHA256(keyStr).toString()
  })
  .add('cryptojs-encrypt-aes', async () => {
    CryptoJS.AES.encrypt(cookiesToEncrypt, cryptojsMd5Str).toString()
  })
  .add('cryptojs-decrypt-aes', async () => {
    CryptoJS.AES.decrypt(cryptojsAesStr, cryptojsMd5Str).toString(CryptoJS.enc.Utf8)
  })
  .add('crypto-sha1', async () => {
    hashToString(await hashEncode(keyStr, 'SHA-1'))
  })
  .add('crypto-sha256', async () => {
    hashToString(await hashEncode(keyStr, 'SHA-256'))
  })
  .add('crypto-encrypt-aes', async () => {
    await encryptAes(cookiesToEncrypt, keyStr)
  })
  .add('crypto-decrypt-aes', async () => {
    await decryptAes(apiAesStr, keyStr)
  })
  .add('bun-md5-hmac', async () => {
    cryptoHash(keyStr, { algorithm: 'md5', key: 'secret-key' })
  })
  .add('bun-sha1-hmac', async () => {
    cryptoHash(keyStr, { algorithm: 'sha1', key: 'secret-key' })
  })
  .add('bun-sha256-hmac', async () => {
    cryptoHash(keyStr, { algorithm: 'sha256', key: 'secret-key' })
  })
  .add('crypto-md5-hmac', async () => {
    cryptoHmac(keyStr, 'secret-key', { algorithm: 'md5' })
  })
  .add('crypto-sha1-hmac', async () => {
    cryptoHmac(keyStr, 'secret-key', { algorithm: 'sha1' })
  })
  .add('crypto-sha256-hmac', async () => {
    cryptoHmac(keyStr, 'secret-key', { algorithm: 'sha256' })
  })

await bench.run()

console.table(bench.table())
