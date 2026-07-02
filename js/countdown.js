// Türkiye saati sabit kalsın istersen:
const TARGET = new Date('2026-09-06T10:15:00+03:00');
// Her kullanıcının kendi saatine göre 10:15 olsun istersen:
// const TARGET = new Date('2026-09-06T10:15:00');
function updateCountdown() {
  const now = new Date();
  const diff = TARGET - now;
  if (diff <= 0) {
    document.getElementById('countdown-text').textContent = 'Tarih geldi!';
    return;
  }
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  document.getElementById('countdown-text').textContent =
    `${months} ay, ${remainingDays} gün, ${hours} saat, ${minutes} dk kaldı`;
}
updateCountdown();
setInterval(updateCountdown, 1000);
