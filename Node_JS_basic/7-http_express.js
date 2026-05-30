const express = require('express');
const countStudents = require('./3-read_file_async');

const app = express();
const PORT = 1245;
const DB_FILE = process.argv[2];

app.get('/', (req, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', (req, res) => {
  countStudents(DB_FILE)
    .then((data) => {
      res.send(`This is the list of our students\n${data}`);
    })
    .catch((error) => {
      res.send(`This is the list of our students\n${error.message}`);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
