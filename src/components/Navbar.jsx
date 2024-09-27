import { useState } from 'react';
import { Box, Avatar, Menu, MenuItem, IconButton, Button } from '@mui/material';
import { setPlayPause } from '../actions/actions';
import { PlayArrow, Pause } from '@mui/icons-material';
import LogoFont from './LogoFont';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth, setActiveScreen, setSearchCriterion, setPreviousUser } from '../actions/actions';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import Cookies from 'js-cookie';

function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const auth = useSelector((state) => state.auth);
  const previousUser = useSelector((state) => state.previousUser);
  const isMobile = useSelector((state) => state.isMobile);
  const searchCriterion = useSelector((state) => state.searchCriterion);
  const isPlaying = useSelector((state) => state.isPlaying);
  const activeScreen = useSelector((state) => state.activeScreen);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    console.log(searchCriterion)
  };

  const handlePlayPause = () => {
    dispatch(setPlayPause(!isPlaying));
  };

  const handleLogout = () => {
    handleMenuClose();
    setTimeout(() => {
      Cookies.remove('spotifyAuthToken');
      Cookies.remove('spotifyUser');
      dispatch(setAuth({ isAuthenticated: false, token: null, user: null }));
      dispatch(setSearchCriterion('playlists', []));
      dispatch(setSearchCriterion('artists', []));
      dispatch(setSearchCriterion('users', []));
      dispatch(setActiveScreen(null));
    }, 250)
  };

  return (
    <Box style={{ display: 'flex', padding: '0px 15px', width: 'calc(100vw - 30px)', height: '70px', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.black, position: 'absolute', top: 0, left: 0 }}>
      <LogoFont text='DrinkJam' fontColor={theme.primary} offsetColor={theme.white} fontWeight={700} fontSize="45px" fontAlign='center' />
      {activeScreen === 'GameScreen' && (
        <Button variant="contained" color="secondary" onClick={handlePlayPause} style={{marginRight: isMobile ? '0px' : '125px'}}>
          {isPlaying ? (
            <Box style={{display: 'flex', flexDirection: 'row'}}>
              Pause
              <Pause sx={{color: theme.white}} />
            </Box>
            ) : (
            <Box style={{display: 'flex', flexDirection: 'row'}}>
              Play
              <PlayArrow sx={{color: theme.white}} />
            </Box>)}
        </Button>
      )}
      <Fade in={auth.isAuthenticated} timeout={750}>
        <Box>
          <IconButton onClick={handleMenuOpen} style={{ marginLeft: 'auto' }}>
            {auth.isAuthenticated && (<Avatar alt={auth.user.display_name} src={auth.user.images[0].url} />)}
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            style={{ top: '55px' }}
          >
            {auth.isAuthenticated && (<MenuItem><b>Logged in as:</b>&nbsp;{auth.user.display_name}</MenuItem>)}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Button variant="contained" color="secondary" style={{ margin: 'auto' }}>
                Logout
              </Button>
            </MenuItem>
          </Menu>
        </Box>
      </Fade>
    </Box>
  );
}

export default Navbar;
