# The Weather App

[Atmos - Live (Click to check it out!)](https://atif-pathan.github.io/weather-app/)

## Overview

Atmos is a weather app that provides real-time weather updates with an engaging and interactive interface. Users can search for any location and view the current weather conditions, a quick 14-day forecast and also toggle between metric and US units. Each search comes with a dynamic GIF based on weather conditions, adding a fun visual element!

## Key Features

- **Real-Time Weather:** Get current weather conditions like `temperature`, `humidity`, `precipitation probability` etc.
- **14-day forecast:** Get a full 2 weeks of weather forcast, with `high's` and `low's` as well as chance of precipitation.
- **Unit Toggle:** Switch between `metric` and `US` units seamlessly.
- **Dynamic GIFs:** Fetches a unique and contextually relevant GIF for the weather conditions.
- **Persistent Data:** Weather data is stored in localStorage, allowing users to revisit and refresh their last searched location.

## What did I learn? (Concepts and Principles I applied)

- **API Integration:** Leveraging `VirtualCrossing's` Weather API and `Giphy's` API for data and media.
- **Asynchronous Programming:** Effective use of `async/await` and error handling.
- **State Management:** Persistent state using `localStorage`.
- **Modular Code:** Clean, reusable functions for UI updates and data fetching.

## Tools and Technologies

- **JavaScript:** Core programming language used for logic, DOM manipulation, `async functions` and a cool carousel for the forecast.
- **Webpack:** Module bundler for efficient asset management.
- **HTML:** For the skeleton and setting up default layout of the weather app.
- **CSS:** Custom styles, including a smooth carousel design.
- **FontAwesome:** For icons used in the UI.
- **EsLint/Prettier/Babel:** For code formatting and linting.

## Future Improvements

I am quite happy with the way it is currently however, there are a few improvements I would like to add in the future:

- A better GIF search that ensures proper and relevant GIFs. Currently, it searches based on the conditions parameter that comes in, however that range of conditions is limited and very basic. So the API only searches on basic short prompts. I want to maybe generate a more dynamic search based on the actual values and forecast numbers.
- Currently there is no hourly view, eventhough the API pulls hourly weather data as well. So I would like to add a section for that in the future.
- The search is a little funky and doesnt always work with spelling mistakes or same named locations. An autocomplete feature would make it much easier for the user to search exactly what they are looking for.
