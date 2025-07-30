const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // ✅ replace with your MySQL user
  password: '',         // ✅ replace with your password
  database: 'teeth_annotation',  // ✅ make sure this DB exists
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL DB ✅');
});

module.exports = connection;
