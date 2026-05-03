// Simple Road Trip Playlist app
// State is persisted to localStorage so the trip survives page reloads.

(function () {
  'use strict';

  const STORAGE_KEY = 'roadTripPlaylist:v1';

  /** @type {{trip: {name:string,start:string,destination:string,date:string}|null, stops: string[], songs: {title:string, artist:string}[]}} */
  const defaultState = { trip: null, stops: [], songs: [] };

  let state = loadState();

  // --- Persistence ---------------------------------------------------------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      return {
        trip: parsed.trip ?? null,
        stops: Array.isArray(parsed.stops) ? parsed.stops : [],
        songs: Array.isArray(parsed.songs) ? parsed.songs : [],
      };
    } catch (_err) {
      return structuredClone(defaultState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_err) {
      // Storage may be unavailable (private mode, quota); ignore.
    }
  }

  // --- Utilities -----------------------------------------------------------
  function el(id) {
    return document.getElementById(id);
  }

  // Build DOM nodes safely (avoids HTML injection from user input).
  function createItem(text, onRemove, subText) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.className = 'item-text';
    span.textContent = text;
    if (subText) {
      const sub = document.createElement('span');
      sub.className = 'artist';
      sub.textContent = ' — ' + subText;
      span.appendChild(sub);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'icon';
    btn.setAttribute('aria-label', 'Remove');
    btn.textContent = '✕';
    btn.addEventListener('click', onRemove);
    li.appendChild(span);
    li.appendChild(btn);
    return li;
  }

  // --- Renderers -----------------------------------------------------------
  function renderTrip() {
    const summary = el('trip-summary');
    if (state.trip) {
      const { name, start, destination, date } = state.trip;
      const datePart = date ? ` on ${date}` : '';
      summary.textContent = `${name}: ${start} → ${destination}${datePart}`;
      el('trip-name').value = name;
      el('trip-start').value = start;
      el('trip-destination').value = destination;
      el('trip-date').value = date || '';
    } else {
      summary.textContent = '';
    }
  }

  function renderStops() {
    const list = el('stop-list');
    list.replaceChildren();
    state.stops.forEach((stop, idx) => {
      list.appendChild(createItem(stop, () => removeStop(idx)));
    });
    el('stop-empty').style.display = state.stops.length ? 'none' : '';
  }

  function renderSongs() {
    const list = el('song-list');
    list.replaceChildren();
    state.songs.forEach((song, idx) => {
      list.appendChild(createItem(song.title, () => removeSong(idx), song.artist));
    });
    el('song-empty').style.display = state.songs.length ? 'none' : '';
    const count = state.songs.length;
    el('song-count').textContent = count
      ? `${count} song${count === 1 ? '' : 's'} in your playlist.`
      : '';
  }

  function renderAll() {
    renderTrip();
    renderStops();
    renderSongs();
  }

  // --- Actions -------------------------------------------------------------
  function saveTrip(e) {
    e.preventDefault();
    const name = el('trip-name').value.trim();
    const start = el('trip-start').value.trim();
    const destination = el('trip-destination').value.trim();
    const date = el('trip-date').value;
    if (!name || !start || !destination) return;
    state.trip = { name, start, destination, date };
    saveState();
    renderTrip();
  }

  function addStop(e) {
    e.preventDefault();
    const input = el('stop-input');
    const value = input.value.trim();
    if (!value) return;
    state.stops.push(value);
    input.value = '';
    saveState();
    renderStops();
  }

  function removeStop(idx) {
    state.stops.splice(idx, 1);
    saveState();
    renderStops();
  }

  function addSong(e) {
    e.preventDefault();
    const titleInput = el('song-title');
    const artistInput = el('song-artist');
    const title = titleInput.value.trim();
    const artist = artistInput.value.trim();
    if (!title || !artist) return;
    state.songs.push({ title, artist });
    titleInput.value = '';
    artistInput.value = '';
    titleInput.focus();
    saveState();
    renderSongs();
  }

  function removeSong(idx) {
    state.songs.splice(idx, 1);
    saveState();
    renderSongs();
  }

  function resetTrip() {
    if (!confirm('Reset the entire trip and playlist?')) return;
    state = structuredClone(defaultState);
    saveState();
    el('trip-form').reset();
    renderAll();
  }

  // --- Wire up -------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    el('trip-form').addEventListener('submit', saveTrip);
    el('stop-form').addEventListener('submit', addStop);
    el('song-form').addEventListener('submit', addSong);
    el('reset-btn').addEventListener('click', resetTrip);
    renderAll();
  });
})();
