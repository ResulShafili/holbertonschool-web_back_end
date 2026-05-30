const http = require('http');
const fs = require('fs');

/**
 * Reads CSV and returns a formatted string with student stats.
 * Mirrors 3-read_file_async.js logic but resolves with a string
 * instead of console.log, so the HTTP server can send it as response body.
 * @param {string} path - Path to the CSV database file.
 * @returns {Promise<string>}
 */
function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (error, data) => {
      if (error) {
        reject(new Error('Cannot load the database'));
        return;
      }

      // Split into lines and filter out empty / whitespace-only lines
      const lines = data.split('\n').filter((line) => line.trim() !== '');

      // Remove the header row
      const header = lines.shift();
      if (!header) {
        resolve('Number of students: 0');
        return;
      }

      const fields = {};
      let totalStudents = 0;

      for (const line of lines) {
        const studentData = line.split(',');
        // Validate the row has all required columns
        if (studentData.length >= 4) {
          const firstName = studentData[0].trim();
          const field = studentData[3].trim();
          if (!fields[field]) fields[field] = [];
          fields[field].push(firstName);
          totalStudents += 1;
        }
      }

      const output = [];
      output.push(`Number of students: ${totalStudents}`);

      for (const field of Object.keys(fields)) {
        output.push(
          `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}`
        );
      }

      resolve(output.join('\n'));
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
      const stats = await countStudents(dbPath);
      body += stats;
    } catch (err) {
      body += err.message;
    }

    res.writeHead(200);
    res.end(body);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

app.listen(1245);

module.exports = app;
