import { parseISO } from 'date-fns';

export default async function displayForecast(daysArray) {
  const dayCards = document.querySelectorAll('.day-card');

  if (!daysArray || daysArray.length === 0) {
    console.error('No forecast data available.');
    return;
  }

  for (const [index, day] of daysArray.entries()) {
    const dayCard = document.querySelector(`.day-card[data-index="${index}"]`);
    if (!dayCard) {
      console.error(`No card available for day at index ${index}.`);
      continue;
    }

    // Destructure day properties
    const { datetime, tempmax, tempmin, precipprob, icon, conditions } = day;

    // Parse the datetime as UTC
    const utcDate = parseISO(datetime);

    // Format the date for display in Amsterdam's time zone
    const dayName = utcDate.toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: 'Europe/Amsterdam',
    });
    const dateFormatted = utcDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'Europe/Amsterdam',
    });

    // Update the day card content
    const dayElement = dayCard.querySelector('.day');
    const dateElement = dayCard.querySelector('.date-card');
    const hiTempElement = dayCard.querySelector('.hi-temp');
    const loTempElement = dayCard.querySelector('.lo-temp');
    const precipPercentElement = dayCard.querySelector('.precip-percent');
    const forecastIconElement = dayCard.querySelector('.forecast-icon');

    if (dayElement) dayElement.textContent = dayName;
    if (dateElement) dateElement.textContent = dateFormatted;
    if (hiTempElement) hiTempElement.textContent = `${tempmax}°`;
    if (loTempElement) loTempElement.textContent = `${tempmin}°C`;
    if (precipPercentElement)
      precipPercentElement.textContent = `${precipprob}%`;

    // Update the forecast icon
    try {
      const iconPath = await import(`../assets/${icon}.svg`);
      if (forecastIconElement) {
        forecastIconElement.src = iconPath.default;
        forecastIconElement.alt = conditions || 'Weather icon';
      }
    } catch (error) {
      console.error(`Error loading icon for index ${index}:`, error);
    }
  }

  // Handle extra day-cards if daysArray has fewer items than cards
  if (daysArray.length < dayCards.length) {
    for (let i = daysArray.length; i < dayCards.length; i++) {
      console.warn(`No data for card with index ${i}. Keeping default values.`);
    }
  }
}
