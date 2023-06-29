import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import cart from './cart-helper.js';
import { CardElement, useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { create } from '../product/api-product';
import auth from '../../components/auth/auth-helper.js';


const Subheading = styled(Typography)(({ theme }) => ({
  color: 'rgba(88, 114, 128, 0.87)',
  marginTop: '20px',
}));

const Checkout = styled('div')(({ theme }) => ({
  float: 'right',
  margin: '20px 30px',
}));

const Error = styled('span')(({ theme }) => ({
  display: 'inline',
  padding: '0px 10px',
}));

const ErrorIcon = styled(Icon)(({ theme }) => ({
  verticalAlign: 'middle',
}));

const StripeElement = styled(CardElement)(({ theme }) => ({
  display: 'block',
  margin: '24px 0 10px 10px',
  maxWidth: '408px',
  padding: '10px 14px',
  boxShadow: 'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
  borderRadius: '4px',
  background: 'white',
}));

export const PlaceOrder = ({ checkoutDetails }) => {
  const [values, setValues] = useState({
    order: {},
    error: '',
    redirect: false,
    orderId: '',
  });
  const stripe = useStripe();
  const navigate = useNavigate();

  const placeOrder = async () => {
    const payload = await stripe.createToken();
    if (payload.error) {
      setValues({ ...values, error: payload.error.message });
    } else {
      const jwt = auth.isAuthenticated();
      create({ userId: jwt.user._id }, { t: jwt.token }, checkoutDetails, payload.token.id).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          cart.emptyCart(() => {
            setValues({ ...values, orderId: data._id, redirect: true });
            navigate('/order/' + data._id);
          });
        }
      });
    }
  };

  return (
    <span>
      <Subheading type="subheading" component="h3">
        Card details
      </Subheading>
      <StripeElement
        options={{
          style: {
            base: {
              color: '#424770',
              letterSpacing: '0.025em',
              fontFamily: 'Source Code Pro, Menlo, monospace',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <Checkout>
        {values.error && (
          <Error component="span" color="error">
            <ErrorIcon color="error">error</ErrorIcon>
            {values.error}
          </Error>
        )}
        <Button color="secondary" variant="contained" onClick={placeOrder}>
          Place Order
        </Button>
      </Checkout>
    </span>
  );
};

PlaceOrder.propTypes = {
  checkoutDetails: PropTypes.object.isRequired,
};

export default PlaceOrder;
