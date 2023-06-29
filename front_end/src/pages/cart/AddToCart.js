import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import AddCartIcon from '@mui/icons-material/AddShoppingCart';
import DisabledCartIcon from '@mui/icons-material/RemoveShoppingCart';
import cart from './cart-helper.js';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const IconContainer = styled('div')(({ theme }) => ({
  width: '28px',
  height: '28px',
  color: theme.palette.secondary.main,
}));

const DisabledIconContainer = styled('div')(({ theme }) => ({
  width: '28px',
  height: '28px',
  color: '#7f7563',
}));

export const AddToCart = (props) => {
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);

  const addToCart = () => {
    cart.addItem(props.item, () => {
      setRedirect(true);
    });
  };

  if (redirect) {
    navigate('/cart');
  }

  return (
    <span>
      {props.item.quantity >= 0 ? (
        <IconButton color="secondary" onClick={addToCart}>
          <IconContainer>
            <AddCartIcon />
          </IconContainer>
        </IconButton>
      ) : (
        <IconButton disabled={true} color="secondary">
          <DisabledIconContainer>
            <DisabledCartIcon />
          </DisabledIconContainer>
        </IconButton>
      )}
    </span>
  );
};

AddToCart.propTypes = {
  item: PropTypes.object.isRequired,
  cartStyle: PropTypes.string,
};
