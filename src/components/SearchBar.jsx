import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import axios from 'axios';
import { TextField, Switch, FormControlLabel, Snackbar, Alert } from '@mui/material';
import { setSearchCriterion, setSearchQuery, setSearchUsers } from '../actions/actions';
import debounce from 'lodash/debounce';

const SearchBar = ({ token, setSearchCriterion }) => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.searchQuery);
  const allowShortPlaylists = useSelector((state) => state.allowShortPlaylists);
  const searchUsers = useSelector((state) => state.searchUsers);
  
  const [errorMessage, setErrorMessage] = useState('');

  const performSearch = async (query) => {
    if (!query) return;
    try {
      if (searchUsers) {
        try {
          const userResponse = await axios.get(`https://api.spotify.com/v1/users/${query}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const users = [{
            id: userResponse.data.id,
            name: userResponse.data.display_name,
            image: userResponse.data.images?.[0]?.url,
          }];
  
          setSearchCriterion('users', users);
          setSearchCriterion('playlists', []);
          setSearchCriterion('artists', []);

          // Fetch user playlists
          const userPlaylistsResponse = await axios.get(`https://api.spotify.com/v1/users/${userResponse.data.id}/playlists`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userPlaylists = userPlaylistsResponse.data?.items?.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images?.[0]?.url,
            totalTracks: playlist.tracks.total,
          })) || [];

          const filteredUserPlaylists = allowShortPlaylists
            ? userPlaylists
            : userPlaylists.filter(playlist => playlist.totalTracks >= 60);

          setSearchCriterion('playlists', filteredUserPlaylists);
        } catch (error) {
          if (error.response && error.response.status === 500) {
            setErrorMessage('No matching user profiles found.');
          } else {
            setErrorMessage('Error fetching data from Spotify API.');
          }
          setSearchCriterion('users', []);
        }
      } else {
        const playlistResponse = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: query,
            type: 'playlist',
          },
        });

        const playlists = playlistResponse.data?.playlists?.items?.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          image: playlist.images?.[0]?.url,
          totalTracks: playlist.tracks.total,
        })) || [];

        const filteredPlaylists = allowShortPlaylists
          ? playlists
          : playlists.filter(playlist => playlist.totalTracks >= 60);

        const artistResponse = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: query,
            type: 'artist',
          },
        });

        const artists = artistResponse.data?.artists?.items?.map((artist) => ({
          id: artist.id,
          name: artist.name,
          image: artist.images?.[0]?.url,
        })) || [];

        setSearchCriterion('playlists', filteredPlaylists);
        setSearchCriterion('artists', artists);
        setSearchCriterion('users', []);
      }
    } catch (error) {
      console.error('Error fetching data from Spotify API:', error);
      setErrorMessage('Error fetching data from Spotify API.');
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => performSearch(query), 500),
    [allowShortPlaylists, searchUsers]
  );

  const handleChange = (e) => {
    const query = e.target.value;
    dispatch(setSearchCriterion('playlists', []));
    dispatch(setSearchCriterion('artists', []));
    dispatch(setSearchCriterion('users', []));
    dispatch(setSearchQuery(query));
    debouncedSearch(query);
  };

  const handleSwitchChange = (e) => {
    setSearchCriterion('playlists', []);
    setSearchCriterion('artists', []);
    setSearchCriterion('users', []);
    dispatch(setSearchUsers(e.target.checked));
  };

  const handleCloseSnackbar = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [allowShortPlaylists, searchUsers]);

  return (
    <div style={{ width: '100%' }}>
      <TextField
        variant="outlined"
        label="So What's The Vibe"
        color="secondary"
        value={searchQuery}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            checked={searchUsers}
            onChange={handleSwitchChange}
            color="secondary"
          />
        }
        label="Search for other Users"
      />
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

const mapDispatchToProps = {
  setSearchCriterion,
  setSearchUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
