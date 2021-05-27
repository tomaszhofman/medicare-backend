const mongoose = require('mongoose');

const entriesSchema = new mongoose.Schema({
  date: String,
  specialist: String,
  type: String,
  description: String,
  patient: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Patient',
  },
});

entriesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Entries', entriesSchema);
