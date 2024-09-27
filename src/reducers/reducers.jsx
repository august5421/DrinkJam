const initialState = {
  isMobile: false,
  theme: {
    black: '#000',
    white: '#FFF',
    grey: '#878787',
    primary: '#ab47bc',
    secondary: '#ce93d8',
    tertiary: '#f3e5f5',
  },
  auth: {
    isAuthenticated: false,
    token: null,
    user: null,
  },
  previousUser: null,
  activeScreen: null,
  searchQuery: '',
  searchCriterion: {
    playlists: [],
    artists: [],
    users: [],
  },
  allowShortPlaylists: false,
  searchUsers: false,
  songStep: 'video',
  activeSongNumer: 0, 
  songSet: {
    source: null,
    sourceId: null,
    tracks: []
  },
  isPlaying: true,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MOBILE':
      return {
        ...state,
        isMobile: action.payload,
      };
    case 'SET_AUTH':
      return {
        ...state,
        auth: {
          ...state.auth,
          isAuthenticated: action.payload.isAuthenticated,
          token: action.payload.token,
          user: action.payload.user,
        },
      };
    case 'SET_PREVIOUS_USER':
      return {
        ...state,
        previousUser: action.payload,
      };
    case 'SET_SONG_STEP':
      return {
        ...state,
        songStep: action.payload,
      };
    case 'SET_SONG_NUMBER':
      return {
        ...state,
        activeSongNumer: action.payload,
      };
    case 'SET_ACTIVE_SCREEN':
      return {
        ...state,
        activeScreen: action.payload,
      };
    case 'SET_PLAY_PAUSE':
      return {
        ...state,
        isPlaying: action.payload,
      };
    case 'SET_SEARCH_CRITERION':
      const { key, value } = action.payload;
      return {
        ...state,
        searchCriterion: {
          ...state.searchCriterion,
          [key]: value,
        },
      };
    case 'SET_SONG_SET':
      const { songSetKey, songSetValue } = action.payload;
      return {
        ...state,
        songSet: {
          ...state.songSet,
          [songSetKey]: songSetValue,
        },
      };
    case 'SET_ALLOW_SHORT_PLAYLISTS':
      return {
        ...state,
        allowShortPlaylists: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_SEARCH_USERS':
      return {
        ...state,
        searchUsers: action.payload,
      };
    default:
      return state;
  }
};


export default rootReducer;
