import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { listOpen } from './api-auction.js';
import { Auctions } from './Auctions.js';
import { useNavigate } from 'react-router-dom';

const RootPaper = styled(Paper)(({ theme }) => ({
  ...theme.mixins.gutters(),
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  marginTop: theme.spacing(5),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(1)}px 0 4px ${theme.spacing(1)}px`,
  color: theme.palette.secondary.main,
  fontSize: '1.2em',
}));

export const OpenAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listOpen(signal).then((data) => {
      if (data.error) {
        navigate('/signin');
      } else {
        setAuctions(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [navigate]);

  const removeAuction = (auction) => {
    const updatedAuctions = [...auctions];
    const index = updatedAuctions.indexOf(auction);
    updatedAuctions.splice(index, 1);
    setAuctions(updatedAuctions);
  };

  return (
    <div>
      <RootPaper elevation={4}>
        <TitleTypography variant="h6">
          All Auctions
        </TitleTypography>
        <Auctions auctions={auctions} removeAuction={removeAuction} />
      </RootPaper>
    </div>
  );
}
