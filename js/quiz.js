// 1. Sayaç Fonksiyonu
function startCountdown(deadline) {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;

    setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(deadline).getTime();
        const distance = target - now;

        if (distance < 0) {
            timerElement.innerHTML = "⏳ Sınav zamanı geldi!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        timerElement.innerHTML = `⏳ Sınava Kalan: ${days} gün ${hours} saat`;
    }, 1000);
}

// 2. Test Yükleme Fonksiyonu
async function loadQuizzes() {
    const section = document.getElementById('quiz-section');
    try {
        // Dosya yolunu ve önbelleği engellemek için zaman damgasını ekledik
        const res = await fetch('./data/content.json?t=' + Date.now());
        const data = await res.json();
        
        // JSON yapındaki quizzes dizisine ulaşıyoruz
        const quizzesArray = data.quizzes || [];

        if (quizzesArray.length === 0) {
            section.innerHTML = '<h2>Testler</h2><p>Henüz test eklenmedi.</p>';
            return;
        }

        // Testleri HTML'e döküyoruz
        section.innerHTML = '<h2>Testler</h2>' + quizzesArray.map((quiz, index) => `
            <div class="quiz-question" data-quiz-index="${index}">
                <p><strong>${index + 1}.</strong> ${quiz.soru}</p>
                <div class="quiz-options">
                    ${(quiz.secenekler || []).map((opt, i) => `<button type="button" data-option="${i}">${opt}</button>`).join('')}
                </div>
            </div>`).join('');

        // Tıklama olaylarını bağlıyoruz
        section.querySelectorAll('.quiz-question').forEach((block) => {
            const quizIndex = Number(block.dataset.quizIndex);
            const quiz = quizzesArray[quizIndex];
            const correctIdx = (quiz.secenekler || []).indexOf(quiz.cevap);

            block.querySelectorAll('button').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const chosen = Number(btn.dataset.option);
                    block.querySelectorAll('button').forEach((b, i) => {
                        b.disabled = true; // Butonları kilitler
                        if (i === correctIdx) b.classList.add('correct');
                        else if (i === chosen) b.classList.add('wrong');
                    });
                });
            });
        });
    } catch (err) {
        console.error("Yükleme hatası:", err);
        section.innerHTML = '<h2>Testler</h2><p>Veriler yüklenirken bir hata oluştu.</p>';
    }
}

// Fonksiyonları çalıştır
startCountdown("2026-09-06T10:15:00");
loadQuizzes();
