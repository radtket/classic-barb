// Particle effect for trees to resemble Stranger Things forest view
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Setting up the array for trees
const treeArray = [];
const dustArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

class Tree {
  constructor() {
    this.width = parseInt(Math.random() * 100 + 10);
    this.height = canvas.height;
    this.positionX = parseInt(Math.random() * canvas.width - 200 + 200);
  }
}

class Dust {
  constructor() {
    this.width = parseInt(Math.random() * 5 + 1);
    this.positionX = parseInt(Math.random() * canvas.width * 0.9);
    this.positionY = parseInt(Math.random() * canvas.height * 0.7);
    this.opacity = 0;
  }
}

const createObject = (objectArray, ParticleObject, particleMax) => {
  for (let i = 0; i < particleMax; i += 1) {
    const particleObject = new ParticleObject();
    objectArray.push(particleObject);
  }

  // Sort the array by width so the smaller trees appear in the background :D
  objectArray.sort((a, b) => a.width - b.width);
};

const drawTree = treeObject => {
  context.beginPath();

  // Base color for the trunk
  const baseGradient = context.createLinearGradient(
    treeObject.positionX,
    0,
    treeObject.positionX + treeObject.width,
    2
  );
  baseGradient.addColorStop(0.5, 'hsl(204, 80%, 10%)');
  baseGradient.addColorStop(0.9, 'hsl(204, 95%, 15%)');
  baseGradient.addColorStop(1, 'hsl(204, 90%, 12.5%)');

  // Check for the inverse and get the absolute value so thinner trees have less saturation
  const depthOverlay = Math.abs(treeObject.width / 100 - 1).toFixed(2);
  treeObject.height = parseInt(canvas.height * (treeObject.width / 100) + canvas.height * 0.6);

  // Bottom shadow of tree
  const overlayGradient = context.createLinearGradient(0, canvas.height, 0, 20);
  overlayGradient.addColorStop(0.2, 'hsla(204, 80%, 15%, 1)');
  overlayGradient.addColorStop(0.9, `hsla(204, 10%, ${30 * depthOverlay}%, ${depthOverlay})`);

  context.fillStyle = baseGradient;
  context.fillRect(treeObject.positionX, 0, treeObject.width, treeObject.height);
  context.fillStyle = overlayGradient;
  context.fillRect(treeObject.positionX, 0, treeObject.width, treeObject.height);

  context.closePath();
  moveTree(treeObject);
};

const drawDust = dustObject => {
  context.save();
  // Running this before it's draw to determine opacity
  moveDust(dustObject);

  context.beginPath();
  context.arc(dustObject.positionX, dustObject.positionY, dustObject.width, 0, 2 * Math.PI);
  context.fillStyle = `rgba(255, 255, 255, ${dustObject.opacity})`;
  context.shadowBlur = 10;
  context.shadowColor = 'white';
  context.fill();

  context.closePath();
  context.restore();
};

const moveTree = treeObject => {
  treeObject.positionX += parseInt((treeObject.width / 150) * 3 + 1);
  if (treeObject.positionX > canvas.width) {
    treeObject.positionX = 0 - treeObject.width;
  }
};

const moveDust = dustObject => {
  dustObject.positionX += parseInt((dustObject.width / 4) * 3 + 1);
  dustObject.positionY += -1;

  if (dustObject.positionX > canvas.width) dustObject.positionX = 0 - dustObject.width;
  if (0 > dustObject.positionY) {
    dustObject.positionY = canvas.height - dustObject.width;
    dustObject.opacity = 0;
  } else if (0 < dustObject.positionY && 1.0 > dustObject.opacity) {
    dustObject.opacity += 0.005;
  }
};

const drawStage = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0, n = dustArray.length, m = 0; i < n; i += 1) {
    if (0 === i % 6) {
      drawTree(treeArray[m]);
      m += 1;
    }
    drawDust(dustArray[i]);
  }

  requestAnimationFrame(drawStage);
};

const init = () => {
  createObject(treeArray, Tree, 15);
  createObject(dustArray, Dust, 90);
  drawStage();
};

// Run the things
init();
