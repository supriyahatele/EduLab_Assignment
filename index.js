require('dotenv').config()
const express = require('express');

const { dbToConnection } = require('./config/dbConnection');


const app = express();
app.use(express.json());



app.listen(process.env.PORT, () => {
  dbToConnection()
  console.log('server is running!')
})