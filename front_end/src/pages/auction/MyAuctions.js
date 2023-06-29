import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { listBySeller } from './api-auction.js';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../../components/auth/auth-helper.js';
import { Auctions } from './Auctions.js';

const RootPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  marginTop: theme.spacing(5),
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
  color: theme.palette.info.main,
  fontSize: '1.2em',
}));

const AddButton = styled(Button)(({ theme }) => ({
  float: 'right',
}));

const LeftIcon = styled(Icon)(({ theme }) => ({
  marginRight: '8px',
}));

export const MyAuctions= () =>{
  const [auctions, setAuctions] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listBySeller({ userId: jwt.user._id }, { t: jwt.token }, signal).then((data) => {
      if (data.error) {
        setRedirectToSignin(true);
      } else {
        setAuctions(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const removeAuction = (auction) => {
    const updatedAuctions = [...auctions];
    const index = updatedAuctions.indexOf(auction);
    updatedAuctions.splice(index, 1);
    setAuctions(updatedAuctions);
  };

  if (redirectToSignin) {
    navigate('/signin');
    return null;
  }

  return (
    <div>
      <RootPaper elevation={4}>
        <Title variant="title">
          Your Auctions
          <AddButton
            component={Link}
            to="/auction/new"
            color="primary"
            variant="contained"
          >
            <LeftIcon>add_box</LeftIcon> New Auction
          </AddButton>
        </Title>
        <Auctions auctions={auctions} removeAuction={removeAuction} />
      </RootPaper>
    </div>
  );
}
