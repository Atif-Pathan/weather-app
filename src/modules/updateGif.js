import defaultGif from '../assets/default.gif';

export default async function updateGif(conditions) {
  const gifContainer = document.querySelector('.gif-container img');

  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=1WivMzhF7Orkq8jj8YYNcDaZteirY3nI=${conditions}simpsons&limit=20`,
      { mode: 'cors' }
    );

    if (!response.ok) {
      throw new Error(
        `Giphy API Error: ${response.status} ${response.statusText}`
      );
    }

    const gifData = await response.json();

    if (gifData.data && gifData.data.length > 0) {
      // Randomly select a GIF from the returned results
      const randomIndex = Math.floor(Math.random() * gifData.data.length);
      const selectedGif = gifData.data[randomIndex].images.original.url;

      gifContainer.src = selectedGif;
      gifContainer.alt = `GIF related to ${conditions}`;
      gifContainer.style.display = 'block'; // Ensure the GIF is visible
    } else {
      throw new Error('No GIFs found for the provided conditions.');
    }
  } catch (error) {
    console.error('Error fetching GIF:', error.message);
    gifContainer.src = defaultGif; // Fallback to the default GIF
    gifContainer.alt = 'Default weather GIF';
    gifContainer.style.display = 'block'; // Ensure the default GIF is visible
  }
}
