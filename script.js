// Recorder's elements
let audioElement = document.getElementById('audio');
let startButton = document.getElementById('start-button');
let resumeButton = document.getElementById('resume-button');
let pauseButton = document.getElementById('pause-button');

// Save all the recordings
let chunks = [];

let mediaRecorder = null;

// Get browser's permission to use media input (microphone)
const getMedia = async () => {
  let mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Interact with the media stream
  mediaRecorder = new MediaRecorder(mediaStream);

  // Handle buttons clicked after get the media stream
  resumeButton.onclick = resumeRecording;
  pauseButton.onclick = pauseRecording;

  // Handle Blob data after it being made available for use
  mediaRecorder.ondataavailable = saveCurrentRecording;

  // Create audio file
  mediaRecorder.onstop = sendToMediaPlayer;
};

// Handle record button clicked
const startRecording = async () => {
  await getMedia();

  mediaRecorder.start();

  startButton.disabled = false;
  startButton.style.display = 'none';

  resumeButton.disabled = true;
  resumeButton.style.display = 'none';

  pauseButton.disabled = false;
  pauseButton.style.display = 'block';
};

const resumeRecording = () => {
  mediaRecorder.start();

  resumeButton.disabled = true;
  resumeButton.style.display = 'none';

  pauseButton.disabled = false;
  pauseButton.style.display = 'block';

  audioElement.pause();
  audioElement.style.display = 'none';
};

// Handle stop button clicked
const pauseRecording = () => {
  mediaRecorder.stop();

  resumeButton.disabled = false;
  resumeButton.style.display = 'block';

  pauseButton.disabled = true;
  pauseButton.style.display = 'none';

  audioElement.style.display = 'block';
};

const saveCurrentRecording = (e) => {
  chunks.push(e.data);
  console.log(chunks);
};

const sendToMediaPlayer = () => {
  const blob = new Blob(chunks, {
    type: 'audio/mp4; codecs=opus',
  });
  const audioURL = URL.createObjectURL(blob);
  audioElement.src = audioURL;
};

startButton.onclick = startRecording;
