const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: String,
  gender: String,
  occupation: String,
  entries: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Entries',
  },
});

patientSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Patient', patientSchema);

// {
//   id: 'd2773336-f723-11e9-8f0b-362b9e155667',
//       name: 'John McClane',
//     dateOfBirth: '1986-07-09',
//     ssn: '090786-122X',
//     gender: Gender.Male,
//     occupation: 'New york city cop',
//     entries: [
//   {
//     id: 'd811e46d-70b3-4d90-b090-4535c7cf8fb1',
//     date: '2015-01-02',
//     type: 'Hospital',
//     specialist: 'MD House',
//     diagnosisCodes: ['S62.5'],
//     description:
//         "Healing time appr. 2 weeks. patient doesn't remember how he got the injury.",
//     discharge: {
//       date: '2015-01-16',
//       criteria: 'Thumb has healed.',
//     },
//   },
// ],
// },
