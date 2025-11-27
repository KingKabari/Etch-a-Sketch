const container = document.querySelector('.container');
const resizeBtn = document.getElementById('resize-btn');
const colorBtn = document.getElementById('color-btn');
const blackBtn = document.getElementById('black-btn');
const eraserBtn = document.getElementById('eraser-btn');
const statusLabel = document.getElementById('status');

let mode = 'color'; // color | black | eraser
let isDrawingEnabled = true; // draw on hover

function updateStatusLabel() {
  statusLabel.textContent = isDrawingEnabled
    ? 'Draw Mode: ON (Click board to toggle)'
    : 'Draw Mode: OFF (Click board to resume)';
  statusLabel.style.color = isDrawingEnabled ? '#111' : '#c44';
}

function setMode(newMode) {
  mode = newMode;
  colorBtn.classList.toggle('active', mode === 'color');
  blackBtn.classList.toggle('active', mode === 'black');
  eraserBtn.classList.toggle('active', mode === 'eraser');
  resizeBtn.classList.remove('active');
}

colorBtn.addEventListener('click', () => setMode('color'));
blackBtn.addEventListener('click', () => setMode('black'));
eraserBtn.addEventListener('click', () => setMode('eraser'));

// Toggle drawing mode by clicking the board (grid)
container.addEventListener('click', () => {
  isDrawingEnabled = !isDrawingEnabled;
  updateStatusLabel();
});

function drawSquare(square) {
  if (mode === 'black') {
    square.style.backgroundColor = 'rgba(0,0,0,1)';
    square.dataset.rgb = `0,0,0`;
    square.dataset.hoverCount = 10;
  } else if (mode === 'eraser') {
    square.style.backgroundColor = 'transparent';
    square.dataset.hoverCount = 0;
    delete square.dataset.rgb;
  } else {
    let hoverCount = +square.dataset.hoverCount;
    if (hoverCount === 0) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      square.dataset.rgb = `${r},${g},${b}`;
      square.style.backgroundColor = `rgba(${r},${g},${b},0.1)`;
      square.dataset.hoverCount = 1;
    } else if (hoverCount < 10) {
      const [r, g, b] = square.dataset.rgb.split(",");
      const opacity = (hoverCount + 1) * 0.1;
      square.style.backgroundColor = `rgba(${r},${g},${b},${opacity})`;
      square.dataset.hoverCount = hoverCount + 1;
    }
  }
}

function createGrid(size) {
  container.innerHTML = "";
  const squareSize = 960 / size;
  for (let i = 0; i < size * size; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    square.dataset.hoverCount = 0;

    // Draw on hover ONLY if drawing mode is ON
    square.addEventListener('mouseenter', () => {
      if (isDrawingEnabled) {
        drawSquare(square);
      }
    });

    container.appendChild(square);
  }
}

// Initialize
createGrid(16);
updateStatusLabel();

// Grid resize logic
resizeBtn.addEventListener('click', () => {
  let size = prompt("Enter the number of squares per side (1–100):", 16);
  size = parseInt(size);
  if (isNaN(size) || size < 1) size = 16;
  if (size > 100) size = 100;
  createGrid(size);
  setMode('color'); // Reset to color after resize
  updateStatusLabel();
});