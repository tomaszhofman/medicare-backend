const mongoose = require('mongoose');
const EntriesRouter = require('express').Router();
const Entries = require('../models/Entries');
const Patient = require('../models/Patient');

EntriesRouter.get('/', async (request, response) => {
  const entries = await Entries.find({}).populate('patient');
  response.send(entries);
});

EntriesRouter.post('/', async (request, response) => {
  const { body } = request;
  let patientId;

  const patient = await Patient.findById(body.userId);
  if (patient) {
    patientId = patient._id;
    console.log(patient);
  }

  const entry = new Entries({
    hour: body.hour,
    date: body.date,
    phoneNumber: body.phoneNumber,
    facilityPlace: body.facilityPlace,
    firstName: body.firstName,
    surname: body.surname,
    patient: patientId,
  });

  console.log(entry);

  const savedEntry = await entry.save();

  if (patient) {
    patient.entries = patient.entries.concat(savedEntry._id);
    await patient.save();
    console.log(patient);
  }
  response.send(savedEntry);
  response.status(200).end();
});

module.exports = EntriesRouter;
