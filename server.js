const express = require('express');
const session = require('express-session');
const sessionStore = require('connect-session-knex')(session);
const server = express();
const bcrypt = require('bcryptjs');

const User = require('./models/user.js');
const validate = require('./auth/validate.js');

const sessionOptions = {
  name: "mycookie",
  secret: "Nel mezzo del cammin di nostra vita",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // true in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new sessionStore({
    knex: require('./data/db-config.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
}

server.use(express.json());
server.use(session(sessionOptions));

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

server.get('/api/users', validate, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({message: "Error finding users"});
  }
});

server.post('/api/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findBy({ name }).first();

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({...user, message: `Welcome ${user.name}`});
    } else {
      res.status(401).json({message: "Invalid credentials"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Error logging in"});
  }
});

server.delete('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({message: "Unable to logout"});
      } else {
        res.status(200).json({message: "Logout successful"})
      }
    })
  } else {
    res.end();
  }
});

module.exports = server;
