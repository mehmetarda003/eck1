const TARGET = new Date('2026-09-06T10:15:00+03:00');

function updateCountdown() {
  const now = new Date();
  const diff = TARGET - now;
  const el = document.getElementById('countdown-text');

  if (diff <= 0) {
    el.textContent = '6 Eylül 2026, 10:15 geldi!';
    return;
  }

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const months = Math.floor(days / 30);
  const remainingDays = days % 30;

  el.textContent = `KPSS'ye ${months} ay, ${remainingDays} gün, ${hours} saat, ${minutes} dk kaldı`;
}

updateCountdown();
setInterval(updateCountdown, 1000);
