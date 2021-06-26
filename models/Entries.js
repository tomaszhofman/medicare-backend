const mongoose = require('mongoose');

const entriesSchema = new mongoose.Schema({
  hour: String,
  data: String,
  phoneNumber: String,
  facilityPlace: String,
  firstName: String,
  surname: String,
  patient: {
    type: mongoose.Schema.Types.ObjectId,
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
