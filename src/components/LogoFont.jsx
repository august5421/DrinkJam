import React from 'react';
import { Typography, Box } from '@mui/material';
import './components.css';

const LogoFont = (props) => {
  return (
    <Typography
      sx={{
        fontFamily: props.fontFamily ? props.fontFamily : 'LogoFont, sans-serif',
        color: props.fontColor,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        margin: props.fontMargin,
        letterSpacing: '3px',
        textAlign: props.fontAalign,
        transition: 'color 0.3s ease',
        zIndex: 9,
      }}
    >
      {props.offsetColor && props.text === "DrinkJam" ? (
        <Box component="span">
          <Box component="span" sx={{ color: props.fontColor }}>
            Drink
          </Box>
          <Box component="span" sx={{ color: props.offsetColor }}>
            Jam
          </Box>
        </Box>
      ) : (
        props.text
      )}
    </Typography>
  );
};

export default LogoFont;
