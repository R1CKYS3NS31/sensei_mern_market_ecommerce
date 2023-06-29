import React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Divider from '@mui/material/Divider';
import DeleteAuction from './DeleteAuction';
import { Link } from 'react-router-dom';
import auth from '../../components/auth/auth-helper';

const calculateTimeLeft = (date) => {
  const difference = date - new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      timeEnd: false
    };
  } else {
    timeLeft = { timeEnd: true };
  }
  return timeLeft;
};

export const Auctions = (props) => {
  const currentDate = new Date();
  const showTimeLeft = (date) => {
    let timeLeft = calculateTimeLeft(date);
    return !timeLeft.timeEnd && (
      <span>
        {timeLeft.days !== 0 && `${timeLeft.days} d `}
        {timeLeft.hours !== 0 && `${timeLeft.hours} h `}
        {timeLeft.minutes !== 0 && `${timeLeft.minutes} m `}
        {timeLeft.seconds !== 0 && `${timeLeft.seconds} s`} left
      </span>
    );
  };
  const auctionState = (auction) => {
    return (
      <span>
        {currentDate < new Date(auction.bidStart) && `Auction Starts at ${new Date(auction.bidStart).toLocaleString()}`}
        {currentDate > new Date(auction.bidStart) && currentDate < new Date(auction.bidEnd) && (
          <>
            {`Auction is live | ${auction.bids.length} bids | `} {showTimeLeft(new Date(auction.bidEnd))}
          </>
        )}
        {currentDate > new Date(auction.bidEnd) && `Auction Ended | ${auction.bids.length} bids `}
        {currentDate > new Date(auction.bidStart) && auction.bids.length > 0 && ` | Last bid: $ ${auction.bids[0].bid}`}
      </span>
    );
  };
  return (
    <List dense>
      {props.auctions.map((auction, i) => (
        <span key={i}>
          <ListItem button>
            <ListItemAvatar>
              <Avatar variant="square" src={`/api/auctions/image/${auction._id}?${new Date().getTime()}`} />
            </ListItemAvatar>
            <ListItemText primary={auction.itemName} secondary={auctionState(auction)} />
            <ListItemSecondaryAction>
              <Link to={`/auction/${auction._id}`}>
                <IconButton aria-label="View" color="primary">
                  <VisibilityIcon />
                </IconButton>
              </Link>
              {auth.isAuthenticated().user && auth.isAuthenticated().user._id === auction.seller._id && (
                <>
                  <Link to={`/auction/edit/${auction._id}`}>
                    <IconButton aria-label="Edit" color="primary">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <DeleteAuction auction={auction} onRemove={props.removeAuction} />
                </>
              )}
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </span>
      ))}
    </List>
  );
}

Auctions.propTypes = {
  auctions: PropTypes.array.isRequired,
  removeAuction: PropTypes.func.isRequired
};
