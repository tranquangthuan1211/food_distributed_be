const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/mongodb/User');
const redisClient = require('../config/redis');
const { driver } = require('../config/neo4j');
const { MERGE_USER } = require('../models/neo4j/graphQueries');

async function register({ name, email, password, phone }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, phone });
  await user.save();

  const session = driver.session();
  try {
    await session.run(MERGE_USER, {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } finally {
    await session.close();
  }

  const { password: _, ...userObj } = user.toObject();
  return userObj;
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '24h' }
  );

  await redisClient.set(`session:${user._id.toString()}`, token, 'EX', 86400);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
}

module.exports = { register, login };
