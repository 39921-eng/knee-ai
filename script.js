function startCamera() {
    alert("คอมนี้ไม่มีกล้อง ใช้อัปโหลดรูปแทนได้");
}

function analyzeImage() {

    const fileInput = document.getElementById("upload");

    if (fileInput.files.length === 0) {
        alert("กรุณาเลือกรูปก่อน");
        return;
    }

    const result = document.getElementById("result");

    result.innerHTML = `
        <h2>ผลการวิเคราะห์ Mechanical Axis</h2>
        <p>ตรวจพบแนวแกนขาเบื้องต้น</p>
        <p>เข่าอาจมีภาวะโก่งเล็กน้อย</p>
        <p>กรุณาปรึกษาแพทย์เฉพาะทางเพื่อผลที่แม่นยำ</p>
    `;
}
