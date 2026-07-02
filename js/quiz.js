function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const TEST_SIZE = 10;
const TEST_COUNT = 10;

let allQuizzes = [];
let testGroups = [];
let currentTestIndex = null;
let currentAnswers = [];

function buildTestGroups(quizzes) {
  const shuffled = shuffleArray(quizzes);
  const groups = [];
  for (let i = 0; i < TEST_COUNT; i++) {
    groups.push(shuffled.slice(i * TEST_SIZE, i * TEST_SIZE + TEST_SIZE));
  }
  return groups;
}

function renderTestList() {
  const section = document.getElementById('quiz-section');

  section.innerHTML = `
    <h2>Testler</h2>
    <p class="quiz-intro">100 soru rastgele olarak 10 ayrı teste dağıtıldı. Bir test seç ve başla. Her doğru cevap +1 net, her yanlış cevap -0,25 net, boş bıraktığın sorular 0 puan olarak hesaplanır.</p>
    <div class="quiz-test-grid">
      ${testGroups
        .map(
          (group, index) => `
        <button type="button" class="quiz-test-button" data-test-index="${index}">
          ${index + 1}. Test
          <span class="quiz-test-sub">${group.length} soru</span>
        </button>
      `
        )
        .join('')}
    </div>
  `;

  section.querySelectorAll('.quiz-test-button').forEach((button) => {
    button.addEventListener('click', () => {
      const testIndex = Number(button.dataset.testIndex);
      openTest(testIndex);
    });
  });
}

function openTest(testIndex) {
  currentTestIndex = testIndex;
  currentAnswers = new Array(testGroups[testIndex].length).fill(null);
  renderActiveTest();
}

function renderActiveTest() {
  const section = document.getElementById('quiz-section');
  const quizzes = testGroups[currentTestIndex];

  section.innerHTML = `
    <div class="quiz-nav">
      <button type="button" class="quiz-back-button" id="quiz-back-to-list">&larr; Testlere Dön</button>
    </div>
    <h2 class="quiz-active-title">${currentTestIndex + 1}. Test</h2>
    ${quizzes
      .map((quiz, index) => {
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
      .join('')}
    <div id="quiz-result-area"></div>
    <button type="button" class="quiz-finish-button" id="quiz-finish-button">Testi Bitir</button>
  `;

  document.getElementById('quiz-back-to-list').addEventListener('click', renderTestList);

  section.querySelectorAll('.quiz-question').forEach((block) => {
    const quizIndex = Number(block.dataset.quizIndex);
    const quiz = quizzes[quizIndex];
    const correctIndex = quiz.secenekler.indexOf(quiz.cevap);

    block.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        const chosen = Number(button.dataset.option);
        const isCorrect = chosen === correctIndex;

        currentAnswers[quizIndex] = isCorrect ? 'correct' : 'wrong';

        block.querySelectorAll('button').forEach((btn) => {
          btn.disabled = true;
          const idx = Number(btn.dataset.option);
          if (idx === correctIndex) btn.classList.add('correct');
          else if (idx === chosen) btn.classList.add('wrong');
        });

        if (isCorrect) {
          if (typeof window.makeTulipsSmile === 'function') window.makeTulipsSmile();
        } else {
          if (typeof window.makeTulipsKiss === 'function') window.makeTulipsKiss();
        }
      });
    });
  });

  document.getElementById('quiz-finish-button').addEventListener('click', finishActiveTest);
}

function finishActiveTest() {
  const section = document.getElementById('quiz-section');
  const quizzes = testGroups[currentTestIndex];

  let correctCount = 0;
  let wrongCount = 0;
  let blankCount = 0;

  quizzes.forEach((quiz, index) => {
    const answer = currentAnswers[index];
    if (answer === 'correct') correctCount++;
    else if (answer === 'wrong') wrongCount++;
    else blankCount++;

    const block = section.querySelector(`.quiz-question[data-quiz-index="${index}"]`);
    if (!block) return;
    const correctIndex = quiz.secenekler.indexOf(quiz.cevap);

    block.querySelectorAll('button').forEach((btn) => {
      btn.disabled = true;
      const idx = Number(btn.dataset.option);
      if (answer === null && idx === correctIndex) {
        btn.classList.add('unanswered');
      }
    });
  });

  const net = correctCount * 1 + wrongCount * -0.25 + blankCount * 0;
  const netText = Number.isInteger(net) ? net.toString() : net.toFixed(2);

  const resultArea = document.getElementById('quiz-result-area');
  resultArea.innerHTML = `
    <div class="quiz-result-box">
      <h3>Test Sonucu — ${currentTestIndex + 1}. Test</h3>
      <div class="quiz-result-stats">
        <div class="quiz-result-stat">
          <span class="stat-value">${correctCount}</span>
          <span class="stat-label">Doğru</span>
        </div>
        <div class="quiz-result-stat">
          <span class="stat-value">${wrongCount}</span>
          <span class="stat-label">Yanlış</span>
        </div>
        <div class="quiz-result-stat">
          <span class="stat-value">${blankCount}</span>
          <span class="stat-label">Boş</span>
        </div>
        <div class="quiz-result-stat">
          <span class="stat-value">${quizzes.length}</span>
          <span class="stat-label">Toplam Soru</span>
        </div>
      </div>
      <p class="quiz-result-net">Net: ${netText}</p>
      <button type="button" class="quiz-retry-button" id="quiz-back-to-list-2">Testlere Dön</button>
    </div>
  `;

  document.getElementById('quiz-back-to-list-2').addEventListener('click', renderTestList);

  const finishButton = document.getElementById('quiz-finish-button');
  if (finishButton) finishButton.remove();

  resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function loadQuizzes() {
  const section = document.getElementById('quiz-section');

  try {
    const res = await fetch('data/content.json');
    const data = await res.json();

    if (!data.quizzes || data.quizzes.length === 0) {
      section.innerHTML = '<h2>Testler</h2><p>Henüz test eklenmedi.</p>';
      return;
    }

    allQuizzes = data.quizzes;
    testGroups = buildTestGroups(allQuizzes);
    renderTestList();
  } catch (err) {
    section.innerHTML = '<h2>Testler</h2><p>Testler yüklenemedi.</p>';
    console.error(err);
  }
}

loadQuizzes();

