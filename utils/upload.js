const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use `/tmp` instead of `uploads/videos` (Vercel allows writing only in `/tmp`)
const uploadDir = '/tmp/uploads/videos';

// Ensure the directory exists before saving files
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage settings for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save file in the `/tmp/uploads/videos` directory
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext; // Generate a unique file name
        cb(null, filename);
    },
});

// Set up multer with storage configuration and file validation
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /mp4|mov|avi|mkv/; // Allow specific video file types
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extname && mimeType) {
            return cb(null, true);
        }
        cb(new Error('Invalid video file type'));
    },
});

module.exports = upload;
