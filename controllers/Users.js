const UsersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

UsersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('patients');

  response.json(users);
  response.status(200);
});

UsersRouter.post('/', async (request, response, next) => {
  try {
    const { body } = request;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    console.log(passwordHash);

    const savedUser = await user.save();

    response.json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = UsersRouter;
