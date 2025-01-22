const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sunita#11mali',
  database: 'your_db_name'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// Handle signup POST request
app.post('/signup', (req, res) => {
  const { first_name, last_name, gender, phone_number, dob, location, password } = req.body;

  const query = `INSERT INTO users (first_name, last_name, gender, phone_number, dob, location, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [first_name, last_name, gender, phone_number, dob, location, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Database error' });
    } else {
      res.json({ success: true, message: 'Sign-up successful' });
    }
  });
});

// Handle login POST request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      res.status(500).send('Database error');
    } else if (results.length > 0) {
      res.send('Login successful');
    } else {
      res.send('Invalid credentials');
    }
  });
});

// Serve home3.html
app.get('/home3.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home3.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
