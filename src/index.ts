//string array of all messages sent, every other value is sent, received, sent, received
var msgs: Array<string> = ["Hello, how can I help today?"];

function addRecording(rec: any): string {
  console.log("inside add rexroidng");
  fetch("./transcribe", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ audio: rec }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      msgs.push(res.text);
      callAlbert();
      return res;
    })
    .catch((err) => {
      console.log(err);
      return "";
    });
  return "";
}

// callAlbert();

function callAlbert() {
  let output = "";

  msgs.forEach((msg, i) => {
    if (i % 2 == 0) {
      output += "Albert: " + msg + "\n";
    } else {
      output += "Human: " + msg + "\n";
    }
  });

  console.log(output);

  fetch("./albert", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: output }),
  })
    .then((res) => res.json())
    .then((response) => {
      let res: string = response.result;
      var sp1 = msgs.push(res);
    })
    .catch((err) => {
      msgs.push("");
    });
  return msgs;
}

//**blob to dataURL**
function blobToDataURL(blob, callback) {
  var a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  };
  a.readAsDataURL(blob);
}

const recordAudio = () =>
  new Promise(async (resolve) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    const start = () => {
      mediaRecorder.start();
      audioChunks = [];
    };

    const stop = () =>
      new Promise((resolve) => {
        mediaRecorder.addEventListener("stop", () => {
          let audioBlob = new Blob(audioChunks);
          // audioBlob = audioBlob.slice(
          //   0,
          //   audioBlob.size,
          //   "audio/webm;codecs=opus"
          // );

          console.log(mediaRecorder.mimeType);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          // console.log(audio);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

let recording = false;
const audioChunks = [];
let recorder: unknown;

(async () => {
  recorder = await recordAudio();
})();

async function audioButtonClicked() {
  const microphone = document.getElementById("microphone");
  if (recording) {
    microphone.classList.remove("glow");
    //@ts-ignore
    const audio = await recorder.stop();

    blobToDataURL(audio.audioBlob, function (dataurl) {
      console.log("calling add recroidng");
      addRecording(dataurl);
    });

    recording = false;
    audio.play();
    return;
  }
  recording = true;
  //@ts-ignore
  recorder.start();
  microphone.classList.add("glow");
}

// (async () => {
// 	//@ts-ignore
//   await sleep(3000);
// 	//@ts-ignore
//   audio.play();
// })();
