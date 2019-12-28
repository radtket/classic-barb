class Dust {
  constructor() {
    this.width = parseInt(Math.random() * 5 + 1);
    this.positionX = parseInt(Math.random() * canvas.width * 0.9);
    this.positionY = parseInt(Math.random() * canvas.height * 0.7);
    this.opacity = 0;
  }
}

export default Dust;
