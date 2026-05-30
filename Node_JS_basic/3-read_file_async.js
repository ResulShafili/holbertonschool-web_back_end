const fs = require('fs');

function countStudents(path) {
  return fs.promises.readFile(path, 'utf8')
    .then((data) => {
      const rows = data.split('\n').filter((line) => line.trim() !== '');
      if (rows.length <= 1) {
        throw new Error('Cannot load the database');
      }

      const students = rows.slice(1);
      const totalStudentsMsg = `Number of students: ${students.length}`;
      console.log(totalStudentsMsg);

      const byField = {};
      students.forEach((student) => {
        const [firstname, , , field] = student.split(',');
        if (field) {
          const trimmedField = field.trim();
          const trimmedName = firstname.trim();
          if (!byField[trimmedField]) {
            byField[trimmedField] = [];
          }
          byField[trimmedField].push(trimmedName);
        }
      });

      const responseLines = [totalStudentsMsg];

      // CS və SWE sıralamasının pozulmaması üçün nizamlı çıxış
      for (const [field, names] of Object.entries(byField)) {
        const line = `Number of students in ${field}: ${names.length}. List: ${names.join(', ')}`;
        console.log(line);
        responseLines.push(line);
      }

      return responseLines.join('\n');
    })
    .catch((error) => {
      if (error.message === 'Cannot load the database') {
        throw error;
      }
      throw new Error('Cannot load the database');
    });
}

module.exports = countStudents;
