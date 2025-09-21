const { spawn } = require("child_process");
let ffmpeg;

function startRecording(filename = "test.mkv") {
  ffmpeg = spawn("ffmpeg", [
    "-y",
    "-f", "gdigrab",
    "-framerate", "25",
    "-offset_x", "-1920",   // координата X левого монитора
    "-offset_y", "0",       // координата Y (верхний край)
    "-video_size", "1920x1050", // размер левого монитора
    "-i", "desktop",
    "-pix_fmt", "yuv420p",
    "-rtbufsize", "1500M",
    "-movflags", "+faststart",
    filename
 ]);

  ffmpeg.stderr.on("data", (data) => console.log(`FFmpeg: ${data}`));
  console.log("Запись началась...");
}

  function stopRecording() {
    return new Promise((resolve) => {
      if (ffmpeg) {
        ffmpeg.on('exit', (code, signal) => {
          console.log("Запись остановлена");
          resolve();
        });
        ffmpeg.kill("SIGINT");
      } else {
        resolve();
      }
    });
  }


module.exports = { startRecording, stopRecording };
