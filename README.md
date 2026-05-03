# Road Trip Playlist 🚗🎵

A simple, single-page web app for planning a road trip and curating the perfect playlist to go with it.

## Features

- **Trip details** — name your trip and set a start, destination, and date.
- **Stops** — add and remove stops along the way.
- **Playlist** — add songs (title + artist) and remove ones you no longer want.
- **Local persistence** — your trip is saved in `localStorage`, so it survives page reloads.
- **Reset** — wipe everything and start a new trip with one click.

## Running

No build step required. Just open `index.html` in a browser, or serve the folder:

```sh
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — page markup
- `styles.css` — styling
- `app.js` — application logic (state, rendering, persistence)
