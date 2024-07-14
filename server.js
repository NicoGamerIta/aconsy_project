const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'pass', // Replace with your password
  database: 'verifica', // Replace with your database name
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Route to get a specific NFT by public address
app.get('/api/nft/:public_address', (req, res) => {
  const publicAddress = req.params.public_address;
  console.log(`Received request for NFT with public address: ${publicAddress}`);

  db.query('SELECT * FROM vnft WHERE public_address = ?', [publicAddress], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      console.log('No NFT found in the database for public address:', publicAddress);
      res.status(404).json({ message: 'NFT not verified' });
    } else {
      const result = results[0];
      console.log('NFT found in the database:', result);
      res.json({
        verified: true,
        name: result.name_nft,
        symbol: result.simbol,
        description: result.description,
        image: '', // Assume there is an image field if available
        saved: result.saved // Include saved status
      });
    }
  });
});

// Route to save a verified NFT
app.post('/api/save', (req, res) => {
  const { public_address } = req.body;
  console.log(`Request to save NFT with public address: ${public_address}`);

  db.query('UPDATE vnft SET saved = 1 WHERE public_address = ?', [public_address], (err, results) => {
    if (err) {
      console.error('Error updating database:', err);
      res.status(500).send(err);
      return;
    }
    console.log('NFT saved successfully for public address:', public_address);
    res.json({ message: 'NFT saved successfully' });
  });
});

// Route to get saved NFTs
app.get('/api/saved', (req, res) => {
  console.log('Request to get saved NFTs');
  db.query('SELECT * FROM vnft WHERE saved = 1', (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send(err);
      return;
    }
    console.log('Saved NFTs:', results);
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});