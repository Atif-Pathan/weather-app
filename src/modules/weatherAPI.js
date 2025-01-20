const fetchWeather = async (
  location,
  unit,
  key = 'MWQTC5KRABXAAUK8SZ7CL9HJN'
) => {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&iconSet=icons2&key=${key}`;
  try {
    const data = await fetch(url);
    if (!data.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return data.json();
  } catch (error) {
    console.error(error);
  }
};

export { fetchWeather };
