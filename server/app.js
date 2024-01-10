import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url'

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import CryptoJS from 'crypto-js';

const app = express();
app.use(cors());

const data_dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');

// make dir if not exist
fs.mkdir(data_dir, { recursive: true });

const forms = multer({ limits: { fieldSize: 100 * 1024 * 1024 } });
app.use(forms.array());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const api_root = process.env.API_ROOT ? process.env.API_ROOT.trim().replace(/\/+$/, '') : '';

app.all(`${api_root}/`, (req, res) => {
  res.send('Hello World!' + `API ROOT = ${api_root}`);
});

app.post(`${api_root}/update`, async (req, res) => {
  const { encrypted, uuid } = req.body;
  if (!encrypted || !uuid) {
    res.status(400).send('Bad Request');
    return;
  }

  const file_path = path.join(data_dir, path.basename(uuid) + '.json');
  const content = JSON.stringify({ encrypted });

  await fs.writeFile(file_path, content);
  const savedContent = await fs.readFile(file_path, 'utf8');

  if (savedContent === content)
    res.json({ "action": "done" });
  else
    res.json({ "action": "error" });
});

app.all(`${api_root}/get/:uuid`, async (req, res) => {
  const { uuid } = req.params;
  if (!uuid) {
    res.status(400).send('Bad Request');
    return;
  }

  const file_path = path.join(data_dir, path.basename(uuid) + '.json');

  if (!fs.existsSync(file_path)) {
    res.status(404).send('Not Found');
    return;
  }

  const data = JSON.parse(await fs.readFile(file_path, 'utf8'));

  if (!data) {
    res.status(500).send('Internal Serverless Error');
    return;
  } else {
    if (req.body.password) {
      const parsed = cookie_decrypt(uuid, data.encrypted, req.body.password);
      res.json(parsed);
    } else {
      res.json(data);
    }
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

const port = 8088;
app.listen(port, () => {
  console.log(`Server start on http://localhost:${port}${api_root}`);
});

function cookie_decrypt(uuid, encrypted, password) {
  const the_key = CryptoJS.MD5(uuid + '-' + password).toString().substring(0, 16);
  const decrypted = CryptoJS.AES.decrypt(encrypted, the_key).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}
