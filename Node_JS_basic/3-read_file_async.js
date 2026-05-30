const http = require('http');
const fs = require('fs');

const PORT = 1245;
const HOST = 'localhost';
const DATABASE_PATH = process.argv[2];


function countStudents(path) {
  return new Promise((resolve, reject) => {
    if (!path) {
      reject(new Error('Cannot load the database'));
      return;
    }
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const rows = data.split('\n').filter((line) => line.trim() !== '');
      if (rows.length <= 1) {
        resolve('Number of students: 0');
        return;
      }

      const students = rows.slice(1);
      let output = `Number of students: ${students.length}`;

      const byField = {};
      students.forEach((student) => {
        const [firstname, , , field] = student.split(',');
        if (field) {
          if (!byField[field]) {
            byField[field] = [];
          }
          byField[field].push(firstname);
        }
      });

      for (const [field, names] of Object.entries(byField)) {
        output += `\nNumber of students in ${field}: ${names.length}. List: ${names.join(', ')}`;
      }
      resolve(output);
    });
  });
}

const app = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/') {
    res.end('Hello Holberton School!');
  } else if (req.url === '/students') {
    res.write('This is the list of our students\n');
    countStudents(DATABASE_PATH)
      .then((output) => {
        res.end(output);
      })
      .catch((error) => {
        res.end(error.message);
      });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

module.exports = app;
