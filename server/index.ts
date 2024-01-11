import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { validator } from 'hono/validator'
import pako from 'pako'
import CryptoJS from 'crypto-js'

interface CookieRequestBody {
  uuid: string
  encrypted: string
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8088
const useAuth = process.env.LAPLACE_LOGIN_SYNC_AUTH_MODE
const auth = process.env.LAPLACE_LOGIN_SYNC_TOKEN

const dataDir = import.meta.dir + '/data'

const app = new Hono()

app.use('/update', cors())
app.use('/get/:uuid', cors())

app.all('/', (c) => {
  return c.text(`LAPLACE Login Sync Server`)
})

app.use('/update', cors()).post(async (c) => {
  const body = await c.req.arrayBuffer()
  const raw = pako.inflate(body)
  const decoder = new TextDecoder()
  const text = decoder.decode(raw)

  try {
    const json: CookieRequestBody = JSON.parse(text)
    const { uuid, encrypted } = json

    if (!encrypted || !uuid) {
      return c.json({ code: 400, message: 'Request body error' }, 400)
    }

    const filePath = `${dataDir}/${uuid}.json`
    const content = JSON.stringify({ encrypted })

    await Bun.write(filePath, content)
    const savedContent = await Bun.file(filePath).text()

    if (savedContent === content) {
      return c.json({ action: 'done' })
    } else {
      return c.json({ action: 'error' })
    }
  } catch (err) {
    console.error('Error parsing JSON:', err)
    return c.json({ code: 400, message: 'Error parsing body' }, 400)
  }
})

app.all(
  '/get/:uuid',
  validator('form', (value, c) => {
    const password = value['password']

    if (!password || typeof password !== 'string') {
      return { password: '' }
    }
    return { password }
  }),
  async (c) => {
    const uuid = c.req.param('uuid')
    const authToken = c.req.query('auth')

    if (useAuth !== undefined && auth && auth !== authToken) {
      return c.json({ code: 403, message: 'Unauthorized' }, 403)
    }

    if (!uuid) {
      return c.json({ code: 400, message: 'Bad request' }, 400)
    }

    const filePath = `${dataDir}/${uuid}.json`

    if (!(await Bun.file(filePath).exists())) {
      return c.json({ code: 404, message: 'Not found' }, 404)
    }

    const data = JSON.parse(await Bun.file(filePath).text())

    if (!data) {
      return c.json({ code: 500, message: 'Internal server error' }, 500)
    } else {
      if (c.req.method === 'POST') {
        const body = c.req.valid('form')
        const password = body.password

        if (password !== '') {
          const parsed = cookieCloudDecrypt(uuid, data.encrypted, password)
          return c.json(parsed)
        } else {
          return c.json({ code: 403, message: 'Missing token' }, 403)
        }
      } else {
        return c.json(data)
      }
    }
  }
)

app.onError((err, c) => {
  console.error('Server error', err)
  return c.json({ code: 500, message: 'Server error' }, 500)
})

function cookieCloudDecrypt(uuid: string, encrypted: string, password: string) {
  const the_key = CryptoJS.MD5(uuid + '-' + password)
    .toString()
    .substring(0, 16)
  const decrypted = CryptoJS.AES.decrypt(encrypted, the_key).toString(CryptoJS.enc.Utf8)
  const parsed = JSON.parse(decrypted)
  return parsed
}

export default {
  port,
  fetch: app.fetch,
}
