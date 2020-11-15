const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const photoCanvas = document.createElement('canvas');
const photoCtx = photoCanvas.getContext('2d');

let image = {
  width: 1280,
  height: 1919,
  resize: 3.5,
  source: imageBase64
}

const girl = new Image();
girl.src = image.source;

let scannedImageData = [];
let redValueArray = [];
let greenValueArray = [];
let blueValueArray = [];
let particlesArray = [];

const maxParticles = 400;
const dataWidth = image.width / image.resize;
const dataHeight = image.height / image.resize;

canvas.width = dataWidth;
canvas.height = dataHeight;
photoCanvas.width = dataWidth;
photoCanvas.height = dataHeight;

class Particle {
  constructor() {
    this.x = Math.floor(Math.random() * canvas.width);
    this.y = Math.floor(Math.random() * canvas.height);
    this.radius = 1;
    this.vy = 3;
    this.value = 20;
    this.color = 'hsl(0, 0%, ' + this.value + '%)';
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    if (this.y > 0 && this.y < canvas.height) {
      let index = this.y * Math.floor(dataWidth) + this.x;
      let redValue = redValueArray[index];
      let greenValue = greenValueArray[index];
      let blueValue = blueValueArray[index];
      let averageValue = (redValue + greenValue + blueValue) / 3;
      this.value = (averageValue / 255) * 100;
      this.color = 'hsl(0, 0%, ' + this.value + '%)';
    }
    if (this.y - this.radius > canvas.height) {
      this.y = 0 - this.radius;
    }
    this.y += this.vy;
  }

}

function setColorArrays() {
  for (i = 0; i < scannedImageData.data.length; i += 4) {
    redValueArray.push(scannedImageData.data[i]);
    greenValueArray.push(scannedImageData.data[i + 1]);
    blueValueArray.push(scannedImageData.data[i + 2]);
  }
}

function generateParticles() {
  for (i = 0; i < maxParticles; i++) {
    particlesArray.push(new Particle);
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animate);
}

function init() {
  setColorArrays();
  generateParticles();
  animate();
}

window.addEventListener('load', () => {
  photoCtx.drawImage(girl, 0, 0, canvas.width, canvas.height);
  scannedImageData = photoCtx.getImageData(0, 0, canvas.width, canvas.height);
  init();
});
