onmessage = function (evt) {
    if (evt.data.canvas) {
        this.canvas = evt.data.canvas;
        this.ctx = canvas.getContext("2d");
    } else {
        if (evt.data[0]) {
            this.annotations = evt.data[0];
            render()
        }
    }
    function render(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (annotations !== undefined) {
            ctx.beginPath();

            //Lips
            const keypointsLipsUpperOuter = annotations.lipsUpperOuter;
            const keypointsLipsLowerOuter = annotations.lipsLowerOuter;
            const keypointsLipsUpperInner = annotations.lipsUpperInner;
            const keypointsLipsLipsLowerInner = annotations.lipsLowerInner;

            //Silhouette
            const keypointsSilhouette = annotations.silhouette;

            //Eyebrows
            const keypointsRightEyebrowUpper = annotations.rightEyebrowUpper;
            const keypointsRightEyebrowLower = annotations.rightEyebrowLower;
            const keypointsLeftEyebrowUpper = annotations.leftEyebrowUpper;
            const keypointsLeftEyebrowLower = annotations.leftEyebrowLower;

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

            ctx.stroke();
            annotations = null;
        }
        // requestAnimationFrame(render);
    }

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