import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { read } from './api-user.js';
import stripeButton from '../../assets/images/stripeButton.png';
import auth from '../auth/auth-helper.js';
import { DeleteUser } from './DeleteUser.js';
import { config } from '../../utils/config/config.js';
import { MyOrders } from '../../pages/order/MyOrders.js';
import { Auctions } from '../../pages/auction/Auctions.js';
import { listByBidder } from '../../pages/auction/api-auction.js';


const RootPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  marginTop: theme.spacing(5),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
  color: theme.palette.protectedTitle,
}));

const StripeButton = styled('img')({
  marginRight: '10px',
});

const StripeConnectedButton = styled(Button)({
  verticalAlign: 'super',
  marginRight: '10px',
});

const AuctionsPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: '24px',
  padding: theme.spacing(3),
  backgroundColor: '#3f3f3f0d',
}));

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();
  const [auctions, setAuctions] = useState([]);
  const { userId } = useParams(); // Use useParams hook

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByBidder(
      { userId: userId },
      { t: jwt.token },
      signal
    ).then((data) => {
      console.log('profile user',data);
      if (data.error) {
        setRedirectToSignin(true);
      } else {
        setAuctions(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [userId,jwt.token]);

  const removeAuction = (auction) => {
    const updatedAuctions = [...auctions];
    const index = updatedAuctions.indexOf(auction);
    updatedAuctions.splice(index, 1);
    setAuctions(updatedAuctions);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      { userId: userId },
      { t: jwt.token },
      signal
    ).then((data) => {
      console.log('profile user',data); // ricky has bugs - read is not being called
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    });

    // return function cleanup() {
    //   abortController.abort();
    // };
  }, [userId,jwt.token]);

  if (redirectToSignin) {
    navigate('/signin'); // Use navigate to redirect
  }

  return (
    <RootPaper elevation={4}>
      <TitleTypography variant="h6">
        Profile
      </TitleTypography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id && (
            <ListItemSecondaryAction>
              {user.seller && (
                user.stripe_seller ? (
                  <StripeConnectedButton variant="contained" disabled>
                    Stripe connected
                  </StripeConnectedButton>
                ) : (
                  <a
                    href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${config.stripe_connect_test_client_id}&scope=read_write`}
                  >
                    <StripeButton src={stripeButton} alt="Stripe Button" />
                  </a>
                )
              )}
              <Link to={`/user/edit/${user._id}`}>
                <IconButton aria-label="Edit" color="primary">
                  <EditIcon />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={`Joined: ${new Date(user.createdAt).toDateString()}`} />
        </ListItem>
      </List>
      <MyOrders />
      <AuctionsPaper elevation={4}>
        <Typography variant="h6" color="primary">
          Auctions you bid in
        </Typography>
        <Auctions auctions={auctions} removeAuction={removeAuction} />
      </AuctionsPaper>
    </RootPaper>
  );
}
