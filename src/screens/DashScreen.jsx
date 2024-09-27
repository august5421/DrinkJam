import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Switch, FormControlLabel, Fade } from '@mui/material';
import axios from 'axios';
import LogoFont from '../components/LogoFont';
import { setActiveScreen, setAllowShortPlaylists, setSearchCriterion, setSongSet } from '../actions/actions';
import CircularProgress from '@mui/material/CircularProgress';
import SearchBar from '../components/SearchBar';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

function DashScreen() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const searchCriterion = useSelector((state) => state.searchCriterion);
  const allowShortPlaylists = useSelector((state) => state.allowShortPlaylists);
  const auth = useSelector((state) => state.auth);
  const searchQuery = useSelector((state) => state.searchQuery);
  const searchUsers = useSelector((state) => state.searchUsers);
  const [hoveredPlaylist, setHoveredPlaylist] = useState(null);
  const [hoveredArtist, setHoveredArtist] = useState(null);

  const handleSwitchChange = () => {
    dispatch(setAllowShortPlaylists(!allowShortPlaylists));
  };

  useEffect(() => {
    const getUserData = async () => {
      if (searchQuery === '') {
        try {
          const playlistsResponse = await axios.get(`https://api.spotify.com/v1/users/${auth.user.id}/playlists`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });

          let playlists = playlistsResponse.data.items.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images[0].url,
            tracks: playlist.tracks.total
          }));

          if (!allowShortPlaylists) {
            playlists = playlists.filter((playlist) => playlist.tracks >= 60);
          }

          const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });

          const artists = topArtistsResponse.data.items.map((artist) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images[0].url,
          }));

          dispatch(setSearchCriterion('playlists', playlists));
          dispatch(setSearchCriterion('artists', artists));

        } catch (error) {
          console.error('Error getting token or user info:', error);
        }
      }
    };
    getUserData();
  }, [dispatch, allowShortPlaylists, searchQuery]);

  const handleGameStart = (x, y) => {
    dispatch(setActiveScreen('GameScreen'));
    dispatch(setSongSet('source', x)); 
    dispatch(setSongSet('sourceId', y)); 
}

  return (
    <Box style={{ width: '100vw', height: 'calc(100vh - 70px)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: theme.white, flexDirection: 'column', position: 'absolute', bottom: 0, left: 0 }}>
      <Box style={{ width: 'calc(100vw - 40px)', display: 'flex', flex: 1, color: theme.white, flexDirection: 'row', padding: '20px 20px 0px 20px', justifyContent: 'center', alignItems: 'center' }}>
        <SearchBar />
      </Box>
      {searchUsers ? (
        <>
            <Box style={{ width: 'calc(100vw - 40px)', display: 'flex', flex: 2, color: theme.white, flexDirection: 'row', padding: '20px 20px 0px 20px' }}>
                <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'center' }}>
                    <LogoFont text='Matching Users' fontColor={theme.white} fontWeight={700} fontSize="20px" />
                    <Fade in={searchCriterion.users.length > 0} timeout={750}>
                        <Box style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', alignItems: 'center', overflow: 'auto', overflowY: 'hidden' }}>
                        {searchCriterion.users.map((user) => (
                            <Tooltip arrow TransitionComponent={Zoom} placement="top" title={user.name}>
                                <Box
                                key={user.id}
                                style={{
                                    border: '3px solid ' + (hoveredPlaylist === user.id ? '#AB47BC' : 'transparent'),
                                    display: 'flex',
                                    width: '200px',
                                    maxHeight: '200px',
                                    margin: '0px 25px 0px 0px',
                                    color: theme.white,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    transition: 'border-color 0.3s',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    padding: '10px'
                                }}
                                onMouseEnter={() => setHoveredPlaylist(user.id)}
                                onMouseLeave={() => setHoveredPlaylist(null)}
                                >
                                <img
                                    width={"75px"}
                                    height={"75px"}
                                    src={user.image}
                                    alt=""
                                />
                                <LogoFont
                                    text={user.name.length >= 16 ? `${user.name.slice(0, 15)}...` : user.name}
                                    fontMargin='10px 0px 0px 0px'
                                    fontColor={theme.white}
                                    fontWeight={700}
                                    fontSize="15px"
                                    fontFamily='Trebuchet MS'
                                />
                                </Box>
                            </Tooltip>
                        ))}
                        </Box>
                    </Fade>
                </Box>
            </Box>
            <Box style={{ width: 'calc(100vw - 40px)', display: 'flex', flex: 2, color: theme.white, flexDirection: 'row', padding: '20px 20px 0px 20px' }}>
                <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'center' }}>
                <LogoFont text={searchQuery === '' ? 'Your Playlists' : 'Matching Playlists'} fontColor={theme.white} fontWeight={700} fontSize="20px" />
                <FormControlLabel
                    control={<Switch checked={allowShortPlaylists} onChange={handleSwitchChange} color="secondary" />}
                    label="Allow for playlists with fewer than 60 songs"
                    labelPlacement="end"
                    style={{ color: theme.white }}
                />
                <Fade in={searchCriterion.playlists.length > 0} timeout={750}>
                    <Box style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', alignItems: 'center', overflow: 'auto', overflowY: 'hidden' }}>
                    {searchCriterion.playlists.map((playlist) => (
                        <Tooltip arrow TransitionComponent={Zoom} placement="top" title={playlist.name}>
                            <Box
                            onClick={() => {handleGameStart('playlist', playlist.id)}}
                            key={playlist.id}
                            style={{
                                border: '3px solid ' + (hoveredPlaylist === playlist.id ? '#AB47BC' : 'transparent'),
                                display: 'flex',
                                width: '200px',
                                maxHeight: '200px',
                                margin: '0px 25px 0px 0px',
                                color: theme.white,
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'border-color 0.3s',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                padding: '10px'
                            }}
                            onMouseEnter={() => setHoveredPlaylist(playlist.id)}
                            onMouseLeave={() => setHoveredPlaylist(null)}
                            >
                            <img
                                width={"75px"}
                                height={"75px"}
                                src={playlist.image}
                                alt=""
                            />
                            <LogoFont
                                text={playlist.name.length >= 16 ? `${playlist.name.slice(0, 15)}...` : playlist.name}
                                fontMargin='10px 0px 0px 0px'
                                fontColor={theme.white}
                                fontWeight={700}
                                fontSize="15px"
                                fontFamily='Trebuchet MS'
                            />
                            </Box>
                        </Tooltip>
                    ))}
                    </Box>
                </Fade>
              </Box>
            </Box>
        </>
      ) : (
        <>
            <Box style={{ width: 'calc(100vw - 40px)', display: 'flex', flex: 2, color: theme.white, flexDirection: 'row', padding: '20px 20px 0px 20px' }}>
                <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'center' }}>
                <LogoFont text={searchQuery === '' ? 'Your Playlists' : 'Matching Playlists'} fontColor={theme.white} fontWeight={700} fontSize="20px" />
                <FormControlLabel
                    control={<Switch checked={allowShortPlaylists} onChange={handleSwitchChange} color="secondary" />}
                    label="Allow for playlists with fewer than 60 songs"
                    labelPlacement="end"
                    style={{ color: theme.white }}
                />
                {!searchCriterion.playlists.length > 0 && (
                    <Box style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress color="secondary" />
                    </Box>
                )}
                <Fade in={searchCriterion.playlists.length > 0} timeout={750}>
                    <Box style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', alignItems: 'center', overflow: 'auto', overflowY: 'hidden' }}>
                    {searchCriterion.playlists.map((playlist) => (
                        <Tooltip arrow TransitionComponent={Zoom} placement="top" title={playlist.name}>
                            <Box
                            onClick={() => {handleGameStart('playlist', playlist.id)}}
                            key={playlist.id}
                            style={{
                                border: '3px solid ' + (hoveredPlaylist === playlist.id ? '#AB47BC' : 'transparent'),
                                display: 'flex',
                                width: '200px',
                                maxHeight: '200px',
                                margin: '0px 25px 0px 0px',
                                color: theme.white,
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'border-color 0.3s',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                padding: '10px'
                            }}
                            onMouseEnter={() => setHoveredPlaylist(playlist.id)}
                            onMouseLeave={() => setHoveredPlaylist(null)}
                            >
                            <img
                                width={"75px"}
                                height={"75px"}
                                src={playlist.image}
                                alt=""
                            />
                            <LogoFont
                                text={playlist.name.length >= 16 ? `${playlist.name.slice(0, 15)}...` : playlist.name}
                                fontMargin='10px 0px 0px 0px'
                                fontColor={theme.white}
                                fontWeight={700}
                                fontSize="15px"
                                fontFamily='Trebuchet MS'
                            />
                            </Box>
                        </Tooltip>
                    ))}
                    </Box>
                </Fade>
              </Box>
            </Box>
            <Box style={{ width: 'calc(100vw - 40px)', display: 'flex', flex: 2, color: theme.white, flexDirection: 'row', padding: '20px 20px 0px 20px' }}>
                <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'center' }}>
                <LogoFont text={searchQuery === '' ? 'Your Top Artists' : 'Matching Artists'} fontColor={theme.white} fontWeight={700} fontSize="20px" />
                {!searchCriterion.artists.length > 0 && (
                    <Box style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress color="secondary" />
                    </Box>
                )}
                <Fade in={searchCriterion.artists.length > 0} timeout={750}>
                    <Box style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', alignItems: 'center', overflow: 'auto' }}>
                    {searchCriterion.artists.map((artist) => (
                        <Tooltip arrow TransitionComponent={Zoom} placement="top" title={artist.name}>
                            <Box
                            onClick={() => {handleGameStart('artist', artist.id)}}
                            key={artist.id}
                            style={{
                                border: '3px solid ' + (hoveredArtist === artist.id ? '#AB47BC' : 'transparent'),
                                display: 'flex',
                                width: '200px',
                                maxHeight: '200px',
                                margin: '0px 25px 0px 0px',
                                color: theme.white,
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'border-color 0.3s',
                                cursor: 'pointer',
                                borderRadius: '5px',
                                padding: '10px'
                            }}
                            onMouseEnter={() => setHoveredArtist(artist.id)}
                            onMouseLeave={() => setHoveredArtist(null)}
                            >
                            <img
                                width={"75px"}
                                height={"75px"}
                                src={artist.image}
                                alt=""
                            />
                            <LogoFont
                                text={artist.name.length >= 17 ? `${artist.name.slice(0, 16)}...` : artist.name}
                                fontMargin='10px 0px 0px 0px'
                                fontColor={theme.white}
                                fontWeight={700}
                                fontSize="15px"
                                fontFamily='Trebuchet MS'
                            />
                            </Box>
                        </Tooltip>
                    ))}
                    </Box>
                </Fade>
                </Box>
            </Box>
        </>
      )}
    </Box>
  );
}

export default DashScreen;
