const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const setupSwaggerUI = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const videoRoutes = require('./routes/videoRoutes');
const cors = require('cors');

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});


// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch((err) => console.log(err));

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://192.168.1.41:3000',
            'http://localhost:3000',
            'http://192.168.1.34:3000',
            'http://localhost:4200',
            '*',
        ];
        if (allowedOrigins.includes(origin) || !origin) {
            console.log(`CORS allowed: ${origin}`);
            callback(null, true);
        } else {
            console.log(`CORS not allowed: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Middleware to parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
setupSwaggerUI(app);

// Use routes
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/video', videoRoutes);
// This is REQUIRED for IISNODE to work
// const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
//     console.log("Server is listening on port 3000");
// }); 
// Export the app for Vercel
module.exports = app;
