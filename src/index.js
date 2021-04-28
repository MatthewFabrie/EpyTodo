const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});
const express = require('express')
const bodyParser = require('body-parser');
const dbConn = require('./config/db');

const app = express()
const port = 3000

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())


const userRoutes = require('./routes/user/user.router');
const todoRoutes = require('./routes/todos/todos.router');
const authRoutes = require('./routes/auth/auth');

app.use(express.json());

app.use('/', authRoutes);

app.use('/', todoRoutes);

app.use('/', userRoutes);

app.listen(port, () => {
  console.log(`Epytodo app listening at http://localhost:${port}`)
})