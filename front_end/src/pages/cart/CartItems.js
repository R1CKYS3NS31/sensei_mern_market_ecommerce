import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import cart from './cart-helper.js';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import auth from '../../components/auth/auth-helper.js';


const CardContainer = styled(Card)(({ theme }) => ({
  margin: '24px 0px',
  padding: '16px 40px 60px 40px',
  backgroundColor: '#80808017',
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
  color: theme.palette.openTitle,
  fontSize: '1.2em',
}));

const Price = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: 'inline',
}));

const TextFieldInput = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  marginTop: 0,
  width: 50,
}));

const ProductTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.15em',
  marginBottom: '5px',
}));

const Subheading = styled(Typography)(({ theme }) => ({
  color: 'rgba(88, 114, 128, 0.67)',
  padding: '8px 10px 0',
  cursor: 'pointer',
  display: 'inline-block',
}));

const Cart = styled(Card)(({ theme }) => ({
  width: '100%',
  display: 'inline-flex',
}));

const Details = styled('div')(({ theme }) => ({
  display: 'inline-block',
  width: '100%',
  padding: '4px',
}));

const Content = styled(CardContent)(({ theme }) => ({
  flex: '1 0 auto',
  padding: '16px 8px 0px',
}));

const Cover = styled(CardMedia)(({ theme }) => ({
  width: 160,
  height: 125,
  margin: '8px',
}));

const ItemTotal = styled(Typography)(({ theme }) => ({
  float: 'right',
  marginRight: '40px',
  fontSize: '1.5em',
  color: 'rgb(72, 175, 148)',
}));

const Checkout = styled('div')(({ theme }) => ({
  float: 'right',
  margin: '24px',
}));

const Total = styled(Typography)(({ theme }) => ({
  fontSize: '1.2em',
  color: 'rgb(53, 97, 85)',
  marginRight: '16px',
  fontWeight: '600',
  verticalAlign: 'bottom',
}));

const ContinueBtn = styled(Button)(({ theme }) => ({
  marginLeft: '10px',
}));

const ItemShop = styled('span')(({ theme }) => ({
  display: 'block',
  fontSize: '0.90em',
  color: '#78948f',
}));

const RemoveButton = styled(Button)(({ theme }) => ({
  fontSize: '0.8em',
}));

export const CartItems = (props) => {
  const [cartItems, setCartItems] = useState(cart.getCart());

  const handleChange = (index) => (event) => {
    let updatedCartItems = cartItems;
    if (event.target.value === 0) {
      updatedCartItems[index].quantity = 1;
    } else {
      updatedCartItems[index].quantity = event.target.value;
    }
    setCartItems([...updatedCartItems]);
    cart.updateCart(index, event.target.value);
  };

  const getTotal = () => {
    return cartItems.reduce((a, b) => {
      return a + b.quantity * b.product.price;
    }, 0);
  };

  const removeItem = (index) => (event) => {
    let updatedCartItems = cart.removeItem(index);
    if (updatedCartItems.length === 0) {
      props.setCheckout(false);
    }
    setCartItems(updatedCartItems);
  };

  const openCheckout = () => {
    props.setCheckout(true);
  };

  return (
    <CardContainer>
      <Title variant="title">Shopping Cart</Title>
      {cartItems.length > 0 ? (
        <span>
          {cartItems.map((item, i) => (
            <span key={i}>
              <Cart>
                <Cover image={'/api/product/image/' + item.product._id} title={item.product.name} />
                <Details>
                  <Content>
                    <Link to={'/product/' + item.product._id}>
                      <ProductTitle variant="title" component="h3" color="primary">
                        {item.product.name}
                      </ProductTitle>
                    </Link>
                    <div>
                      <Typography variant="subheading" component="h3" color="primary">
                        <Price color="primary">$ {item.product.price}</Price>
                      </Typography>
                      <ItemTotal>${item.product.price * item.quantity}</ItemTotal>
                      <ItemShop>Shop: {item.product.shop.name}</ItemShop>
                    </div>
                  </Content>
                  <div>
                    <Subheading>
                      Quantity:
                      <TextFieldInput
                        value={item.quantity}
                        onChange={handleChange(i)}
                        type="number"
                        inputProps={{
                          min: 1,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                      />
                      <RemoveButton color="primary" onClick={removeItem(i)}>
                        x Remove
                      </RemoveButton>
                    </Subheading>
                  </div>
                </Details>
              </Cart>
              <Divider />
            </span>
          ))}
          <Checkout>
            <Total>Total: ${getTotal()}</Total>
            {!props.checkout && (auth.isAuthenticated() ? (
              <Button color="secondary" variant="contained" onClick={openCheckout}>
                Checkout
              </Button>
            ) : (
              <Link to="/signin">
                <Button color="primary" variant="contained">
                  Sign in to checkout
                </Button>
              </Link>
            ))}
            <Link to="/" className={ContinueBtn}>
              <Button variant="contained">Continue Shopping</Button>
            </Link>
          </Checkout>
        </span>
      ) : (
        <Typography variant="subtitle1" component="h3" color="primary">
          No items added to your cart.
        </Typography>
      )}
    </CardContainer>
  );
};

CartItems.propTypes = {
  checkout: PropTypes.bool.isRequired,
  setCheckout: PropTypes.func.isRequired,
};
