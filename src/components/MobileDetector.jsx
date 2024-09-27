import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { setMobile } from '../actions/actions';

const MobileDetector = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    dispatch(setMobile(isMobile));
  }, [isMobile, dispatch]);

  return null;
};

export default MobileDetector;
