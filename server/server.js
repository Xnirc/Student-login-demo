require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/error');

const app = express();

// Body Parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect database
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-login-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));

// Custom Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
