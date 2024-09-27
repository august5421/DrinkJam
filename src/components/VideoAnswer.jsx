import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, CircularProgress } from '@mui/material';
import { setSongNumber, setSongStep } from '../actions/actions';
import { useTimer } from 'use-timer';
import fallback from '../assets/images/fallback.jpg';
import LogoFont from '../components/LogoFont'
const VideoAnswer = ({ songData }) => {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme);
    const activeSongNumer = useSelector((state) => state.activeSongNumer);
    const { time, start, pause, reset, status } = useTimer({
      initialTime: 5,
      timerType: 'DECREMENTAL',
      autostart: true,
      endTime: 0,
      onTimeOver: () => {
        dispatch(setSongStep('video'));
        dispatch(setSongNumber(activeSongNumer + 1))
      },
    });
  
    const activeSong = songData[activeSongNumer];
  
    return (
      <Box style={{ width: '100vw', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: theme.white, position: 'absolute', bottom: 0, left: 0 }}>
        {activeSong && activeSong.videoUrl ? (
          <Box>
          <img 
            src={activeSong.albumArt !== 'No album art available' ? activeSong.albumArt : fallback} 
            width="100%" 
            height="75%" 
            style={{maxWidth: '400px', maxHeight: '400px'}} 
          />        
          <LogoFont text={activeSong.title} fontColor={theme.white} fontWeight={700} fontSize="20px" />
          <LogoFont text={activeSong.artist} fontColor={theme.primary} fontWeight={700} fontSize="20px" />
          </Box>
        ) : (
          <CircularProgress color="secondary"/>
        )}
        <Box style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress 
                color="secondary" 
                variant="determinate" 
                value={(time / 5) * 100}
                size={80}
            />
            <Typography 
                variant="caption" 
                component="div" 
                color="secondary" 
                style={{ position: 'absolute', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {time}
            </Typography>
            </Box>

      </Box>
    );
  };
  

export default VideoAnswer;
