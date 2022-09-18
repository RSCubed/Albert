var msgs = []; //string array of all messages sent, every other value is sent, received, sent, received

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
      alert(res.text);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return "";
    });
  return "";
}

function apiResult(rec: any) {
  // var userText: string = addRecording(rec);
  // if (userText == "") {
  //   return;
  // }
  // msgs.push(userText);
  // let res: string = ""; //call from response api: response(msgs)
  // msgs.push(res);
  // return res;

  fetch("http:/localhost:3000/albert", {
    method: "POST",
    body: rec,
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
