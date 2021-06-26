const express = require('express');
const config = require('./utils/config');

const app = express();
const cors = require('cors');
const PatientRouter = require('./controllers/Patients');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const EntriesRouter = require('./controllers/Entries');
const UsersRouter = require('./controllers/Users');
const loginRouter = require('./controllers/Login');

console.log('connecting to ', config.MONGODB_URL);

// Connect to mongoose

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected to mondoDb');
  });

app.use(cors());
app.use(express.json());

// Use routers

app.use('/api/patients', PatientRouter);
app.use('/api/entries', EntriesRouter);
app.use('/api/users', UsersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
