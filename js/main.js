window.addEventListener('DOMContentLoaded', (event) => {
    setupPage();
});

const peers = ['https://gundb-multiserver.glitch.me/qvdev'];
const opt = { peers: peers, localStorage: false, radisk: false };
let gunDB = Gun(opt);
const pid = gunDB._.opt.pid;

gunDB.on("in", function (msg) {
    console.log(msg.event)
    if (msg.event == "face") {
        worker.postMessage([msg.data]);
    } else if (msg.event == "audio") {
        play(msg.data);
    }
});

function out(key, value) {
    gunDB.on("out", {
        pid: pid,
        event: key,
        data: value
    });
}

async function setupCamera() {
    video = document.getElementById('video');

    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': true,
        'video': {
            facingMode: 'user',
            width: { max: 480 },
            height: { max: 320 }
        },
    });
    video.srcObject = stream;

    // doAudio(stream);

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

function doAudio(stream) {
    context = new AudioContext();
    var source = context.createMediaStreamSource(stream);
    var processor = context.createScriptProcessor(2048, 1, 1);
    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function (e) {
        // Do something with the data, i.e Convert this to WAV
        // audiodata = (e.inputBuffer.getChannelData(0));
        audiodata = new Int16Array(convertFloat32ToInt16(e.inputBuffer.getChannelData(0)));
        // console.log("LEFT::" + audiodata);        
        out("audio", audiodata);
        // socket.send(JSON.stringify({ sound: audiodata, to: to, from: '$username', text: '' }));
    };
}

function play(raw) {
    sound_array = [];
    for (i in raw) {
        sound_array[i] = (raw[i]);
    }
    sound_array32 = int16ToFloat32(sound_array);

    //alert(raw.length);
    var audioBuffer = context.createBuffer(1, sound_array32.length, context.sampleRate);
    audioBuffer.getChannelData(0).set(sound_array32);
    var source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start(0);
}

function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);

    while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }

    return buf.buffer;

}

function int16ToFloat32(inputArray) {

    let int16arr = new Int16Array(inputArray)
    var output = new Float32Array(int16arr.length);
    for (var i = 0; i < int16arr.length; i++) {
        var int = int16arr[i];
        var float = (int >= 0x8000) ? -(0x10000 - int) / 0x8000 : int / 0x7FFF;
        output[i] = float;
    }
    return output;
}

// const renderPrediction = async () => {
//     const predictions = await model.estimateFaces(document.getElementById("local_video"));
//     if (predictions !== undefined && predictions.length > 0) {
//         // out("face", predictions[0].annotations);
//         worker.postMessage([predictions[0].annotations]);//Local use debug
//     }
//     requestAnimationFrame(renderPrediction);
// };

const setupPage = async () => {
    await setupCamera();
    video.play();

    // videoWidth = video.videoWidth;
    // videoHeight = video.videoHeight;
    // video.width = videoWidth;
    // video.height = videoHeight;

    // canvas = document.getElementById('output');
    // canvas.width = videoWidth;
    // canvas.height = videoHeight;

    // var offscreen = canvas.transferControlToOffscreen();
    // worker = new Worker("./js/offscreencanvas.js");
    // worker.postMessage({ canvas: offscreen }, [offscreen]);
    // worker.postMessage([INITIAL_FACE]);

    // model = await facemesh.load();
    // renderPrediction();

    // model = await facemesh.load();
    // renderPrediction();
}