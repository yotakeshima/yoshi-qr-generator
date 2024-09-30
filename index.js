import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import qr from 'qr-image';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
      <form action="/generate" method="POST">
        <label for="url">Enter URL:</label>
        <input type="text" id="url" name="url">
        <button type="submit">Generate QR Code</button>
      </form>
    `);
});

app.post('/generate', (req, res) => {
  const url = req.body.url;

  if (!url) return res.status(400).send('Valid URL is required');

  const qr_png = qr.image(url, { type: 'png' });

  const qrImagePath = 'qr_image.png';

  const qrStream = fs.createWriteStream(qrImagePath);
  qr_png.pipe(qrStream);
  qrStream.on('finish', () => {
    // Send the QR code image as a response after it's saved
    res.download(qrImagePath, (err) => {
      if (err) {
        res.status(500).send('Error generating the QR code');
      } else {
        console.log('QR code generated and sent to user');
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
