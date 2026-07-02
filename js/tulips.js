const TULIP_POSITIONS = [
  { top: '6%', left: '3%', scale: 0.85, rotate: -8 },
  { top: '12%', left: '82%', scale: 1, rotate: 6 },
  { top: '38%', left: '1%', scale: 0.78, rotate: 4 },
  { top: '52%', left: '90%', scale: 0.92, rotate: -5 },
  { top: '68%', left: '6%', scale: 0.88, rotate: -3 },
  { top: '74%', left: '78%', scale: 0.95, rotate: 9 },
  { top: '28%', left: '93%', scale: 0.72, rotate: 11 },
  { top: '84%', left: '44%', scale: 0.8, rotate: -6 },
  { top: '20%', left: '50%', scale: 0.65, rotate: 0 },
  { top: '58%', left: '54%', scale: 0.6, rotate: 4 },
];

function createTulipSvg(id) {
  return `
    <svg viewBox="0 0 100 180" class="tulip-svg" aria-hidden="true">
      <defs>
        <linearGradient id="stem-${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#52b456"/>
          <stop offset="100%" stop-color="#3a8f3e"/>
        </linearGradient>
        <linearGradient id="bloom-${id}" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="85%" stop-color="#fafafa"/>
          <stop offset="100%" stop-color="#eef6ee"/>
        </linearGradient>
        <linearGradient id="leaf-${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#72c276"/>
          <stop offset="100%" stop-color="#4da651"/>
        </linearGradient>
      </defs>

      <ellipse cx="50" cy="176" rx="10" ry="2.5" fill="rgba(0,0,0,0.05)"/>

      <path
        class="tulip-leaf tulip-leaf-back"
        d="M50 136 C64 128 82 112 88 92 C78 104 64 118 50 128 Z"
        fill="url(#leaf-${id})"
        opacity="0.92"
      />
      <path
        class="tulip-stem"
        d="M50 174 L50 80"
        stroke="url(#stem-${id})"
        stroke-width="3.2"
        stroke-linecap="round"
      />
      <path
        class="tulip-leaf tulip-leaf-front"
        d="M50 140 C36 132 18 116 12 96 C22 108 36 122 50 132 Z"
        fill="url(#leaf-${id})"
      />

      <g class="tulip-bloom-group">
        <path
          class="tulip-bloom"
          d="M50 80
             C46 80 40 76 38 68
             C34 54 36 36 44 24
             C47 18 50 15 53 17
             C57 19 64 30 65 44
             C66 58 62 70 58 76
             C56 79 53 80 50 80 Z"
          fill="url(#bloom-${id})"
          stroke="#dcdcdc"
          stroke-width="0.7"
        />
        <path
          class="tulip-bloom-fold"
          d="M50 80 L50 17"
          stroke="#ececec"
          stroke-width="0.5"
          fill="none"
        />
        <path
          class="tulip-bloom-base"
          d="M43 78 Q50 74 57 78"
          fill="#e8f3e8"
          stroke="none"
        />
      </g>

      <g class="tulip-face">
        <g class="tulip-eyes-smile">
          <path d="M44 42 Q47 40 50 42" stroke="#7c3aed" stroke-width="1.4" fill="none" stroke-linecap="round"/>
          <path d="M50 42 Q53 40 56 42" stroke="#7c3aed" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        </g>
        <path
          class="tulip-mouth-smile"
          d="M44 50 Q50 57 56 50"
          stroke="#7c3aed"
          stroke-width="1.8"
          fill="none"
          stroke-linecap="round"
        />
      </g>
    </svg>
  `;
}

function buildTulipGarden() {
  const garden = document.getElementById('tulip-garden');
  if (!garden) return;

  TULIP_POSITIONS.forEach((pos, index) => {
    const tulip = document.createElement('div');
    tulip.className = 'tulip';
    tulip.style.top = pos.top;
    tulip.style.left = pos.left;
    tulip.style.setProperty('--scale', pos.scale);
    tulip.style.setProperty('--rotate', `${pos.rotate}deg`);
    tulip.style.animationDelay = `${index * 0.45}s`;
    tulip.innerHTML = createTulipSvg(index);
    garden.appendChild(tulip);
  });
}

function makeTulipsSmile() {
  document.querySelectorAll('.tulip').forEach((tulip) => {
    tulip.classList.remove('smiling');
    void tulip.offsetWidth;
    tulip.classList.add('smiling');

    clearTimeout(tulip._smileTimer);
    tulip._smileTimer = setTimeout(() => {
      tulip.classList.remove('smiling');
    }, 2800);
  });
}

buildTulipGarden();
window.makeTulipsSmile = makeTulipsSmile;
