const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = require('../utils/upload'); // Assuming this is your file upload middleware
const videoController = require('../controllers/videoController');

const router = express.Router();

/**
 * @swagger
 * /video/upload:
 *   post:
 *     description: Upload a video file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: video
 *         type: file
 *         required: true
 *         description: The video file to upload
 *     responses:
 *       200:
 *         description: Video uploaded and processed successfully
 *       400:
 *         description: No video file uploaded
 *       500:
 *         description: Error processing the video
 */
router.post('/upload', upload.single('video'), videoController.uploadVideo);

/**
 * @swagger
 * /video/{id}:
 *   get:
 *     description: Get a video by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Video ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video found
 *       404:
 *         description: Video not found
 */
router.get('/:id', (req, res) => {
    const videoId = req.params.id;
    // Logic to fetch the video by ID
    res.send(`Video with ID: ${videoId}`);
});

module.exports = router;
