class Tree {
  constructor() {
    this.width = parseInt(Math.random() * 100 + 10);
    this.height = canvas.height;
    this.positionX = parseInt(Math.random() * canvas.width - 200 + 200);
  }
}

export default Tree;
