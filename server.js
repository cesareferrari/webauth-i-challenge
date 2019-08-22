const express = require('express');
const server = express();
const bcrypt = require('bcryptjs');
const User = require('./models/user.js');

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).send('<h1>Welcome to the Users API</h1>');
});

server.post('/api/register', async (req, res) => {
  const userData = req.body;
  const hash = bcrypt.hashSync(userData.password, 10);
  userData.password = hash;

  try {
    const user = await User.add(userData);
    res.status(201).json(user);
  } catch(err) {
    console.log(err);
    res.status(500).json({message: 'Error saving the user'});
  }
});

server.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({message: "Error finding users"});
  }
});

module.exports = server;
