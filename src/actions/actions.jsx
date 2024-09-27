export const setMobile = (state) => ({
    type: 'SET_MOBILE',
    payload: state,
  });
export const setAuth = (state) => ({
  type: 'SET_AUTH',
  payload: state,
});
export const setActiveScreen = (state) => ({
  type: 'SET_ACTIVE_SCREEN',
  payload: state,
});
export const setSearchCriterion = (key, value) => ({
  type: 'SET_SEARCH_CRITERION',
  payload: { key, value },
});
export const setSongSet = (songSetKey, songSetValue) => ({
  type: 'SET_SONG_SET',
  payload: { songSetKey, songSetValue },
});
export const setAllowShortPlaylists = (state) => ({
  type: 'SET_ALLOW_SHORT_PLAYLISTS',
  payload: state,
});
export const setPreviousUser = (state) => ({
  type: 'SET_PREVIOUS_USER',
  payload: state,
});
export const setSearchQuery = (state) => ({
  type: 'SET_SEARCH_QUERY',
  payload: state,
});
export const setSearchUsers = (state) => ({
  type: 'SET_SEARCH_USERS',
  payload: state,
});
export const setSongStep = (state) => ({
  type: 'SET_SONG_STEP',
  payload: state,
});
export const setSongNumber = (state) => ({
  type: 'SET_SONG_NUMBER',
  payload: state,
});
export const setPlayPause = (isPlaying) => ({
  type: 'SET_PLAY_PAUSE',
  payload: isPlaying,
});