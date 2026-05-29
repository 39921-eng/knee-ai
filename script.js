const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const result = document.getElementById("result");
const upload = document.getElementById("upload");

let currentImage = null;

// เปิดกล้อง
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            },
            audio: false
        });

        video.srcObject = stream;
        video.style.display = "block";

    } catch (err) {
        alert("เปิดกล้องไม่ได้ กรุณาอนุญาตการใช้กล้อง");
        console.error(err);
    }
}

// โหลดรูปจาก upload
upload.addEventListener("change", function(e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {

        currentImage = new Image();

        currentImage.onload = function() {

            const ctx = canvas.getContext("2d");

            canvas.width = currentImage.width;
            canvas.height = currentImage.height;

            ctx.drawImage(currentImage, 0, 0);

        };

        currentImage.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// วิเคราะห์
function analyzeImage() {

    const ctx = canvas.getContext("2d");

    if (!currentImage) {
        alert("กรุณาเลือกรูปก่อน");
        return;
    }

    // วาดภาพใหม่
    ctx.drawImage(currentImage, 0, 0);

    // จุดจำลอง
    const hipX = canvas.width * 0.52;
    const hipY = canvas.height * 0.18;

    const kneeX = canvas.width * 0.50;
    const kneeY = canvas.height * 0.50;

    const ankleX = canvas.width * 0.48;
    const ankleY = canvas.height * 0.85;

    // เส้นหลัก
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(ankleX, ankleY);
    ctx.stroke();

    // วงกลมจุด
    ctx.fillStyle = "red";

    [ [hipX, hipY], [kneeX, kneeY], [ankleX, ankleY] ].forEach(p => {

        ctx.beginPath();
        ctx.arc(p[0], p[1], 10, 0, Math.PI * 2);
        ctx.fill();

    });

    // ข้อความ
    ctx.fillStyle = "yellow";
    ctx.font = "28px Arial";

    ctx.fillText("Hip Center", hipX + 20, hipY);
    ctx.fillText("Knee Center", kneeX + 20, kneeY);
    ctx.fillText("Ankle Center", ankleX + 20, ankleY);

    // แสดงผลวิเคราะห์
    result.innerHTML = `
    
    <div class="analysis-card">

        <h2>ผลการวิเคราะห์มุม (แนวกระดูก)</h2>

        <div class="angle-box">
            <h3>Angle A</h3>
            <p>6.3° Valgus</p>
        </div>

        <div class="angle-box">
            <h3>Angle B</h3>
            <p>2.8° Valgus</p>
        </div>

        <div class="angle-box">
            <h3>Angle C</h3>
            <p>4.1° Valgus</p>
        </div>

        <div class="summary-box">
            <h3>สรุปผล</h3>
            <p>ตรวจพบแนวขาโก่งเล็กน้อย</p>
        </div>

    </div>

    `;
}
