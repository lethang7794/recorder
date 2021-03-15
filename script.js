// ===================== STOPWATCH - BEGIN =================================
// Convert time to a format of hours, minutes, seconds, and milliseconds
function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);

  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let diffInMs = (diffInSec - ss) * 100;
  let ms = Math.floor(diffInMs);

  let formattedMM = mm.toString().padStart(2, '0');
  let formattedSS = ss.toString().padStart(2, '0');
  let formattedMS = ms.toString().padStart(2, '0');

  return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

// Declare variables to use in our functions below

let startTime;
let elapsedTime = 0;
let timerInterval;

// Create function to modify innerHTML

function print(txt) {
  document.getElementById('display').innerHTML = txt;
}

// Create "start", "pause" and "reset" functions

function start() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function printTime() {
    elapsedTime = Date.now() - startTime;
    print(timeToString(elapsedTime));
  }, 10);
  // showButton('PAUSE');
}
// ======================== STOPWATCH - END =================================

// Recorder's elements
let audioElement = document.getElementById('audio');
let startButton = document.getElementById('start-button');
let stopButton = document.getElementById('stop-button');
let timeDisplay = document.getElementById('display');

// Save all the recordings
let recordedChunks = [];

let mediaRecorder = null;

// Get browser's permission to use media input (microphone)
const getMedia = async () => {
  let mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Interact with the media stream
  mediaRecorder = new MediaRecorder(mediaStream);

  // Handle buttons clicked after get the media stream
  stopButton.onclick = stopRecording;

  // Handle Blob data after it being made available for use
  mediaRecorder.ondataavailable = handleDataAvailable;

  // Create audio file
  mediaRecorder.onstop = sendToMediaPlayer;
};

// Handle record button clicked
const startRecording = async () => {
  await getMedia();

  recordedChunks = [];
  mediaRecorder.start();
  start(); // Start stopwatch

  startButton.disabled = true;
  startButton.style.display = 'none';

  stopButton.disabled = false;
  stopButton.style.display = 'block';

  timeDisplay.style.display = 'block';
  audioElement.style.display = 'none';
};

// Handle pause button clicked
const stopRecording = () => {
  mediaRecorder.stop();
  clearInterval(timerInterval);
  print('00:00:00');
  elapsedTime = 0;

  startButton.disabled = false;
  startButton.style.display = 'block';

  stopButton.disabled = true;
  stopButton.style.display = 'none';

  timeDisplay.style.display = 'none';
  audioElement.style.display = 'block';
};

const handleDataAvailable = (e) => {
  recordedChunks.push(e.data);
  console.log(recordedChunks);
};

const sendToMediaPlayer = () => {
  const blob = new Blob(recordedChunks, {
    type: 'audio/mp4; codecs=opus',
  });
  const audioURL = URL.createObjectURL(blob);
  audioElement.src = audioURL;
};

startButton.onclick = startRecording;
