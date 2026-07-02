function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function loadQuizzes() {
    const section = document.getElementById('quiz-section');
    try {
        const res = await fetch('./data/content.json?t=' + Date.now());
        const data = await res.json();
        const quizzesArray = data.quizzes || [];

        if (quizzesArray.length === 0) {
            section.innerHTML = '<h2>Testler</h2><p>Henüz test eklenmedi.</p>';
            return;
        }

        section.innerHTML = '<h2>Testler</h2>' + quizzesArray.map((quiz, index) => `
            <div class="quiz-question" data-quiz-index="${index}">
                <p><strong>${index + 1}.</strong> ${escapeHtml(quiz.soru)}</p>
                <div class="quiz-options">
                    ${(quiz.secenekler || []).map((opt, i) => `<button type="button" data-option="${i}">${escapeHtml(opt)}</button>`).join('')}
                </div>
            </div>`).join('');

        section.querySelectorAll('.quiz-question').forEach((block) => {
            const q = quizzesArray[Number(block.dataset.quizIndex)];
            const correctIdx = (q.secenekler || []).indexOf(q.cevap);

            block.querySelectorAll('button').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const chosen = Number(btn.dataset.option);
                    block.querySelectorAll('button').forEach((b, i) => {
                        b.disabled = true;
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
loadQuizzes();
