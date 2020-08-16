// third party libraries
const axios = require('axios');
const express = require('express');

// environment variables
const { _, PORT } = process.env;

const app = express();

app.get('/', async (req, res) => {
  const { cookie, url } = req.query;
  if (!cookie || !url) {
    res.sendStatus(400);
    return;
  }

  const { data } = await axios.get(url, {
    headers: {
      Cookie: cookie,
      Referer: 'https://zoom.us/'
    },
    responseType: 'stream'
  });
  data.pipe(res);
});

if (_ && _.includes('heroku')) {
  app.get('/wakemydyno.txt', (req, res) => {
    res.sendStatus(200);
  });
}

const port = parseInt(PORT, 10) || 8080;
app.listen(port, () => {
  console.log('listening', {
    port
  });
});
