import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';
import Navbar from './components/Navbar';
import { setAuth, setActiveScreen, setPreviousUser } from './actions/actions';
import Fade from '@mui/material/Fade';
import DashScreen from './screens/DashScreen';
import { useEffect } from 'react';
import './App.css';
import GameScreen from './screens/GameScreen';
import Cookies from 'js-cookie';
import { Avatar } from '@mui/material';

const clientId = '2721b25b1e36477786b8220fa8d4dd65';
const redirectUri = 'http://localhost:5173/redirect';
const scopes = 'user-read-private user-read-email user-read-recently-played user-top-read streaming';

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const isMobile = useSelector((state) => state.isMobile);
  const auth = useSelector((state) => state.auth);
  const activeScreen = useSelector((state) => state.activeScreen);
  const searchCriterion = useSelector((state) => state.searchCriterion);
  const previousUser = useSelector((state) => state.previousUser);
  
  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };

  const handleLoginAsSomeoneElse = () => {
    dispatch(setPreviousUser(null));
    Cookies.remove('spotifyAuthToken');
    Cookies.remove('spotifyUser');
    const logoutUrl = `https://accounts.spotify.com/logout?continue=${encodeURIComponent(redirectUri)}`;
    const newWindow = window.open(logoutUrl, '_blank', 'width=10,height=10');
    setTimeout(() => {
      if (newWindow) {
        newWindow.close();
        setTimeout(() => {
          handleLogin();
        }, 500);
      }
    }, 500);
  };
  

  useEffect(() => {
    const token = Cookies.get('spotifyAuthToken');
    if (token) {
      const user = JSON.parse(Cookies.get('spotifyUser'));
      dispatch(setAuth({ isAuthenticated: true, token, user }));
      dispatch(setActiveScreen('DashScreen'));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("prevUser", JSON.stringify(auth.user));
  }, [auth.user]);
  
  useEffect(() => {
    const prevUser = JSON.parse(localStorage.getItem("prevUser"));
    if (prevUser) {
      dispatch(setPreviousUser(prevUser))
    }
  }, []);
  useEffect(()=>{console.log(previousUser)}, [previousUser])
  useEffect(() => {
    console.log(searchCriterion);
  }, [searchCriterion]);

  return (
    <Box style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.black, position: 'relative' }}>
      <Navbar />
      <Fade in={!auth.isAuthenticated} timeout={750}>
        <Box>
          <Fade in={previousUser} timeout={750}>
            <Box style={{display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', width: isMobile ? '90%' : '350px'}}>
              {previousUser && (
                <>
                  <Avatar alt={previousUser.display_name} src={previousUser.images[1].url} sx={{ width: 150, height: 150 }} />
                  <Button variant="contained" color="secondary" onClick={handleLogin} style={{margin: '15px 0px', width: '100%'}}>
                    Login as {previousUser.display_name}
                  </Button>
                  <Button variant="contained" onClick={handleLoginAsSomeoneElse} style={{width: '100%', backgroundColor: theme.grey}}>
                    Login as someone else
                  </Button>
                </>
              )}
            </Box>
          </Fade>
          <Fade in={!previousUser} timeout={750}>
            <Box style={{display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', width: isMobile ? '90%' : '350px'}}>
              {!previousUser && (
                <Button variant="contained" color="secondary" onClick={handleLogin}>
                  Login with Spotify
                </Button>
              )}
            </Box>
          </Fade>
        </Box>
      </Fade>
      <Fade in={activeScreen === 'DashScreen'} timeout={750}>
        <Box>
          {activeScreen === 'DashScreen' && (
            <DashScreen />
          )}
        </Box>
      </Fade>
      <Fade in={activeScreen === 'GameScreen'} timeout={750}>
        <Box>
          {activeScreen === 'GameScreen' && (
            <GameScreen />
          )}
        </Box>
      </Fade>
    </Box>
  );
}

export default App;
