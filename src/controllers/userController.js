const userService = require('../services/userService');

async function register(req, res) {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const result = await userService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}

module.exports = { register, login };
