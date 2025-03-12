const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const setupSwaggerUI = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const videoRoutes = require('./routes/videoRoutes');
const cors = require('cors');  // Import CORS

var app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
})

// CORS configuration to allow access from specific origins
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://192.168.1.41:3000',  // Replace with your client IP or local IP
            'http://localhost:3000',     // Localhost (for testing from the same machine)
            'http://192.168.1.34:3000',
            'http://localhost:4200',
            '*', // Allow all origins if needed (but be cautious with this in production)
        ];

        if (allowedOrigins.includes(origin) || !origin) {
            console.log(`CORS allowed: ${origin}`); // Debug log
            callback(null, true);  // Allow the request
        } else {
            console.log(`CORS not allowed: ${origin}`); // Debug log
            callback(new Error('Not allowed by CORS'));  // Reject the request if the origin is not allowed
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
    credentials: true,  // Allow credentials if needed (e.g., cookies or authorization headers)
}));

// Middleware to parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Swagger setup
setupSwaggerUI(app);

// Use routes
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/video', videoRoutes);

// This is REQUIRED for IISNODE to work
const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("Server is listening on port 3000");
});
