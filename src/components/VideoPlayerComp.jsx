import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import { setSongStep } from '../actions/actions';
import { useTimer } from 'use-timer';
import ReactPlayer from 'react-player';

const VideoPlayerComp = ({ songData, enterFullscreen }) => {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme);
    const activeSongNumer = useSelector((state) => state.activeSongNumer);
    const isPlaying = useSelector((state) => state.isPlaying);
    const [titleBlocker, setTitleBlocker] = useState(true);
    const [playRef, setPlayRef] = useState(true)
    const playerRef = useRef(null); 
    const { time, start, pause, reset, status } = useTimer({
        initialTime: 60,
        timerType: 'DECREMENTAL',
        autostart: true,
        endTime: 0,
        onTimeUpdate: () => {
            if (time === 52) {
                setTitleBlocker(false);
            }
        },
        onTimeOver: () => {
            dispatch(setSongStep('answer'));
            setTitleBlocker(true);
        },
    });

    const activeSong = songData[activeSongNumer];

    const handleReady = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(60, 'seconds');
            setPlayRef(true);
        }
    };

    useEffect(() => {
        if (isPlaying) {
          start(); 
          setPlayRef(true);
        } else {
          pause(); 
          setPlayRef(false);
        }
    }, [isPlaying]);

    return (
        <Box style={{ width: '100vw', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: theme.white, position: 'absolute', bottom: 0, left: 0 }}>
            {activeSong && activeSong.videoUrl ? (
                <>
                    <Box style={{ zIndex: 200, width: '100%', height: '100%', position: 'absolute', left: 0, bottom: 0 }}>
                    </Box>
                    <Box style={{ zIndex: 198, width: '100%', height: '100%' }}>
                        <ReactPlayer
                            ref={playerRef} 
                            url={activeSong.videoUrl}
                            playing={playRef}
                            controls={false}
                            width="100%"
                            height="100%"
                            onReady={handleReady} 
                            config={{
                                youtube: {
                                    playerVars: { showinfo: 0 }
                                }
                            }}
                        />
                    </Box>
                </>
            ) : (
                <CircularProgress color="secondary" />
            )}
            <Fade in={titleBlocker || !isPlaying}>
                <Box style={{color: theme.black, backgroundColor: theme.black, width: '700px', height: '70px', position: 'absolute', top: 0, left: 0, zIndex: 202}}>t</Box>
            </Fade>
            <Box style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', zIndex: 201, justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress
                    color="secondary"
                    variant="determinate"
                    value={(time / 60) * 100}
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

export default VideoPlayerComp;
