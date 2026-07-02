function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function loadQuizzes() {
  const section = document.getElementById('quiz-section');

  try {
    // DİKKAT: Tarayıcının eski dosyayı okumasını engellemek için sonuna tarih damgası ekledik
    const url = './data/content.json?t=' + Date.now();
    const res = await fetch(url);
    const data = await res.json();

    // Fazladan quizzes parantezi kaldıysa otomatik toparlama
    let quizzesArray = data.quizzes;
    if (quizzesArray && !Array.isArray(quizzesArray) && quizzesArray.quizzes) {
      quizzesArray = quizzesArray.quizzes;
    }

    if (!quizzesArray || quizzesArray.length === 0) {
      section.innerHTML = '<h2>Testler</h2><p>Henüz test eklenmedi.</p>';
      return;
    }

    section.innerHTML =
      '<h2>Testler</h2>' +
      quizzesArray
        .map((quiz, index) => {
          const secenekler = quiz.secenekler || [];
          return `
          <div class="quiz-question" data-quiz-index="${index}">
            <p><strong>${index + 1}.</strong> ${escapeHtml(quiz.soru)}</p>
            <div class="quiz-options">
              ${secenekler
                .map(
                  (option, optionIndex) =>
                    `<button type="button" data-option="${optionIndex}">${escapeHtml(option)}</button>`
                )
                .join('')}
            </div>
          </div>
        `;
        })
        .join('');

    section.querySelectorAll('.quiz-question').forEach((block) => {
      const quizIndex = Number(block.dataset.quizIndex);
      const quiz = quizzesArray[quizIndex];
      const correctIndex = (quiz.secenekler || []).indexOf(quiz.cevap);

      block.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
          const chosen = Number(button.dataset.option);
          const isCorrect = chosen === correctIndex;

          block.querySelectorAll('button').forEach((btn) => {
            btn.disabled = true;
            const idx = Number(btn.dataset.option);
            if (idx === correctIndex) btn.classList.add('correct');
            else if (idx === chosen) btn.classList.add('wrong');
          });

          if (isCorrect && typeof window.makeTulipsSmile === 'function') {
            window.makeTulipsSmile();
          }
        });
      });
    });
  } catch (err) {
    section.innerHTML = '<h2>Testler</h2><p>Testler yüklenemedi. Lütfen konsolu kontrol edin.</p>';
    console.error("Test yükleme hatası:", err);
  }
}

loadQuizzes();
