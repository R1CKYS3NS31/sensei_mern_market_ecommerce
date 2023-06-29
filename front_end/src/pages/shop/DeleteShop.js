import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { remove } from './api-shop';
import auth from '../../components/auth/auth-helper';

export default function DeleteShop(props) {
  const [open, setOpen] = useState(false);

  const jwt = auth.isAuthenticated();

  const clickButton = () => {
    setOpen(true);
  };

  const deleteShop = () => {
    remove(
      {
        shopId: props.shop._id
      },
      { t: jwt.token }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOpen(false);
        props.onRemove(props.shop);
      }
    });
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete " + props.shop.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your shop {props.shop.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteShop} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}

DeleteShop.propTypes = {
  shop: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};
