const video = document.getElementById("videoelm");
const loadFaceAPI = async () =>{
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');

}

// su dung API de yeu cau nguoi dung cho chung ta lay data tu wedcam
function getCameraStream(){
   
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: {} })
            .then(stream =>{
                // su dung the stream de add vao the video
                video.srcObject = stream;

            });
    }
}
// using api show bieucam, gioi tinh, khuon majt
video.addEventListener('playing',()=>{
    const canvas = faceapi.createCanvasFromMedia(video);
    // them canvas vao html
    document.body.append(canvas);
    const displaysize = {
        width: video.videoWidth,
        height: video.videoHeight
    }

    // chay lai nhieu lan so voi chung ta quy dinh
    setInterval(async()=>{
        const detects = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        const resizedDetects = faceapi.resizeResults(detects, displaysize);
        canvas.getContext('2d').clearRect(0,0, displaysize.width, displaysize.height);

        faceapi.draw.drawDetections(canvas, resizedDetects);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetects);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetects);
    },300);
});

loadFaceAPI().then(getCameraStream);