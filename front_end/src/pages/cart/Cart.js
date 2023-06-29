import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { styled } from '@mui/material/styles';
import { Checkout } from './Checkout';
import { CartItems } from './CartItems';
import { config } from '../../utils/config/config';

const stripePromise = loadStripe(config.stripe_test_api_key);

const RootContainer = styled('div')({
  flexGrow: 1,
  margin: 30,
});

export const Cart = () => {
  const [checkout, setCheckout] = useState(false);

  const showCheckout = (val) => {
    setCheckout(val);
  };

  return (
    <RootContainer>
      <Grid container spacing={8}>
        <Grid item xs={6} sm={6}>
          <CartItems checkout={checkout} setCheckout={showCheckout} />
        </Grid>
        {checkout && (
          <Grid item xs={6} sm={6}>
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          </Grid>
        )}
      </Grid>
    </RootContainer>
  );
};