var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
//string array of all messages sent, every other value is sent, received, sent, received
var msgs = ["Hello, how can I help today?"];
function addRecording(rec) {
    console.log("inside add rexroidng");
    fetch("./transcribe", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio: rec }),
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        console.log(res);
        msgs.push(res.text);
        callAlbert();
        return res;
    })
        .catch(function (err) {
        console.log(err);
        return "";
    });
    return "";
}
// callAlbert();
function callAlbert() {
    var output = "";
    msgs.forEach(function (msg, i) {
        if (i % 2 == 0) {
            output += "Albert: " + msg + "\n";
        }
        else {
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
        .then(function (res) { return res.json(); })
        .then(function (response) {
        var res = response.result;
        var sp1 = msgs.push(res);
    })
        .catch(function (err) {
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
var recordAudio = function () {
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var stream, mediaRecorder, audioChunks, start, stop;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 1:
                    stream = _a.sent();
                    mediaRecorder = new MediaRecorder(stream);
                    audioChunks = [];
                    mediaRecorder.addEventListener("dataavailable", function (event) {
                        audioChunks.push(event.data);
                    });
                    start = function () {
                        mediaRecorder.start();
                        audioChunks = [];
                    };
                    stop = function () {
                        return new Promise(function (resolve) {
                            mediaRecorder.addEventListener("stop", function () {
                                var audioBlob = new Blob(audioChunks);
                                // audioBlob = audioBlob.slice(
                                //   0,
                                //   audioBlob.size,
                                //   "audio/webm;codecs=opus"
                                // );
                                console.log(mediaRecorder.mimeType);
                                var audioUrl = URL.createObjectURL(audioBlob);
                                var audio = new Audio(audioUrl);
                                // console.log(audio);
                                var play = function () { return audio.play(); };
                                resolve({ audioBlob: audioBlob, audioUrl: audioUrl, play: play });
                            });
                            mediaRecorder.stop();
                        });
                    };
                    resolve({ start: start, stop: stop });
                    return [2 /*return*/];
            }
        });
    }); });
};
var sleep = function (time) { return new Promise(function (resolve) { return setTimeout(resolve, time); }); };
var recording = false;
var audioChunks = [];
var recorder;
(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, recordAudio()];
            case 1:
                recorder = _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
function audioButtonClicked() {
    return __awaiter(this, void 0, void 0, function () {
        var microphone, audio;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    microphone = document.getElementById("microphone");
                    if (!recording) return [3 /*break*/, 2];
                    microphone.classList.remove("glow");
                    return [4 /*yield*/, recorder.stop()];
                case 1:
                    audio = _a.sent();
                    blobToDataURL(audio.audioBlob, function (dataurl) {
                        console.log("calling add recroidng");
                        addRecording(dataurl);
                    });
                    recording = false;
                    audio.play();
                    return [2 /*return*/];
                case 2:
                    recording = true;
                    //@ts-ignore
                    recorder.start();
                    microphone.classList.add("glow");
                    return [2 /*return*/];
            }
        });
    });
}
// (async () => {
// 	//@ts-ignore
//   await sleep(3000);
// 	//@ts-ignore
//   audio.play();
// })();
