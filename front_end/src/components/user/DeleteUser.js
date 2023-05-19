import React, { useState } from 'react'
import PropTypes from 'prop-types'
import auth from './../auth/auth-helper'
import { remove } from './api-user.js'
import { useNavigate } from 'react-router-dom'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

export const DeleteUser = (props) => {

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const jwt = auth.isAuthenticated()
  const clickButton = () => {
    setOpen(true)
  }
  const deleteAccount = () => {
    remove({
      userId: props.userId
    }, { t: jwt.token }).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        auth.clearJWT(() => console.log('deleted'))
        setRedirect(true)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }

  if (redirect) {
    navigate('/');
  }
  return (<span>
    <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
      <DeleteIcon />
    </IconButton>

    <Dialog open={open} onClose={handleRequestClose}>
      <DialogTitle>{"Delete Account"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Confirm to delete your account.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRequestClose} color="primary">
          Cancel
        </Button>
        <Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </span>)

}
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
}

