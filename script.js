const container = document.querySelector('.container');
const resizeBtn = document.getElementById('resize-btn');

function createGrid(size) {
  container.innerHTML = ""; // Remove old squares
  const squareSize = 960 / size;
  for (let i = 0; i < size * size; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;

    square.addEventListener('mouseenter', () => {
      square.classList.add('colored');
    });
    container.appendChild(square);
  }
}

createGrid(16);

// Show prompt and rebuild grid
resizeBtn.addEventListener('click', () => {
  let size = prompt("Enter the number of squares per side (1–100):", 16);
  size = parseInt(size);
  if (isNaN(size) || size < 1) size = 16;
  if (size > 100) size = 100;
  createGrid(size);
});