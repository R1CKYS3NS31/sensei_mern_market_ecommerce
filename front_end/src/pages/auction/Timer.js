import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const SubheadingTypography = styled(Typography)(({ theme }) => ({
  margin: '16px',
  color: theme.palette.info.main,
}));

const EndTimeTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.75em',
  color: '#323232',
  fontWeight: 300,
}));

const calculateTimeLeft = (date) => {
  const difference = date - new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      timeEnd: false,
    };
  } else {
    timeLeft = { timeEnd: true };
  }
  return timeLeft;
};

export const Timer = (props) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(new Date(props.endTime)));

  useEffect(() => {
    let timer = null;
    if (!timeLeft.timeEnd) {
      timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(new Date(props.endTime)));
      }, 1000);
    } else {
      props.update();
    }
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <div>
      {!timeLeft.timeEnd ? (
        <SubheadingTypography component="p" variant="h6">
          {timeLeft.days !== 0 && `${timeLeft.days} d `}
          {timeLeft.hours !== 0 && `${timeLeft.hours} h `}
          {timeLeft.minutes !== 0 && `${timeLeft.minutes} m `}
          {timeLeft.seconds !== 0 && `${timeLeft.seconds} s`} left{' '}
          <EndTimeTypography component="span">{`(ends at ${new Date(props.endTime).toLocaleString()})`}</EndTimeTypography>
        </SubheadingTypography>
      ) : (
        <SubheadingTypography component="p" variant="h6">
          Auction ended
        </SubheadingTypography>
      )}
    </div>
  );
};
