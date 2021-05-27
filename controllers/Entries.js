const mongoose = require('mongoose');
const EntriesRouter = require('express').Router();
const Entries = require('../models/Entries');
const Patient = require('../models/Patient');

EntriesRouter.get('/', async (request, response) => {
  const entries = await Entries.find({});
  response.send(entries);
});

EntriesRouter.post('/', async (request, response) => {
  const body = request.body;

  const patient = await Patient.findById(body.userId);
  console.log(patient);

  const entry = new Entries({
    date: body.date,
    specialist: body.specialist,
    type: body.type,
    description: body.description,
    patient: patient._id,
  });

  const savedEntry = await entry.save();

  patient.entries = patient.entries.concat(savedEntry._id);
  await patient.save();
  response.send(savedEntry);
  response.status(200).end();
});

module.exports = EntriesRouter;
