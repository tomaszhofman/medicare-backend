const { response } = require('express');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const { findOne } = require('../models/Patient');
const PatientRouter = require('express').Router();
const Patient = require('../models/Patient');
const User = require('../models/User');

PatientRouter.get('/', async (request, response) => {
  const patients = await Patient.find({}).populate('user');

  response.json(patients);
});

PatientRouter.post('/search', async (request, response) => {
  const { name } = request.body;
  const searchPhrase = await Patient.find({
    name: {
      $regex: `^${name}\\b`,
      $options: 'i',
    },
  });

  if (searchPhrase.length === 0) {
    response.json([{ error: 'No results found' }]);
    response.status(200);
  } else {
    response.json(searchPhrase);
    response.status(200);
  }
});

PatientRouter.get('/:id', async (request, response) => {
  const patientId = request.params.id;

  const patients = await Patient.findById(patientId);
  response.json(patients);
  response.status(200);
});

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

PatientRouter.post('/', async (request, response, next) => {
  try {
    const {
      PESEL,
      city,
      country,
      dateOfBith,
      flat,
      gender,
      houseNumber,
      name,
      postalCode,
      street,
      userId,
    } = request.body;

    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing' });
    }

    const user = await User.findById(decodedToken.id);
    console.log(user);

    const patient = new Patient({
      name,
      PESEL,
      city,
      gender,
      country,
      dateOfBith,
      houseNumber,
      flat,
      postalCode,
      street,
      user: user._id,
    });

    const savedPatient = await patient.save();
    user.patients = savedPatient._id;
    await user.save();
    response.json(savedPatient);
    response.status(200).end();
  } catch (error) {
    next(error);
  }
});

PatientRouter.delete('/:id', async (request, response) => {
  const patiendId = request.params.id;

  await Patient.findByIdAndDelete(patiendId);
  response.status(204).end();
});

module.exports = PatientRouter;
