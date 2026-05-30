const http = require('http');
const fs = require('fs');

function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const lines = data.split('\n').filter((line) => line.trim() !== '');
      const students = lines.slice(1); // Remove header

      const fields = {};
      for (const student of students) {
        const cols = student.split(',');
        if (cols.length < 4) continue;
        const field = cols[3].trim();
        const firstName = cols[0].trim();
        if (!fields[field]) fields[field] = [];
        fields[field].push(firstName);
      }

      const lines_out = [];
      lines_out.push(`Number of students: ${students.length}`);
      for (const [field, names] of Object.entries(fields)) {
        lines_out.push(`Number of students in ${field}: ${names.length}. List: ${names.join(', ')}`);
      }

      resolve(lines_out.join('\n'));
    });
  });
}

const app = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/') {
    res.writeHead(200);
    res.end('Hello Holberton School!');
  } else if (req.url === '/students') {
    const dbPath = process.argv[2];
    let body = 'This is the list of our students\n';

    try {
      const result = await countStudents(dbPath);
      body += result;
      res.writeHead(200);
      res.end(body);
    } catch (err) {
      body += err.message;
      res.writeHead(200);
      res.end(body);
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

app.listen(1245);

module.exports = app;
