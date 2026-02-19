require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://netflix-login-chi.vercel.app', 'https://netflix-login-chi.vercel.app/*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'mysql-21c3073e-chandanapc1.b.aivencloud.com',
  port: process.env.DB_PORT || 18448,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD || 'your-password-here',
  database: process.env.DB_NAME || 'defaultdb',
  ssl: {
    rejectUnauthorized: false,
    secure: true
  }
};

// Database connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database and create users table
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('Database initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Registration endpoint
app.post('/api/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  
  try {
    const { userId, username, email, phoneNumber, password } = req.body;

    // Validate input
    if (!userId || !username || !email || !password) {
      console.log('Missing required fields:', { userId, username, email, password });
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    console.log('Connecting to database...');
    const connection = await pool.getConnection();
    console.log('Database connected successfully');

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE user_id = ? OR username = ? OR email = ?',
      [userId, username, email]
    );

    if (existingUsers.length > 0) {
      connection.release();
      console.log('User already exists:', existingUsers[0]);
      return res.status(400).json({ error: 'User ID, username, or email already exists' });
    }

    console.log('Hashing password...');
    // Encode password using bcrypt
    const saltRounds = 10;
    const encodedPassword = await bcrypt.hash(password, saltRounds);

    console.log('Inserting new user...');
    // Insert new user
    const [result] = await connection.execute(
      'INSERT INTO users (user_id, username, email, phone_number, password) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, phoneNumber, encodedPassword]
    );

    connection.release();
    console.log('User inserted successfully:', result.insertId);

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId, username: username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Registration successful for user:', username);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        userId,
        username,
        email,
        phoneNumber
      }
    });
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    res.status(500).json({ 
      error: 'Registration failed',
      details: error.message 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Decode and compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      connection.release();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    connection.release();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        userId: user.user_id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phone_number
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile endpoint
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      'SELECT id, user_id, username, email, phone_number, created_at FROM users WHERE username = ?',
      [req.user.username]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    connection.release();
    res.json({ user: users[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDatabase();
});

module.exports = app;
