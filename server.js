const express = require('express');
const server = express();
const User = require('./models/user.js');

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).send('<h1>Welcome to the Users API</h1>');
});

server.post('/api/register', async (req, res) => {
  const userData = req.body;

  try {
    const user = await User.add(userData);
    res.status(201).json(user);
  } catch(err) {
    console.log(err);
    res.status(500).json({message: 'Error saving the user'});
  }
});

module.exports = server;
