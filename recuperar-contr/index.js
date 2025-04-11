require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(process.env.PORT, () => {
      console.log(`Servidor en http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));