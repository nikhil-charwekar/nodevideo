const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);



const videoUrl = 'https://elearning.qmsrs.com/CourseResources/386/9.%20Completing%20And%20Returning%20Your%20Training%20Course%20Feedback%20Form.mp4'; // Replace with the actual URL

ffmpeg(videoUrl, { timeout: 432000 }).addOptions([
    '-profile:v high',
    '-level 4.0',
    '-start_number 0',
    '-hls_time 5',
    '-hls_list_size 0',
    '-f hls',
    '-b:v 1500k',   // Bitrate
    '-crf 23',       // Adjust CRF for better quality
    '-preset medium' // Use preset for balance between speed and quality
]).output('video/output_qmsrs.m3u8').on('end', () => {
    console.log('HLS encoding is complete!');
}).run();

ffmpeg('video/Pushpa_2.mp4', { timeout: 432000 }).addOptions([
    '-profile:v high',
    '-level 4.0',
    '-start_number 0',
    '-hls_time 5',
    '-hls_list_size 0',
    '-f hls',
    '-b:v 1500k',   // Bitrate
    '-crf 23',       // Adjust CRF for better quality
    '-preset medium' // Use preset for balance between speed and quality
]).output('video/output1.m3u8').on('end', () => {
    console.log('end');
}).run();

ffmpeg('video/Devara.mp4', { timeout: 432000 }).addOptions([
    '-profile:v high',
    '-level 4.0',
    '-start_number 0',
    '-hls_time 5',
    '-hls_list_size 0',
    '-f hls',
    '-b:v 1500k',   // Bitrate
    '-crf 23',       // Adjust CRF for better quality
    '-preset medium' // Use preset for balance between speed and quality
]).output('video/output3.m3u8').on('end', () => {
    console.log('end');
}).run();

ffmpeg('video/Tamannaah.mp4', { timeout: 432000 }).addOptions([
    '-profile:v high',
    '-level 4.0',
    '-start_number 0',
    '-hls_time 5',
    '-hls_list_size 0',
    '-f hls',
    '-b:v 1500k',   // Bitrate
    '-crf 23',       // Adjust CRF for better quality
    '-preset medium' // Use preset for balance between speed and quality
]).output('video/output4.m3u8').on('end', () => {
    console.log('end');
}).run();

ffmpeg('video/Millionaire.mp4', { timeout: 432000 }).addOptions([
    '-profile:v high',
    '-level 4.0',
    '-start_number 0',
    '-hls_time 5',
    '-hls_list_size 0',
    '-f hls',
    '-b:v 1500k',   // Bitrate
    '-crf 23',       // Adjust CRF for better quality
    '-preset medium' // Use preset for balance between speed and quality
]).output('video/output5.m3u8').on('end', () => {
    console.log('end');
}).run();