const welcomeScreen = document.getElementById('welcome-screen');
const startArBtn = document.getElementById('start-ar-btn');
const arUi = document.getElementById('ar-ui');
const actionBtn = document.getElementById('action-btn');
const resetBtn = document.getElementById('reset-btn');
const resultText = document.getElementById('result-text');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let clicks = [];
let devOrientation = { alpha: 0, beta: 0, gamma: 0 };

// ضبط أبعاد مساحة الرسم لتطابق أبعاد الشاشة الحقيقية للـ الجوال
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// تفعيل قراءة مستشعرات الجوال الحركية والكاميرا
startArBtn.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    arUi.style.display = 'block';

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            devOrientation.alpha = e.alpha || 0;
            devOrientation.beta = e.beta || 0;
            devOrientation.gamma = e.gamma || 0;
        });
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().catch(console.error);
        }
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then(stream => { video.srcObject = stream; })
        .catch(err => { alert("خطأ في تشغيل الكاميرا: " + err.message); });
});

// ميكانيكية الرسم الافتراضي للخط والنقاط وحساب المسافة
actionBtn.addEventListener('click', () => {
    let screenX = window.innerWidth / 2;
    let screenY = window.innerHeight / 2;

    clicks.push({
        x: screenX,
        y: screenY,
        angle: { ...devOrientation }
    });

    drawMeasurement();

    if (clicks.length === 2) {
        let c1 = clicks[0];
        let c2 = clicks[1];

        // 📐 عملية حساب تقريبية دقيقة بناء على زاوية انحراف حركة يد المستخدم والجوال بالدرجات
        let radBeta1 = c1.angle.beta * Math.PI / 180;
        let radBeta2 = c2.angle.beta * Math.PI / 180;
        let calculatedDistance = Math.abs(Math.tan(radBeta2) - Math.tan(radBeta1)) * 1.5; 

        resultText.innerText = `${calculatedDistance.toFixed(2)} متر`;
        actionBtn.innerText = "تم";
        actionBtn.disabled = true;
    }
});

function drawMeasurement() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#0044ff';
    ctx.fillStyle = '#0044ff';
    ctx.lineWidth = 5;

    clicks.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    if (clicks.length === 2) {
        ctx.beginPath();
        ctx.moveTo(clicks[0].x, clicks[0].y);
        ctx.lineTo(clicks[1].x, clicks[1].y);
        ctx.stroke();
    }
}

resetBtn.addEventListener('click', () => {
    clicks = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resultText.innerText = '0.00 متر';
    actionBtn.innerText = "نقطة";
    actionBtn.disabled = false;
});
