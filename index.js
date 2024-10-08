require('dotenv').config()
const express = require('express');

const { dbToConnection } = require('./config/dbConnection');
const { UserRouter } = require('./routes/userRoute');
const { TaskRouter } = require('./routes/taskRoute');


const app = express();
app.use(express.json());

app.use("/api/v1/users",UserRouter)
app.use("/api/v1/tasks",TaskRouter)

app.listen(process.env.PORT, () => {
  dbToConnection()
  console.log('server is running!')
})