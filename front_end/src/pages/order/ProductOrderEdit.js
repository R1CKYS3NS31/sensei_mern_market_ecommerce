import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { getStatusValues, update, cancelProduct, processCharge } from './api-order.js';
import auth from '../../components/auth/auth-helper.js';

const NestedListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingBottom: 0,
}));

const ListImg = styled('img')({
  width: '70px',
  verticalAlign: 'top',
  marginRight: '10px',
});

const ListDetails = styled('div')({
  display: 'inline-block',
});

const ListQty = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: '0.9em',
  color: theme.palette.text.secondary,
}));

const TextFieldWrapper = styled(TextField)({
  width: '160px',
  marginRight: '16px',
});

const StatusMessage = styled(Typography)({
  position: 'absolute',
  zIndex: '12',
  right: '5px',
  padding: '5px',
});

export const ProductOrderEdit = (props) => {
  const [values, setValues] = useState({
    open: 0,
    statusValues: [],
    error: '',
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getStatusValues(signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: 'Could not get status' });
      } else {
        setValues({ ...values, statusValues: data, error: '' });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleStatusChange = (productIndex) => (event) => {
    let order = props.order;
    order.products[productIndex].status = event.target.value;
    let product = order.products[productIndex];

    if (event.target.value === 'Cancelled') {
      cancelProduct(
        {
          shopId: props.shopId,
          productId: product.product._id,
        },
        {
          t: jwt.token,
        },
        {
          cartItemId: product._id,
          status: event.target.value,
          quantity: product.quantity,
        }
      ).then((data) => {
        if (data.error) {
          setValues({
            ...values,
            error: 'Status not updated, try again',
          });
        } else {
          props.updateOrders(props.orderIndex, order);
          setValues({
            ...values,
            error: '',
          });
        }
      });
    } else if (event.target.value === 'Processing') {
      processCharge(
        {
          userId: jwt.user._id,
          shopId: props.shopId,
          orderId: order._id,
        },
        {
          t: jwt.token,
        },
        {
          cartItemId: product._id,
          status: event.target.value,
          amount: product.quantity * product.product.price,
        }
      ).then((data) => {
        if (data.error) {
          setValues({
            ...values,
            error: 'Status not updated, try again',
          });
        } else {
          props.updateOrders(props.orderIndex, order);
          setValues({
            ...values,
            error: '',
          });
        }
      });
    } else {
      update(
        {
          shopId: props.shopId,
        },
        {
          t: jwt.token,
        },
        {
          cartItemId: product._id,
          status: event.target.value,
        }
      ).then((data) => {
        if (data.error) {
          setValues({
            ...values,
            error: 'Status not updated, try again',
          });
        } else {
          props.updateOrders(props.orderIndex, order);
          setValues({
            ...values,
            error: '',
          });
        }
      });
    }
  };

  return (
    <div>
      <StatusMessage component="span" color="error">
        {values.error}
      </StatusMessage>
      <List disablePadding style={{ backgroundColor: '#f8f8f8' }}>
        {props.order.products.map((item, index) => {
          return (
            <span key={index}>
              {item.shop === props.shopId && (
                <NestedListItem button>
                  <ListItemText
                    primary={
                      <div>
                        <ListImg src={'/api/product/image/' + item.product._id} />
                        <ListDetails>
                          {item.product.name}
                          <ListQty>{'Quantity: ' + item.quantity}</ListQty>
                        </ListDetails>
                      </div>
                    }
                  />
                  <TextFieldWrapper
                    id="select-status"
                    select
                    label="Update Status"
                    value={item.status}
                    onChange={handleStatusChange(index)}
                    margin="normal"
                  >
                    {values.statusValues.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextFieldWrapper>
                </NestedListItem>
              )}
              <Divider style={{ margin: 'auto', width: '80%' }} />
            </span>
          );
        })}
      </List>
    </div>
  );
};

ProductOrderEdit.propTypes = {
  shopId: PropTypes.string.isRequired,
  order: PropTypes.object.isRequired,
  orderIndex: PropTypes.number.isRequired,
  updateOrders: PropTypes.func.isRequired,
};
