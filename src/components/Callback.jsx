import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogoFont from './LogoFont';
import { setSearchCriterion, setAuth, setActiveScreen } from '../actions/actions';
import { Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Fade from '@mui/material/Fade';
import Cookies from 'js-cookie';

const clientId = '2721b25b1e36477786b8220fa8d4dd65';
const clientSecret = '1aa2fa931eab4c11b76d65999a8f0dca';
const redirectUri = 'http://localhost:5173/redirect';

const Callback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const getToken = async (code) => {
      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
          params: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const { access_token, refresh_token, expires_in } = response.data;
        const expirationTime = new Date().getTime() + expires_in * 1000;

        // Store tokens and expiration time
        Cookies.set('spotifyAuthToken', access_token, { expires: 3 });
        Cookies.set('spotifyRefreshToken', refresh_token || Cookies.get('spotifyRefreshToken'), { expires: 7 });
        localStorage.setItem('spotifyTokenExpiration', expirationTime);

        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        Cookies.set('spotifyUser', JSON.stringify(userResponse.data), { expires: 3 });
        dispatch(setAuth({ isAuthenticated: true, token: access_token, user: userResponse.data }));

        setTimeout(() => {
          dispatch(setActiveScreen('DashScreen'));
          navigate('/');
        }, 250);

      } catch (error) {
        console.error('Error getting token or user info:', error);
      }
    };

    const refreshAccessToken = async () => {
      const refreshToken = Cookies.get('spotifyRefreshToken');
      if (!refreshToken) {
        console.error('No refresh token available');
        return;
      }

      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
          params: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;
        const expirationTime = new Date().getTime() + expires_in * 1000;

        // Store new access token and possibly a new refresh token
        Cookies.set('spotifyAuthToken', access_token, { expires: 3 });
        localStorage.setItem('spotifyTokenExpiration', expirationTime);

        if (newRefreshToken) {
          Cookies.set('spotifyRefreshToken', newRefreshToken, { expires: 7 });
        }

        dispatch(setAuth({ isAuthenticated: true, token: access_token }));
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const tokenExpiration = localStorage.getItem('spotifyTokenExpiration');

    // Handle the initial token acquisition
    if (code) {
      getToken(code);
    } else if (auth.isAuthenticated) {
      const now = new Date().getTime();
      if (now >= tokenExpiration) {
        refreshAccessToken();
      }
    }
  }, [dispatch, navigate, auth.isAuthenticated]);

  return (
    <Box style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.black, position: 'relative' }}>
      <Navbar />
      <Fade in={!auth.isAuthenticated} timeout={750}>
        <Box>
          <LogoFont text='Loading...' fontColor={theme.white} fontWeight={700} fontSize="20px" fontAlign='center' />
        </Box>
      </Fade>
    </Box>
  );
};

export default Callback;
