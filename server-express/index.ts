import path from 'path'
import { fileURLToPath } from 'url'

import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import multer from 'multer'
import bodyParser from 'body-parser'
import CryptoJS from 'crypto-js'

const app = express()
app.use(cors())

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8088
const useAuth = process.env.LAPLACE_LOGIN_SYNC_AUTH_MODE
const auth = process.env.LAPLACE_LOGIN_SYNC_AUTH_KEY

const data_dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data')

const forms = multer({ limits: { fieldSize: 100 * 1024 * 1024 } })
app.use(forms.array('cookies'))

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

const api_root = process.env.API_ROOT ? process.env.API_ROOT.trim().replace(/\/+$/, '') : ''

app.all(`${api_root}/`, (req, res) => {
  res.send(`LAPLACE Login Sync Server. API ROOT = ${api_root}`)
})

app.post(`${api_root}/update`, async (req, res) => {
  const { encrypted, uuid } = req.body
  if (!encrypted || !uuid) {
    res.status(400).send('Bad Request')
    return
  }

  const file_path = path.join(data_dir, path.basename(uuid) + '.json')
  const content = JSON.stringify({ encrypted })

  await Bun.write(file_path, content)
  const savedContent = await Bun.file(file_path).text()

  if (savedContent === content)
    res.json({ "action": "done" })
  else
    res.json({ "action": "error" })
})

app.all(`${api_root}/get/:uuid`, async (req, res) => {
  const { uuid } = req.params
  const { auth: authToken } = req.query

  if (useAuth !== undefined && auth && auth !== authToken) {
    res.status(403).send('Unauthorized')
    return
  }

  if (!uuid) {
    res.status(400).send('Bad Request')
    return
  }

  const file_path = path.join(data_dir, path.basename(uuid) + '.json')

  if (!await Bun.file(file_path).exists()) {
    res.status(404).send('Not Found')
    return
  }

  const data = JSON.parse(await Bun.file(file_path).text())

  if (!data) {
    res.status(500).send('Internal Serverless Error')
    return
  } else {
    if (req.body.password) {
      const parsed = cookieCloudDecrypt(uuid, data.encrypted, req.body.password)
      res.json(parsed)
    } else {
      res.json(data)
    }
  }
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).send('Internal Serverless Error')
})

app.listen(port, () => {
  console.log(`Server start on http://localhost:${port}${api_root}`)
})

function cookieCloudDecrypt(uuid: string, encrypted: string, password: string) {
  const the_key = CryptoJS.MD5(uuid + '-' + password).toString().substring(0, 16)
  const decrypted = CryptoJS.AES.decrypt(encrypted, the_key).toString(CryptoJS.enc.Utf8)
  const parsed = JSON.parse(decrypted)
  return parsed
}

export default app
