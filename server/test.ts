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
console.log(`cryptojsSha1Str`, cryptojsSha1Str)

const cryptojsAesStr = CryptoJS.AES.encrypt(cookiesToEncrypt, cryptojsMd5Str).toString()
console.log(`cryptojsAesStr`, cryptojsAesStr)

const cryptojsAesStrDecrypted = CryptoJS.AES.decrypt(cryptojsAesStr, cryptojsMd5Str).toString(
  CryptoJS.enc.Utf8
)
console.log(`cryptojsAesStrDecrypted`, cryptojsAesStrDecrypted)

const apiSha1Str = hashToString(await hashEncode(keyStr, 'SHA-256'))
console.log(`apiSha1Str`, apiSha1Str)

const apiAesStr = await encryptAes(cookiesToEncrypt, keyStr)
console.log(`apiAesStr`, apiAesStr)

const apiAesStrDecrypted = await decryptAes(apiAesStr, keyStr)
console.log(`apiAesStrDecrypted`, apiAesStrDecrypted)

const bunMd5 = new Bun.CryptoHasher('md5')
const bunMd5Str = bunMd5.update(keyStr).digest('hex')
console.log(`bunMd5Str`, bunMd5Str)

const bench = new Bench({ time: 1000 })

bench
  .add('bun-md5', async () => {
    cryptoHash(keyStr, { algorithm: 'md5' })
  })
  .add('bun-md5-hmac', async () => {
    cryptoHash(keyStr, { algorithm: 'md5', key: 'secret-key' })
  })
  .add('bun-sha1', async () => {
    cryptoHash(keyStr, { algorithm: 'sha1' })
  })
  .add('bun-sha1-hmac', async () => {
    cryptoHash(keyStr, { algorithm: 'sha1', key: 'secret-key' })
  })
  .add('bun-sha256', async () => {
    cryptoHash(keyStr, { algorithm: 'sha256' })
  })
  .add('bun-sha256-hmac', async () => {
    cryptoHash(keyStr, { algorithm: 'sha256', key: 'secret-key' })
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

await bench.run()

console.table(bench.table())
