const carousel = (() => {
  const carouselElement = document.querySelector('.carousel');
  const allCards = document.querySelectorAll('.day-card');
  const leftBtn = document.getElementById('left-btn');
  const rightBtn = document.getElementById('right-btn');

  let currentIndex = 0;

  function resetCarousel() {
    // Reset the carousel's position to the starting point
    carouselElement.style.left = '2rem';
    currentIndex = 0;
  }

  function nextSlide(index) {
    const remToPx = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const shift = allCards[index].offsetWidth;
    const initialLeft = parseFloat(getComputedStyle(carouselElement).left) || 0;
    const shiftLeftBy = initialLeft - (shift + 1 * remToPx);
    carouselElement.style.left = `${shiftLeftBy}px`;
  }

  function prevSlide(index) {
    const remToPx = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const shift = allCards[index].offsetWidth;
    const initialLeft = parseFloat(getComputedStyle(carouselElement).left) || 0;
    const shiftLeftBy = initialLeft + (shift + 1 * remToPx);
    carouselElement.style.left = `${shiftLeftBy}px`;
  }

  rightBtn.addEventListener('click', () => {
    if (currentIndex < 5) {
      currentIndex += 1;
      nextSlide(currentIndex);
    }
  });

  leftBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      prevSlide(currentIndex);
    }
  });

  return { resetCarousel };
})();

export default carousel;
