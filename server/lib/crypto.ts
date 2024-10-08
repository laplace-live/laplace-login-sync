import { CryptoHasher, type DigestEncoding, type SupportedCryptoAlgorithms } from 'bun'
import { createHmac } from 'crypto'

export function cryptoHash(
  input: Bun.BlobOrStringOrBuffer,
  {
    key,
    algorithm,
    encoding,
  }: {
    /** HMAC digests secret key */
    key?: string
    algorithm?: SupportedCryptoAlgorithms
    encoding?: DigestEncoding
  } = {}
) {
  const hasher = key
    ? new CryptoHasher(algorithm || 'sha256', key)
    : new CryptoHasher(algorithm || 'sha256')

  return hasher.update(input).digest(encoding || 'hex')
}

/** @deprecated, use `cryptoHash` instead */
export function cryptoHmac(
  input: string | NodeJS.ArrayBufferView,
  key: string,
  {
    algorithm,
    encoding,
  }: {
    algorithm?: SupportedCryptoAlgorithms
    encoding?: DigestEncoding
  } = {}
) {
  return createHmac(algorithm || 'sha256', key)
    .update(input)
    .digest(encoding || 'hex')
}

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
export async function hashEncode(inputString: string, algo?: string) {
  const algoStr = algo || 'SHA-256'
  const encoder = new TextEncoder()
  const data = encoder.encode(inputString)
  const hash = await crypto.subtle.digest(algoStr, data)
  return hash
}

export function hashToString(hashBuffer: ArrayBuffer) {
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/** Generate derive key from hash string */
export async function generateDeriveKey(keyStr: string) {
  const hashBuffer = await hashEncode(keyStr, 'SHA-256')

  // Since SHA-1 gives us 160 bits, and AES needs either 128, 192, or 256 bits, we need to adjust it
  // For simplicity, we can pad the SHA-1 hash to make it 256 bits (32 bytes)
  // Create a new array with 256 bits
  // let keyData = new Uint8Array(32)
  // Set the first 160 bits from the SHA-1 hash
  // keyData.set(new Uint8Array(hashBuffer))
  // The rest of the array remains zero, effectively padding the SHA-1 hash to 256 bits

  // Convert the SHA-1 hash to a format usable as a key
  const key = await crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: 'AES-CBC' },
    false, // whether the key is extractable
    ['encrypt', 'decrypt'] // what this key can do
  )
  return key
}

export async function encryptAes(text: string, keyStr: string) {
  const iv = crypto.getRandomValues(new Uint8Array(16)) // AES requires an initialization vector
  const key = await generateDeriveKey(keyStr)

  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  const encryptedData = await crypto.subtle.encrypt({ name: 'AES-CBC', iv: iv }, key, data)

  const buffer = new Uint8Array(encryptedData)
  const ivStr = Array.from(iv)
    .map((b) => String.fromCharCode(b))
    .join('')
  const encryptedStr = Array.from(buffer)
    .map((b) => String.fromCharCode(b))
    .join('')

  // Return base64 encoded iv + encrypted data
  return btoa(ivStr + encryptedStr)
}

export async function decryptAes(encryptedBase64: string, keyStr: string) {
  // Decode base64 string
  const binaryStr = atob(encryptedBase64)
  const bytes = new Uint8Array(binaryStr.length).map((_, i) => binaryStr.charCodeAt(i))

  const iv = bytes.slice(0, 16) // Extract the first 16 bytes as the IV
  const data = bytes.slice(16) // The rest is the encrypted data

  const key = await generateDeriveKey(keyStr)

  const decryptedData = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, key, data)

  const decoder = new TextDecoder()
  return decoder.decode(decryptedData)
}
