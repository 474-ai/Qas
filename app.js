const welcomeScreen = document.getElementById('welcome-screen');
const startArBtn = document.getElementById('start-ar-btn');
const arUi = document.getElementById('ar-ui');
const actionBtn = document.getElementById('action-btn');
const resetBtn = document.getElementById('reset-btn');
const resultText = document.getElementById('result-text');
const camera = document.getElementById('camera');
const core = document.getElementById('measurement-core');

let points = []; 

// تشغيل الكاميرا والمستشعرات بعد ضغط زر الترحيب
startArBtn.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    arUi.style.display = 'block';
    
    // طلب الإذن الرسمي للكاميرا والمستشعرات الحركية للجوال
    if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission();
    }
});

// ميكانيكية حساب المسافات الفعلية عند الضغط
actionBtn.addEventListener('click', () => {
    // التقاط موقع الجوال الحالي في الغرفة عبر مستشعر look-controls
    let currentPosition = camera.object3D.position;
    
    points.push({
        x: currentPosition.x,
        y: currentPosition.y,
        z: currentPosition.z
    });

    // إنشاء نقطة مرئية مضيئة في الفضاء الافتراضي مكان الضغط
    let sphere = document.createElement('a-sphere');
    sphere.setAttribute('position', `${currentPosition.x} ${currentPosition.y} ${currentPosition.z}`);
    sphere.setAttribute('radius', '0.015');
    sphere.setAttribute('color', '#0044ff');
    core.appendChild(sphere);

    // عندما تتوفر نقطتان، يتم تفعيل الحساب الفوري ورسم الخط الافتراضي
    if (points.length === 2) {
        let p1 = points[0];
        let p2 = points[1];

        // 📐 المعادلة الرياضية لحساب فرق المسافة بالمتر بين نقطتين في الفضاء ثلاثي الأبعاد
        let distance = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) +
            Math.pow(p2.y - p1.y, 2) +
            Math.pow(p2.z - p1.z, 2)
        );

        // طباعة النتيجة بدقة حقيقية على واجهة المستخدم العليا
        resultText.innerText = `${distance.toFixed(2)} متر`;

        // رسم خط مرئي حقيقي يصل بين البداية والنهاية
        let line = document.createElement('a-entity');
        line.setAttribute('line', `start: ${p1.x} ${p1.y} ${p1.z}; end: ${p2.x} ${p2.y} ${p2.z}; color: #0044ff; width: 4`);
        core.appendChild(line);

        actionBtn.innerText = "تم";
        actionBtn.disabled = true;
    }
});

// تصفير النظام لمسح القياس السابق والبدء من جديد
resetBtn.addEventListener('click', () => {
    points = [];
    core.innerHTML = ''; 
    resultText.innerText = '0.00 متر';
    actionBtn.innerText = "نقطة";
    actionBtn.disabled = false;
});
