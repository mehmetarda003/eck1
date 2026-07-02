function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function loadCards() {
  const section = document.getElementById('cards-section');

  try {
    const res = await fetch('data/content.json');
    const data = await res.json();

    if (!data.cards || data.cards.length === 0) {
      section.innerHTML = '<p>Henüz bilgi kartı eklenmedi.</p>';
      return;
    }

    section.innerHTML = data.cards
      .map(
        (card) => `
        <article class="card">
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
        </article>
      `
      )
      .join('');
  } catch (err) {
    section.innerHTML = '<p>İçerik yüklenemedi. Sunucu ile açtığından emin ol.</p>';
    console.error(err);
  }
}

loadCards();
