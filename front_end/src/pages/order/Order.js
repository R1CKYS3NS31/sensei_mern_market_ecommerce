import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/system';
import { read } from './api-order.js';
import { Link } from 'react-router-dom';

const CardWrapper = styled(Card)({
  textAlign: 'center',
  paddingTop: '8px',
  paddingBottom: '16px',
  flexGrow: 1,
  margin: '30px',
});

const InnerCardItems = styled(Card)({
  textAlign: 'left',
  margin: '24px 10px 24px 24px',
  padding: '24px 20px 40px 20px',
  backgroundColor: '#80808017',
});

const InnerCard = styled(Card)({
  textAlign: 'left',
  margin: '24px 24px 24px 10px',
  padding: '30px 45px 40px 45px',
  backgroundColor: '#80808017',
});

const CardMediaCover = styled(CardMedia)({
  width: 160,
  height: 125,
  margin: '8px',
});

export const Order = ({ match }) => {
  const [order, setOrder] = useState({ products: [], delivery_address: {} });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({
      orderId: match.params.orderId,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrder(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const getTotal = () => {
    return order.products.reduce((a, b) => {
      const quantity = b.status === 'Cancelled' ? 0 : b.quantity;
      return a + quantity * b.product.price;
    }, 0);
  };

  return (
    <CardWrapper>
      <Typography variant="h5" component="h2">
        Order Details
      </Typography>
      <Typography variant="subtitle1" component="h2">
        Order Code: <strong>{order._id}</strong> <br /> Placed on{' '}
        {new Date(order.created).toDateString()}
      </Typography>
      <br />
      <Grid container spacing={4}>
        <Grid item xs={7} sm={7}>
          <InnerCardItems>
            {order.products.map((item, i) => (
              <span key={i}>
                <Card>
                  <CardMediaCover
                    image={'/api/product/image/' + item.product._id}
                    title={item.product.name}
                  />
                  <div>
                    <CardContent>
                      <Link to={'/product/' + item.product._id}>
                        <Typography variant="h6" color="primary">
                          {item.product.name}
                        </Typography>
                      </Link>
                      <Typography variant="subtitle1" color="primary">
                        $ {item.product.price} x {item.quantity}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${item.product.price * item.quantity}
                      </Typography>
                      <Typography variant="subtitle1" color={item.status === 'Cancelled' ? 'error' : 'secondary'}>
                        Status: {item.status}
                      </Typography>
                    </CardContent>
                  </div>
                </Card>
                <Divider />
              </span>
            ))}
            <div>
              <Typography variant="subtitle1" component="h2" style={{ float: 'right', marginRight: '24px' }}>
                Total: ${getTotal()}
              </Typography>
            </div>
          </InnerCardItems>
        </Grid>
        <Grid item xs={5} sm={5}>
          <InnerCard>
            <Typography variant="h6" component="h2" color="primary">
              Deliver to:
            </Typography>
            <Typography variant="subtitle1" className="info" color="primary">
              <strong>{order.customer_name}</strong>
            </Typography>
            <br />
            <Typography variant="subtitle1" className="info" color="primary">
              {order.customer_email}
            </Typography>
            <br />
            <br />
            <Divider />
            <br />
            <Typography variant="subtitle1" className="itemShop" color="primary">
              {order.delivery_address.street}
            </Typography>
            <Typography variant="subtitle1" className="itemShop" color="primary">
              {order.delivery_address.city}, {order.delivery_address.state}{' '}
              {order.delivery_address.zipcode}
            </Typography>
            <Typography variant="subtitle1" className="itemShop" color="primary">
              {order.delivery_address.country}
            </Typography>
            <br />
            <Typography variant="subtitle1" className="thanks" color="primary">
              Thank you for shopping with us! <br />
              You can track the status of your purchased items on this page.
            </Typography>
          </InnerCard>
        </Grid>
      </Grid>
    </CardWrapper>
  );
};
