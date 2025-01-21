const carousel = document.querySelector('.carousel');
const allCards = document.querySelectorAll('.day-card');

const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
let currentIndex = 0;

function nextSlide(index) {
  const remToPx = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const shift = allCards[index].offsetWidth;
  const initialLeft = parseFloat(getComputedStyle(carousel).left);
  const shiftLeftBy = initialLeft - (shift + 1 * remToPx);
  carousel.style.left = shiftLeftBy + 'px';
}

function prevSlide(index) {
  const remToPx = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  const shift = allCards[index].offsetWidth;
  const initialLeft = parseFloat(getComputedStyle(carousel).left);
  const shiftLeftBy = initialLeft + (shift + 1 * remToPx);
  carousel.style.left = shiftLeftBy + 'px';
}

rightBtn.addEventListener('click', () => {
  console.log('right btn click');
  if (currentIndex < 5) {
    currentIndex += 1;
    nextSlide(currentIndex);
  }
});

leftBtn.addEventListener('click', () => {
  console.log('right btn click');
  if (currentIndex > 0) {
    currentIndex -= 1;
    prevSlide(currentIndex);
  }
});
