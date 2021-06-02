const { response } = require('express');
const mongoose = require('mongoose');
const { findOne } = require('../models/Patient');
const PatientRouter = require('express').Router();
const Patient = require('../models/Patient');

PatientRouter.get('/', async (request, response) => {
  const patients = await Patient.find({}).populate('entries');

  response.json(patients);
});

PatientRouter.post('/search', async (request, response) => {
  const { name } = request.body;
  const searchPhrase = await Patient.find({
    name: {
      $regex: '^' + name + '\\b',
      $options: 'i',
    },
  });
  console.log(searchPhrase.length);
  if (searchPhrase.length === 0) {
    const test = response.json([{ error: 'No results found' }]);
    console.log(test);
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

PatientRouter.post('/', async (request, response, next) => {
  const { name, dateOfBirth, gender, occupation } = request.body;

  console.log(name);

  const patient = new Patient({
    name,
    dateOfBirth,
    gender,
    occupation,
  });
  try {
    const savedPatient = await patient.save();
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
