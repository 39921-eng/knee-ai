const video = document.getElementById("video");

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const result = document.getElementById("result");

const upload = document.getElementById("upload");

const pose = new Pose({

locateFile: (file) => {

return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;

}

});

pose.setOptions({

modelComplexity: 1,
smoothLandmarks: true,
enableSegmentation: false,
minDetectionConfidence: 0.5,
minTrackingConfidence: 0.5

});

pose.onResults(onResults);

upload.addEventListener("change", async (e) => {

const file = e.target.files[0];

if(!file) return;

const img = new Image();

img.src = URL.createObjectURL(file);

img.onload = async () => {

canvas.width = img.width;

canvas.height = img.height;

ctx.drawImage(img,0,0);

await pose.send({ image: img });

};

});

function onResults(results){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.drawImage(results.image,0,0,canvas.width,canvas.height);

if(results.poseLandmarks){

const leftHip =
results.poseLandmarks[23];

const leftKnee =
results.poseLandmarks[25];

const leftAnkle =
results.poseLandmarks[27];

ctx.beginPath();

ctx.moveTo(
leftHip.x * canvas.width,
leftHip.y * canvas.height
);

ctx.lineTo(
leftAnkle.x * canvas.width,
leftAnkle.y * canvas.height
);

ctx.strokeStyle = "red";

ctx.lineWidth = 5;

ctx.stroke();

if(
leftKnee.x < leftHip.x &&
leftKnee.x < leftAnkle.x
){

result.innerHTML =
"⚠️ ผลวิเคราะห์: ขาโก่ง";

}

else if(
leftKnee.x > leftHip.x &&
leftKnee.x > leftAnkle.x
){

result.innerHTML =
"⚠️ ผลวิเคราะห์: เข่าชน";

}

else{

result.innerHTML =
"✅ ผลวิเคราะห์: ปกติ";

}

}

}
