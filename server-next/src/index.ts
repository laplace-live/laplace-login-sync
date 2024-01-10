import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import fastify from 'fastify'
import cors from '@fastify/cors'
import CryptoJS from 'crypto-js'

import { corsWhitelist } from './utils/corsWhitelist.js'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080

const api_root = process.env.API_ROOT ? process.env.API_ROOT.trim().replace(/\/+$/, '') : ''

const data_dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');

interface UpdateBodyProps {
  uuid: string;
  encrypted: string;
}

interface GetParamsProps {
  uuid: string;
}

interface GetBodyProps {
  password?: string;
}

const server = fastify({
  logger: true,
  // 50 MB
  bodyLimit: 1024 * 1024 * 50,
})

server.register(cors, {
  origin: corsWhitelist
})

server.get('/', async (request, reply) => {
  return 'Hello LAPLACE Login Sync'
})

server.get('/ping', async (request, reply) => {
  return 'pong'
})

server.post<{ Body: UpdateBodyProps }>(`${api_root}/update`, async (request, reply) => {
  const { encrypted, uuid } = request.body;

  // none of the fields can be empty
  if (!encrypted || !uuid) {
    reply.status(400).send('Bad Request');
    return;
  }

  // save encrypted to uuid file
  const file_path = path.join(data_dir, path.basename(uuid) + '.json');
  const content = JSON.stringify({ "encrypted": encrypted });
  fs.writeFileSync(file_path, content);
  if (fs.readFileSync(file_path, 'utf8') == content)
    reply.send({ "action": "done" });
  else
    reply.send({ "action": "error" });
});

server.all<{ Body: GetBodyProps,  Params: GetParamsProps }>(`${api_root}/get/:uuid`, async (request, reply) => {
  const { uuid } = request.params
  if (!uuid) {
    reply.status(400).send('Bad Request');
    return;
  }
  const file_path = path.join(data_dir, path.basename(uuid) + '.json');
  if (!fs.existsSync(file_path)) {
    reply.status(404).send('Not Found');
    return;
  }
  const data = JSON.parse(fs.readFileSync(file_path, 'utf8'));
  if (!data) {
    reply.status(500).send('Internal Serverless Error');
    return;
  } else {
    if (request.body.password) {
      const parsed = cookie_decrypt(uuid, data.encrypted, request.body.password);
      reply.send(parsed);
    } else {
      reply.send(data);
    }
  }
});

function cookie_decrypt(uuid: string, encrypted: string, password: string) {
  // const CryptoJS = require('crypto-js')
  const the_key = CryptoJS.MD5(uuid + '-' + password).toString().substring(0, 16)
  const decrypted = CryptoJS.AES.decrypt(encrypted, the_key).toString(CryptoJS.enc.Utf8)
  const parsed = JSON.parse(decrypted)
  return parsed
}

server.listen({ host: '0.0.0.0', port: port }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
