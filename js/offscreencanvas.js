const SKIN_COLOR = '#936855'
const LIP_COLOR = '#b8696a'
const EYE_COLOR = '#a1caf1'
const NEUTRAL_COLOR = '#ffffff'


onmessage = function (evt) {
    if (evt.data.canvas) {
        this.canvas = evt.data.canvas;
        this.ctx = canvas.getContext("2d");
    }
    if (evt.data[0]) {
        this.annotations = evt.data[0];
        render()
    }

    function render(time) {

        if (annotations !== undefined) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);


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

            //RightEye
            const keyPointsRightEyeUpper0 = annotations.rightEyeUpper0;
            const keyPointsRightEyeLower0 = annotations.rightEyeLower0;

            //LeftEye
            const keyPointsLeftEyeUpper0 = annotations.leftEyeUpper0;
            const keyPointsLeftEyeLower0 = annotations.leftEyeLower0;

            //Nose
            const keyPointsNoseTip = annotations.noseTip;
            const keyPointsNoseBottom = annotations.noseBottom;
            const keyPointsNoseRightCorner = annotations.noseRightCorner;
            const keyPointsNoseLeftCorner = annotations.noseLeftCorner;

            //Draw everything in order for overlapping
            renderPoints(keypointsSilhouette, true, SKIN_COLOR);

            renderPoints(keypointsLipsUpperOuter, true, LIP_COLOR);
            renderPoints(keypointsLipsLowerOuter, true, LIP_COLOR);
            renderPoints(keypointsLipsUpperInner, true, NEUTRAL_COLOR);
            renderPoints(keypointsLipsLipsLowerInner, true, NEUTRAL_COLOR);

            renderPoints(keypointsRightEyebrowUpper);
            renderPoints(keypointsRightEyebrowLower);
            renderPoints(keypointsLeftEyebrowUpper);
            renderPoints(keypointsLeftEyebrowLower);

            renderPoints(keyPointsRightEyeUpper0, true, EYE_COLOR);
            renderPoints(keyPointsRightEyeLower0, true, EYE_COLOR);

            renderPoints(keyPointsLeftEyeUpper0, true, EYE_COLOR);
            renderPoints(keyPointsLeftEyeLower0, true, EYE_COLOR);

            // renderPoints(keyPointsNoseTip);
            // renderPoints(keyPointsNoseBottom);
            // renderPoints(keyPointsNoseRightCorner);
            // renderPoints(keyPointsNoseLeftCorner);

            annotations = null;
        }
    }

    function renderPoints(keypoints, closePath, color) {
        ctx.beginPath();
        var x;
        var y;
        var xStart;
        var yStart;
        for (let i = 0; i < keypoints.length; i++) {
            if (x == undefined && y == undefined) {
                x = keypoints[i][0];
                y = keypoints[i][1];
                xStart = x;
                yStart = y;
                ctx.moveTo(x, y);
            } else {
                xNext = keypoints[i][0];
                yNext = keypoints[i][1];
                ctx.lineTo(xNext, yNext);
                x = xNext;
                y = yNext;
            }
        }
        ctx.stroke();
        if (closePath) {
            ctx.lineTo(xStart, yStart);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

    }
};