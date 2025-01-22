export default async function displayCurrentConditions(
  currentConditions,
  resolvedAddress
) {
  const {
    datetime,
    temp,
    feelslike,
    humidity,
    precipprob,
    windspeed,
    winddir,
    visibility,
    uvindex,
    conditions,
    icon,
  } = currentConditions;

  function getWindDirection(degree) {
    // Define the 8 cardinal and intercardinal directions with their degree ranges
    const directions = [
      { name: 'N', min: 337.5, max: 360 },
      { name: 'N', min: 0, max: 22.5 },
      { name: 'NE', min: 22.5, max: 67.5 },
      { name: 'E', min: 67.5, max: 112.5 },
      { name: 'SE', min: 112.5, max: 157.5 },
      { name: 'S', min: 157.5, max: 202.5 },
      { name: 'SW', min: 202.5, max: 247.5 },
      { name: 'W', min: 247.5, max: 292.5 },
      { name: 'NW', min: 292.5, max: 337.5 },
    ];

    // Loop through the directions to find the matching range
    for (const direction of directions) {
      if (
        (degree >= direction.min && degree < direction.max) ||
        (direction.name === 'N' && degree === 360)
      ) {
        return direction.name;
      }
    }

    // If degree is out of range, return an error message
    return 'Invalid degree value';
  }

  const currentTemp = document.querySelector('.current-temp');
  const location = document.querySelector('.current-location');
  const lastUpdated = document.querySelector('.last-updated');
  const conditionsNow = document.querySelector('.condition');
  const feels = document.querySelector('.feels-like-temp');
  const precip = document.querySelector('.precip-chance-percent');
  const wind = document.querySelector('.wind-speed-dir');
  const humid = document.querySelector('.humidity-percent');
  const uv = document.querySelector('.uv-rating');
  const visibile = document.querySelector('.visibility-km');
  currentTemp.textContent = `${temp}°C`;
  location.textContent = `${resolvedAddress}`;
  lastUpdated.textContent = `Last Updated: ${datetime}`;
  conditionsNow.textContent = `${conditions}`;
  feels.textContent = `${feelslike}°C`;
  precip.textContent = `${precipprob}%`;
  wind.textContent = `${getWindDirection(winddir)} / ${windspeed} km/h`;
  humid.textContent = `${humidity}%`;
  uv.textContent = `${uvindex}`;
  visibile.textContent = `${visibility} km`;

  try {
    const iconPath = await import(`../assets/${icon}.svg`);
    const currIcon = document.querySelector('.current-icon');
    currIcon.src = iconPath.default;
    currIcon.alt = `${conditions}`;
  } catch (error) {
    console.log(error);
  }
}
