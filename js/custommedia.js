const getUserMediaFn = MediaDevices.prototype.getUserMedia;
let model, worker;

MediaDevices.prototype.getUserMedia = async function () {
    const stream = await getUserMediaFn.call(navigator.mediaDevices, ...arguments);
    const video = document.createElement('video');
    video.id = "local_video";
    video.autoplay = true;
    video.muted = true;
    video.hidden = true;
    video.srcObject = stream;
    await video.play();
    const constraints = arguments[0];
    document.body.appendChild(video);

    var canvas = document.createElement('canvas')
    canvas.id = "output";
    canvas.style.transform = "scale(0.01)";
    document.body.appendChild(canvas);
    canvas.width = constraints.video.width.max;
    canvas.height = constraints.video.height.max;

    var offscreen = canvas.transferControlToOffscreen();
    worker = new Worker("./js/offscreencanvas.js");
    worker.postMessage({ canvas: offscreen }, [offscreen]);
    worker.postMessage([INITIAL_FACE]);

    var newStream = new MediaStream();
    newStream.addTrack(stream.getAudioTracks()[0]);
    newStream.addTrack(canvas.captureStream(24).getVideoTracks()[0]);

    model = await facemesh.load();
    renderPrediction();

    return newStream;
}

const renderPrediction = async () => {
    const predictions = await model.estimateFaces(document.getElementById("local_video"));
    if (predictions !== undefined && predictions.length > 0) {
        // out("face", predictions[0].annotations);
        worker.postMessage([predictions[0].annotations]);//Local use debug
    }
    requestAnimationFrame(renderPrediction);
};