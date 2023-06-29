import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { read } from './api-auction.js';
import { Link } from 'react-router-dom';
import { Timer } from './Timer';
import { Bidding } from './Bidding';
import auth from '../../components/auth/auth-helper.js';
import { config } from '../../utils/config/config.js';

const RootContainer = styled('div')({
  flexGrow: 1,
  margin: 60,
});

const FlexContainer = styled('div')({
  display: 'flex',
});

const StyledCard = styled(Card)({
  padding: '24px 40px 40px',
});

const Subheading = styled('p')({
  margin: '16px',
  color: (theme) => theme.palette.info.main,
});

const Description = styled('p')({
  margin: '16px',
  fontSize: '0.9em',
  color: '#4f4f4f',
});

const Price = styled('div')({
  padding: '16px',
  margin: '16px 0px',
  display: 'flex',
  backgroundColor: '#93c5ae3d',
  fontSize: '1.3em',
  color: '#375a53',
});

const Media = styled(CardMedia)({
  height: 300,
  display: 'inline-block',
  width: '100%',
});

const LinkText = styled(Link)({
  color: '#3e4c54b3',
  fontSize: '0.9em',
});

const ItemInfo = styled('div')({
  width: '35%',
  margin: '16px',
});

const BidSection = styled('div')({
  margin: '20px',
  minWidth: '50%',
});

const LastBid = styled('p')({
  color: '#303030',
  margin: '16px',
});

export const Auction = ({ match }) => {
  const [auction, setAuction] = useState({});
  const [error, setError] = useState('');
  const [justEnded, setJustEnded] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ auctionId: match.params.auctionId }, signal).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setAuction(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.auctionId]);

  const updateBids = (updatedAuction) => {
    setAuction(updatedAuction);
  };

  const update = () => {
    setJustEnded(true);
  };

  const imageUrl = auction._id
    ? `${config.host}/api/auctions/image/${auction._id}?${new Date().getTime()}`
    : `${config.host}/api/auctions/defaultphoto`;

  const currentDate = new Date();

  return (
    <RootContainer>
      <StyledCard>
        <CardHeader
          title={auction.itemName}
          subheader={
            <span>
              {currentDate < new Date(auction.bidStart) && 'Auction Not Started'}
              {currentDate > new Date(auction.bidStart) && currentDate < new Date(auction.bidEnd) && 'Auction Live'}
              {currentDate > new Date(auction.bidEnd) && 'Auction Ended'}
            </span>
          }
        />
        <Grid container spacing={6}>
          <Grid item xs={5} sm={5}>
            <Media image={imageUrl} title={auction.itemName} />
            <Typography component="p" variant="subtitle1" sx={Subheading}>
              About Item
            </Typography>
            <Typography component="p" sx={Description}>
              {auction.description}
            </Typography>
          </Grid>

          <Grid item xs={7} sm={7}>
            {currentDate > new Date(auction.bidStart) ? (
              <>
                <Timer endTime={auction.bidEnd} update={update} />
                {auction.bids.length > 0 && (
                  <Typography component="p" variant="subtitle1" sx={LastBid}>
                    {` Last bid: $ ${auction.bids[0].bid}`}
                  </Typography>
                )}
                {!auth.isAuthenticated() && (
                  <Typography>
                    Please, <LinkText to="/signin">sign in</LinkText> to place your bid.
                  </Typography>
                )}
                {auth.isAuthenticated() && (
                  <Bidding auction={auction} justEnded={justEnded} updateBids={updateBids} />
                )}
              </>
            ) : (
              <Typography component="p" variant="h6">{`Auction Starts at ${new Date(
                auction.bidStart
              ).toLocaleString()}`}</Typography>
            )}
          </Grid>
        </Grid>
      </StyledCard>
    </RootContainer>
  );
}
