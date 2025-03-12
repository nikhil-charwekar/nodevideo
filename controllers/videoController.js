const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const axios = require('axios');

// ✅ Set FFmpeg Path Dynamically
ffmpeg.setFfmpegPath(ffmpegPath);
console.log("Using FFmpeg Path:", ffmpegPath);

// ✅ BunnyCDN Credentials
const BUNNY_STORAGE_ZONE = 'eportdemostorage';
const BUNNY_STORAGE_API_KEY = 'a42483dc-45e5-42f6-ad9df3e9947f-0e3a-4bd3';
const BUNNY_PULL_ZONE = 'excellenceportvideo.b-cdn.net';

// ✅ Upload to BunnyCDN Function
async function uploadToBunny(filePath, fileName, retries = 3) {
    const url = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${fileName}`;
    const headers = {
        'AccessKey': BUNNY_STORAGE_API_KEY,
        'Content-Type': 'application/octet-stream',
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const fileData = fs.createReadStream(filePath);
            const response = await axios.put(url, fileData, { headers, timeout: 30000 }); // 30s timeout
            console.log(`✅ Uploaded: ${fileName} - Status:`, response.status);
            return `https://${BUNNY_PULL_ZONE}/${fileName}`;
        } catch (error) {
            console.error(`❌ Upload failed for ${fileName} (Attempt ${attempt}):`, error.message);
            if (attempt === retries) throw new Error(`Failed to upload ${fileName} after ${retries} attempts`);
            await new Promise(res => setTimeout(res, 5000)); // Wait 5s before retrying
        }
    }
}

// ✅ Video Upload & Processing Function
exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const videoPath = req.file.path; // Path of uploaded file
        const videoName = path.parse(req.file.filename).name;
        const outputDir = path.join('/tmp', 'converted_videos'); // ✅ Use /tmp for cloud environments

        // ✅ Ensure /tmp/converted_videos exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputM3U8 = path.join(outputDir, `${videoName}.m3u8`);

        ffmpeg(videoPath)
            .outputOptions([
                '-preset fast',
                '-c:v h264',
                '-b:v 1000k',
                '-maxrate 1500k',
                '-bufsize 3000k',
                '-c:a aac',
                '-b:a 96k',
                '-g 48',
                '-sc_threshold 0',
                '-hls_time 6',
                '-hls_playlist_type vod',
                '-hls_flags independent_segments+delete_segments',
                '-hls_segment_filename', path.join(outputDir, `${videoName}_%03d.ts`),
                '-f hls',
            ])
            .output(outputM3U8)
            .on('end', async function () {
                console.log('🎬 HLS conversion finished');

                try {
                    // ✅ Upload .m3u8 file
                    const m3u8Url = await uploadToBunny(outputM3U8, `videos/${videoName}.m3u8`);

                    // ✅ Upload .ts files SEQUENTIALLY (to avoid Bunny.net rate limits)
                    const tsFiles = fs.readdirSync(outputDir).filter(file => file.startsWith(videoName) && file.endsWith('.ts'));

                    for (const tsFile of tsFiles) {
                        await uploadToBunny(path.join(outputDir, tsFile), `videos/${tsFile}`);
                        await new Promise(res => setTimeout(res, 1000)); // 🔹 1s delay between uploads
                    }

                    res.status(200).json({
                        message: '✅ Video uploaded and processed successfully',
                        videoUrl: m3u8Url,
                    });
                } catch (uploadError) {
                    res.status(500).json({ message: '❌ Error uploading to Bunny.net', error: uploadError.message });
                }
            })
            .on('error', function (err) {
                console.error("❌ FFmpeg processing error:", err.message);
                res.status(500).json({ message: '❌ Error processing video', error: err.message });
            })
            .run();
    } catch (error) {
        console.error("❌ Unexpected error:", error.message);
        res.status(500).json({ message: '❌ Internal server error', error: error.message });
    }
};
