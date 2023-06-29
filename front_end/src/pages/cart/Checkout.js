import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import PlaceOrder from './PlaceOrder';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { styled } from '@mui/material/styles';
import auth from '../../components/auth/auth-helper.js';
import cart from './cart-helper';

const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');

const CheckoutCard = styled(Card)(({ theme }) => ({
  margin: '24px 0px',
  padding: '16px 40px 90px 40px',
  backgroundColor: '#80808017',
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: '24px 16px 8px 0px',
  color: theme.palette.openTitle,
}));

const Subheading = styled(Typography)(({ theme }) => ({
  color: 'rgba(88, 114, 128, 0.87)',
  marginTop: '20px',
}));

const AddressField = styled(TextField)(({ theme }) => ({
  marginTop: '4px',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: '45%',
}));

const StreetField = styled(TextField)(({ theme }) => ({
  marginTop: '4px',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: '93%',
}));

const TextFieldWrapper = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: '90%',
}));

export const Checkout = () => {
  const user = auth.isAuthenticated().user;
  const [values, setValues] = useState({
    checkoutDetails: {
      products: cart.getCart(),
      customer_name: user.name,
      customer_email: user.email,
      delivery_address: { street: '', city: '', state: '', zipcode: '', country: '' },
    },
    error: '',
  });

  const handleCustomerChange = (name) => (event) => {
    let checkoutDetails = values.checkoutDetails;
    checkoutDetails[name] = event.target.value || undefined;
    setValues({ ...values, checkoutDetails: checkoutDetails });
  };

  const handleAddressChange = (name) => (event) => {
    let checkoutDetails = values.checkoutDetails;
    checkoutDetails.delivery_address[name] = event.target.value || undefined;
    setValues({ ...values, checkoutDetails: checkoutDetails });
  };

  return (
    <CheckoutCard>
      <Title variant="title">
        Checkout
      </Title>
      <TextFieldWrapper
        id="name"
        label="Name"
        value={values.checkoutDetails.customer_name}
        onChange={handleCustomerChange('customer_name')}
        margin="normal"
      />
      <br />
      <TextFieldWrapper
        id="email"
        type="email"
        label="Email"
        value={values.checkoutDetails.customer_email}
        onChange={handleCustomerChange('customer_email')}
        margin="normal"
      />
      <br />
      <Subheading variant="subheading" component="h3">
        Delivery Address
      </Subheading>
      <StreetField
        id="street"
        label="Street Address"
        value={values.checkoutDetails.delivery_address.street}
        onChange={handleAddressChange('street')}
        margin="normal"
      />
      <br />
      <AddressField
        id="city"
        label="City"
        value={values.checkoutDetails.delivery_address.city}
        onChange={handleAddressChange('city')}
        margin="normal"
      />
      <AddressField
        id="state"
        label="State"
        value={values.checkoutDetails.delivery_address.state}
        onChange={handleAddressChange('state')}
        margin="normal"
      />
      <br />
      <AddressField
        id="zipcode"
        label="Zip Code"
        value={values.checkoutDetails.delivery_address.zipcode}
        onChange={handleAddressChange('zipcode')}
        margin="normal"
      />
      <AddressField
        id="country"
        label="Country"
        value={values.checkoutDetails.delivery_address.country}
        onChange={handleAddressChange('country')}
        margin="normal"
      />
      <br />
      {values.error && (
        <Typography component="p" color="error">
          <Icon color="error">
            error
          </Icon>
          {values.error}
        </Typography>
      )}
      <div>
        <Elements stripe={stripePromise}>
          <PlaceOrder checkoutDetails={values.checkoutDetails} />
        </Elements>
      </div>
    </CheckoutCard>
  );
};
