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

  console.log(`Last Updated: ${datetime}`);
  console.log(`Current Temp: ${temp}°C`);
  console.log(`Address: ${resolvedAddress}`);
  console.log(`Icon: ${icon}`);

  console.log(`Feels like: ${feelslike}°C`);
  console.log(`Humidity: ${humidity}%`);
  console.log(`Precipitation chance: ${precipprob}%`);
  console.log(`Wind speed: ${windspeed}kph`);
  console.log(`Wind direction: ${winddir}degrees`);
  console.log(`Visibility: ${visibility}km`);
  console.log(`UV Index: ${uvindex}`);
  console.log(`Current condition: ${conditions}`);

  //   try {
  //     const iconPath = await import(`../icons/${icon}.png`);
  //     const currIcon = document.querySelector('.current-icon');
  //     currIcon.src = iconPath.default;
  //     currIcon.alt = `${conditions}`;
  //   } catch (error) {
  //     console.log(error);
  //   }
}
