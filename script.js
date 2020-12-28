// Recorder's elements
let audioElement = document.getElementById('audio');
let recordButton = document.getElementById('record-button');
let stopButton = document.getElementById('stop-button');

// Save all the recordings
let chunks = [];

let mediaRecorder = null;

// Get browser's permission to use media input (microphone)
const getMedia = async () => {
  let mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Interact with the media stream
  mediaRecorder = new MediaRecorder(mediaStream);

  // Handle buttons clicked after get the media stream
  recordButton.onclick = startRecording;
  stopButton.onclick = stopRecording;

  // Handle Blob data after it being made available for use
  mediaRecorder.ondataavailable = saveCurrentRecording;

  // Create audio file
  mediaRecorder.onstop = sendToMediaPlayer;
};

// Handle record button clicked
const startRecording = () => {
  mediaRecorder.start();

  recordButton.innerHTML = 'Resume';
  recordButton.style.border = '2px red solid';
  recordButton.style.background = 'rgba(255, 0, 0, 0.15)';
  recordButton.style.color = 'red';

  recordButton.disabled = true;
  recordButton.style.display = 'none';

  stopButton.disabled = false;
  stopButton.style.display = 'block';
};

// Handle stop button clicked
const stopRecording = () => {
  mediaRecorder.stop();

  recordButton.disabled = false;
  recordButton.style.display = 'block';

  stopButton.disabled = true;
  stopButton.style.display = 'none';
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

  //clear the recorded chunks if preferred
  // chunks = [];
};

getMedia();
