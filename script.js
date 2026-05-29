const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function startCamera() {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

    } catch (err) {

        alert("เปิดกล้องไม่ได้ ใช้อัปโหลดรูปแทน");

    }
}

function analyzeImage() {

    const fileInput = document.getElementById("upload");

    if (fileInput.files.length === 0) {
        alert("กรุณาเลือกรูป");
        return;
    }

    const file = fileInput.files[0];

    const img = new Image();

    img.onload = function () {

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        // จุดตัวอย่าง
        const hip = { x: 300, y: 200 };
        const knee = { x: 320, y: 400 };
        const ankle = { x: 340, y: 650 };

        // วาดจุด
        ctx.fillStyle = "red";

        [hip, knee, ankle].forEach(point => {

            ctx.beginPath();
            ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
            ctx.fill();

        });

        // วาดเส้น Mechanical Axis
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(hip.x, hip.y);
        ctx.lineTo(knee.x, knee.y);
        ctx.lineTo(ankle.x, ankle.y);
        ctx.stroke();

        // คำนวณองศาแบบง่าย
        const angle = calculateAngle(hip, knee, ankle);

        document.getElementById("result").innerHTML = `
            <h2>ผลวิเคราะห์ Mechanical Axis</h2>

            <p>มุมเข่า: ${angle.toFixed(2)}°</p>

            <p>ตรวจพบแนวแกนขาเบื้องต้น</p>
        `;

    };

    img.src = URL.createObjectURL(file);
}

function calculateAngle(a, b, c) {

    const ab = Math.atan2(a.y - b.y, a.x - b.x);
    const cb = Math.atan2(c.y - b.y, c.x - b.x);

    let angle = Math.abs((ab - cb) * 180 / Math.PI);

    if (angle > 180) {
        angle = 360 - angle;
    }

    return angle;
}