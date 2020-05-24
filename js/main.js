window.addEventListener('DOMContentLoaded', (event) => {
    setupPage();
});

let model, ctx, videoWidth, videoHeight, video, canvas, worker;

const peers = ['https://gundb-multiserver.glitch.me/qvdev'];
const opt = { peers: peers, localStorage: false, radisk: false };
let gunDB = Gun(opt);
const pid = gunDB._.opt.pid;

gunDB.on("in", function (msg) {
    console.log(msg.event)
    if (msg.event == "face") {
        worker.postMessage([msg.data]);
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
        'audio': false,
        'video': {
            facingMode: 'user',
            width: { max: 480 },
            height: { max: 320 }
        },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

const renderPrediction = async () => {
    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
    // array of detected faces from the MediaPipe graph.
    const predictions = await model.estimateFaces(document.querySelector("video"));
    // worker.postMessage([predictions]);
    if (predictions !== undefined && predictions.length > 0) {
        // ctx.beginPath();
        // for (let i = 0; i < predictions.length; i++) {
        out("face", predictions[0].annotations);
        // worker.postMessage([predictions[0].annotations]);
        // }
    }

    requestAnimationFrame(renderPrediction);
};

const setupPage = async () => {
    await setupCamera();
    video.play();

    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    canvas = document.getElementById('output');
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    var offscreen = canvas.transferControlToOffscreen();
    worker = new Worker("./js/offscreencanvas.js");
    worker.postMessage({ canvas: offscreen }, [offscreen]);

    model = await facemesh.load();
    renderPrediction();
}