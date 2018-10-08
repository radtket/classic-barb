const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const maxParticles = 150;
const particles = [];

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function playMusic() {
  const music = new Audio(
    '../mp3/ThemeMusicSoundtrack.mp3'
  );

  music.play();
}

function getParticle() {
  const flip = 0.5 < Math.random() ? 1 : -1;
  const particle = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: Math.random() * (Math.random() * 0.5) * flip,
    vy: Math.random() * (Math.random() * 0.5) * flip,
    radius: Math.random() * 4,
    fillColor: '#fff'
  };

  return particle;
}

function loadParticles() {
  for (let i = 0; i < maxParticles; i += 1) {
    const p = getParticle();

    particles.push(p);
  }
}

function drawParticle(particle) {
  ctx.fillStyle = particle.fillColor;

  ctx.beginPath();
  ctx.globalAlpha = 0.5;

  ctx.arc(particle.x, particle.y, particle.radius, Math.PI / 2, false);
  ctx.fill();
}

function updateParticles() {
  for (const p of particles) {
    p.y += p.vy;
    p.x += p.vx;

    if (0 > p.y) {
      p.y = canvas.height;
    } else if (p.y + p.radius > canvas.height) {
      p.y = 0;
    }

    if (0 > p.x) {
      p.x = canvas.width;
    } else if (p.x + p.radius > canvas.width) {
      p.x = 0;
    }

    drawParticle(p);
  }
}

function updateCanvas() {
  const containerBgImg = canvas.dataset.bg;
  const background = new Image();

  background.src = containerBgImg;
  background.onload = () => {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  };
}

function update() {
  updateCanvas();
  updateParticles();
}

function renderLoop() {
  update();
  window.requestAnimationFrame(() => renderLoop());
}

function init() {
  loadParticles();
  playMusic();

  renderLoop();
}

init();
