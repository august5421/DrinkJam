import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../config/Firebase';
import VideoPlayerComp from '../components/VideoPlayerComp';
import VideoAnswer from '../components/VideoAnswer';

const GameScreen = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const songSet = useSelector((state) => state.songSet);
  const auth = useSelector((state) => state.auth);
  const songStep = useSelector((state) => state.songStep);
  const [songIds, setSongIds] = useState([]);
  const [songData, setSongData] = useState([]);

  const enterFullscreen = () => {
    const element = document.documentElement; 
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const fetchSpotifyData = async () => {
    const { source, sourceId } = songSet;
    let tracks = [];

    if (source === 'playlist') {
      tracks = await getPlaylistTracks(sourceId);
    } else if (source === 'artist') {
      tracks = await getArtistTracks(sourceId);
    }

    const randomTracks = tracks.sort(() => 0.5 - Math.random()).slice(0, 60);
    setSongIds(randomTracks);
  };

  const getPlaylistTracks = async (playlistId) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const data = await response.json();
      return data.items.map(item => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
        albumArt: item.track.album.images[0]?.url || 'No album art available'  
      }));
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      return [];
    }
  };
  
  const getArtistTracks = async (artistId) => {
    try {
      const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const albumsData = await albumsResponse.json();
      const albumTracks = await Promise.all(
        albumsData.items.map(async (album) => {
          const tracksResponse = await fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          const tracksData = await tracksResponse.json();
          const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${album.id}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          const albumData = await albumResponse.json();
          return tracksData.items.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map(artist => artist.name).join(', '),
            albumArt: albumData.images[0].url || 'No album art available'
          }));
        })
      );
      return albumTracks.flat();
    } catch (error) {
      console.error('Error fetching artist tracks:', error);
      return [];
    }
  };

  const fetchYouTubeVideoUrl = async (trackTitle, trackArtist) => {
    console.log(trackTitle, trackArtist)
    try {
      const searchQuery = `${trackTitle} ${trackArtist}`;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=AIzaSyCrPmykYpNdzSUeuhoJGlci02VED_fgi7I&type=video&maxResults=1`
      );
      const data = await response.json();
      console.log(data)
      if (data.items && data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
      } else {
        return 'No YouTube video found';
      }
    } catch (error) {
      console.error('Error fetching YouTube video:', error);
      return 'Error fetching YouTube video';
    }
  };

  const fetchFirestoreData = async (tracks) => {
    const firestoreData = await Promise.all(
      tracks.map(async (track) => {
        const docRef = doc(db, 'songs', track.id);
        const docSnap = await getDoc(docRef);

        let videoUrl = 'No document available';

        if (docSnap.exists()) {
          const docData = docSnap.data();
          videoUrl = docData['Video URL'] || 'No document available';
        }

        if (videoUrl === 'No document available') {
          videoUrl = await fetchYouTubeVideoUrl(track.title, track.artist);
        }

        return {
          id: track.id,
          title: track.title,
          artist: track.artist,
          albumArt: track.albumArt,
          videoUrl: videoUrl,
        };
      })
    );
    setSongData(firestoreData);
  };

  useEffect(() => {
    if (songSet.source && auth.token) {
      fetchSpotifyData();
    }
  }, [auth.token]);

  useEffect(() => {
    if (songIds.length > 0) {
      fetchFirestoreData(songIds);
    }
  }, [songIds]);

  return (
    <Box style={{ width: '100vw', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', color: theme.white, position: 'absolute', bottom: 0, left: 0 }}>
      {songStep === 'video' ? (
        <VideoPlayerComp enterFullscreen={enterFullscreen} songData={songData} />
      ) : (
        <VideoAnswer songData={songData} />
      )}
    </Box>
  );
};

export default GameScreen;
