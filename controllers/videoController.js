const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');

ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe'); // Adjust if needed

// 🟢 BunnyCDN Credentials
const BUNNY_STORAGE_ZONE = 'eportdemostorage';
const BUNNY_STORAGE_API_KEY = 'a42483dc-45e5-42f6-ad9df3e9947f-0e3a-4bd3';
const BUNNY_PULL_ZONE = 'excellenceportvideo.b-cdn.net';

// 🟢 Upload to Bunny.net with Retry Logic
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

// 🟢 Video Upload & Conversion
exports.uploadVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoPath = req.file.path; // Corrected
    const videoName = path.parse(req.file.filename).name;
    const outputDir = '/tmp/converted_videos';

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const outputM3U8 = path.join(outputDir, `${videoName}.m3u8`);

    ffmpeg(videoPath)
        .outputOptions([
            '-preset fast',
            '-c:v h264',
            '-b:v 1000k', // 🔹 Lower bitrate for smaller files
            '-maxrate 1500k', // 🔹 Limits max bitrate
            '-bufsize 3000k',
            '-c:a aac',
            '-b:a 96k', // 🔹 Lower audio bitrate
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
            console.log('🎬 HLS processing finished');

            try {
                // ✅ Upload .m3u8 file
                const m3u8Url = await uploadToBunny(outputM3U8, `videos/${videoName}.m3u8`);

                // ✅ Upload .ts files SEQUENTIALLY to prevent Bunny.net rate limits
                const tsFiles = fs.readdirSync(outputDir).filter(file => file.startsWith(videoName) && file.endsWith('.ts'));

                for (const tsFile of tsFiles) {
                    await uploadToBunny(path.join(outputDir, tsFile), `videos/${tsFile}`);
                    await new Promise(res => setTimeout(res, 1000)); // 🔹 1s delay between uploads
                }

                res.status(200).json({
                    message: 'Video uploaded and processed successfully',
                    videoUrl: m3u8Url,
                });
            } catch (uploadError) {
                res.status(500).json({ message: 'Error uploading to Bunny.net', error: uploadError.message });
            }
        })
        .on('error', function (err) {
            res.status(500).json({ message: 'Error processing video', error: err.message });
        })
        .run();
};
