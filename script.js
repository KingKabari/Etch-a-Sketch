const container = document.querySelector('.container');
const resizeBtn = document.getElementById('resize-btn');
const blackBtn = document.getElementById('black-btn');
const eraserBtn = document.getElementById('eraser-btn');

let mode = 'color';

function setMode(newMode) {
  mode = newMode;
  // Highlight the active button for clarity
  blackBtn.classList.toggle('active', mode === 'black');
  eraserBtn.classList.toggle('active', mode === 'eraser');
  resizeBtn.classList.remove('active');
}

blackBtn.addEventListener('click', () => setMode('black'));
eraserBtn.addEventListener('click', () => setMode('eraser'));

function createGrid(size) {
  container.innerHTML = "";
  const squareSize = 960 / size;
  for (let i = 0; i < size * size; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    square.dataset.hoverCount = 0;

    square.addEventListener('mouseenter', () => {
      if (mode === 'black') {
        // Always solid black
        square.style.backgroundColor = 'rgba(0,0,0,1)';
        square.dataset.rgb = `0,0,0`;
        square.dataset.hoverCount = 10;
      } else if (mode === 'eraser') {
        // Reset square to blank
        square.style.backgroundColor = 'transparent';
        square.dataset.hoverCount = 0;
        delete square.dataset.rgb;
      } else {
        // Normal color mode: random color on first, progressive darkening
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
    });

    container.appendChild(square);
  }
}

createGrid(16);

resizeBtn.addEventListener('click', () => {
  let size = prompt("Enter the number of squares per side (1–100):", 16);
  size = parseInt(size);
  if (isNaN(size) || size < 1) size = 16;
  if (size > 100) size = 100;
  createGrid(size);
  setMode('color'); // Reset to color after resize
});