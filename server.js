import express from 'express';
import fs from 'fs';
import cors from 'cors'; // Importa il modulo cors

import { handler } from "./build/handler.js"

const port = 3000;

const app = express();
app.use(cors()); // Usa il middleware cors
app.use(express.json());

const apiEndpoint = '/api';

app.post(apiEndpoint + '/addBan', (req, res) => {
  const newBan = req.body;
  fs.readFile(`static/bans.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading bans.json');
    } else {
      const bans = JSON.parse(data);
      bans.push(newBan);
      fs.writeFile(`static/bans.json`, JSON.stringify(bans, null, 2), 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error writing to bans.json');
        } else {
          res.status(200).send('Ban added successfully');
        }
      });
    }
  });
});

app.post(apiEndpoint + '/approveBan', (req, res) => {
  const ban = req.body;

  fs.readFile('static/bans.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading bans file');
      return;
    }

    let bans = JSON.parse(data);
    const index = bans.findIndex(b => b.name === ban.name && b.description === ban.description);
    if (index !== -1) {
      bans[index] = ban;
      fs.writeFile('static/bans.json', JSON.stringify(bans), 'utf8', err => {
        if (err) {
          console.error(err);
          res.status(500).send('Error writing to bans file');
          return;
        }

        res.send('Ban approved successfully');
      });
    } else {
      res.status(404).send('Ban not found');
    }
  });
});

app.get(apiEndpoint + '/getBans', (req, res) => {
  fs.readFile('static/bans.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading bans file');
      return;
    }
    res.status(200).send(data);
  })

});

app.use(handler);

app.listen(port, () => console.log(`Server listening on port ${port}`));
