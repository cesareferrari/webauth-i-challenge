const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

module.exports = async function(req, res, next) {
  const { name, password } = req.headers;

  if (name && password) {
    try {
      const user = await User.findBy({ name }).first();

      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({message: "Invalid credentials"});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message: "Error logging in"});
    }
  } else {
    res.status(500).json({message: 'No credentials'});
  }
}
