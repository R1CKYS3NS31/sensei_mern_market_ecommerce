import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import { listByShop } from './api-order.js';
import { ProductOrderEdit } from './ProductOrderEdit';
import auth from '../../components/auth/auth-helper.js';

const RootPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  marginTop: theme.spacing(5),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
  color: theme.palette.info.main,
  fontSize: '1.2em',
}));

const SubheadingTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: '#434b4e',
  fontSize: '1.1em',
}));

const CustomerDetailsContainer = styled('div')({
  paddingLeft: '36px',
  paddingTop: '16px',
  backgroundColor: '#f8f8f8',
});

export const ShopOrders = ({ match }) => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(0);

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listByShop({ shopId: match.params.shopId }, { t: jwt.token }, signal).then((data) => {
      if (data.error) {
        console.log(data);
      } else {
        setOrders(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleClick = (index) => () => {
    setOpen(index);
  };

  const updateOrders = (index, updatedOrder) => {
    let updatedOrders = [...orders];
    updatedOrders[index] = updatedOrder;
    setOrders(updatedOrders);
  };

  return (
    <div>
      <RootPaper elevation={4}>
        <TitleTypography variant="h6">
          Orders in {match.params.shop}
        </TitleTypography>
        <List dense>
          {orders.map((order, index) => (
            <span key={index}>
              <ListItem button onClick={handleClick(index)}>
                <ListItemText primary={`Order # ${order._id}`} secondary={(new Date(order.created)).toDateString()} />
                {open === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Divider />
              <Collapse in={open === index} timeout="auto" unmountOnExit>
                <ProductOrderEdit shopId={match.params.shopId} order={order} orderIndex={index} updateOrders={updateOrders} />
                <CustomerDetailsContainer>
                  <SubheadingTypography component="h3" variant="subtitle1">
                    Deliver to:
                  </SubheadingTypography>
                  <Typography component="h3" variant="subtitle1" color="primary">
                    <strong>{order.customer_name}</strong> ({order.customer_email})
                  </Typography>
                  <Typography component="h3" variant="subtitle1" color="primary">
                    {order.delivery_address.street}
                  </Typography>
                  <Typography component="h3" variant="subtitle1" color="primary">
                    {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.zipcode}
                  </Typography>
                  <Typography component="h3" variant="subtitle1" color="primary">
                    {order.delivery_address.country}
                  </Typography>
                  <br />
                </CustomerDetailsContainer>
              </Collapse>
              <Divider />
            </span>
          ))}
        </List>
      </RootPaper>
    </div>
  );
}
