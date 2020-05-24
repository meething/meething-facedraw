onmessage = function (evt) {
    if (evt.data.canvas) {
        this.canvas = evt.data.canvas;
        this.ctx = canvas.getContext("2d");
    } else {
        if (evt.data[0].length) {
            this.predictions = evt.data[0];
        }
    }
    function render(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (predictions !== undefined && predictions.length > 0) {
            ctx.beginPath();
            for (let i = 0; i < predictions.length; i++) {
                //Lips
                const keypointsLipsUpperOuter = predictions[i].annotations.lipsUpperOuter;
                const keypointsLipsLowerOuter = predictions[i].annotations.lipsLowerOuter;
                const keypointsLipsUpperInner = predictions[i].annotations.lipsUpperInner;
                const keypointsLipsLipsLowerInner = predictions[i].annotations.lipsLowerInner;

                //Silhouette
                const keypointsSilhouette = predictions[i].annotations.silhouette;

                //Eyebrows
                const keypointsRightEyebrowUpper = predictions[i].annotations.rightEyebrowUpper;
                const keypointsRightEyebrowLower = predictions[i].annotations.rightEyebrowLower;
                const keypointsLeftEyebrowUpper = predictions[i].annotations.leftEyebrowUpper;
                const keypointsLeftEyebrowLower = predictions[i].annotations.leftEyebrowLower;

                //Draw everything
                renderPoints(keypointsLipsUpperOuter);
                renderPoints(keypointsLipsLowerOuter);
                renderPoints(keypointsLipsUpperInner);
                renderPoints(keypointsLipsLipsLowerInner);
                renderPoints(keypointsSilhouette);
                renderPoints(keypointsRightEyebrowUpper);
                renderPoints(keypointsRightEyebrowLower);
                renderPoints(keypointsLeftEyebrowUpper);
                renderPoints(keypointsLeftEyebrowLower);
            }
            ctx.stroke();
            predictions = null;
        }
    }
    requestAnimationFrame(render);

    function renderPoints(keypoints) {
        var x;
        var y;        
        for (let i = 0; i < keypoints.length; i++) {
            if (x == undefined && y == undefined) {
                x = keypoints[i][0];
                y = keypoints[i][1];
                ctx.moveTo(x, y);
            } else {
                xNext = keypoints[i][0];
                yNext = keypoints[i][1];
                ctx.lineTo(xNext, yNext);
                x = xNext;
                y = yNext;
                ctx.moveTo(x, y);
            }
        }        
    }
};