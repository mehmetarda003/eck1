function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function loadQuizzes() {
  const section = document.getElementById('quiz-section');

  try {
    // GitHub Pages'te sorun çıkmaması için dosya yolunun başına nokta ekledik
    const res = await fetch('./data/content.json');
    const data = await res.json();

    if (!data.quizzes || data.quizzes.length === 0) {
      section.innerHTML = '<h2>Testler</h2><p>Henüz test eklenmedi.</p>';
      return;
    }

    section.innerHTML =
      '<h2>Testler</h2>' +
      data.quizzes
        .map((quiz, index) => {
          // JSON'daki "secenekler" anahtarını kullanıyoruz
          if (!quiz.secenekler || quiz.secenekler.length !== 5) {
            console.warn(`Soru ${index + 1}: tam 5 şık olmalı.`);
          }

          return `
          <div class="quiz-question" data-quiz-index="${index}">
            <p><strong>${index + 1}.</strong> ${escapeHtml(quiz.soru)}</p>
            <div class="quiz-options">
              ${quiz.secenekler
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
      const quiz = data.quizzes[quizIndex];
      
      // Doğru cevabın indeksini JSON'daki "cevap" metninden otomatik buluyoruz
      const correctIndex = quiz.secenekler.indexOf(quiz.cevap);

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

          // Doğru cevap verildiğinde laleleri gülümseten animasyon fonksiyonu
          if (isCorrect && typeof window.makeTulipsSmile === 'function') {
            window.makeTulipsSmile();
          }
        });
      });
    });
  } catch (err) {
    section.innerHTML = '<h2>Testler</h2><p>Testler yüklenemedi.</p>';
    console.error(err);
  }
}

loadQuizzes();
