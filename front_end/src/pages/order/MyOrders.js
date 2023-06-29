import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { listByUser } from './api-order.js';
import { Link } from 'react-router-dom';
import auth from '../../components/auth/auth-helper.js';

const RootPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: '12px 24px',
  padding: theme.spacing(3),
  backgroundColor: '#3f3f3f0d',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(2)}px 0 12px ${theme.spacing(1)}px`,
  color: theme.palette.openTitle,
}));

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listByUser(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <RootPaper elevation={4}>
      <TitleTypography variant="h6">
        Your Orders
      </TitleTypography>
      <List dense>
        {orders.map((order, i) => (
          <span key={i}>
            <Link to={`/order/${order._id}`}>
              <ListItem button>
                <ListItemText
                  primary={<strong>{`Order # ${order._id}`}</strong>}
                  secondary={(new Date(order.created)).toDateString()}
                />
              </ListItem>
            </Link>
            <Divider />
          </span>
        ))}
      </List>
    </RootPaper>
  );
}
