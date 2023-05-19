import React, { useState } from 'react'
import { create } from './api-user.js'
import { Link } from 'react-router-dom'
import { Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, TextField, Typography } from '@mui/material'
import styled from '@emotion/styled';

const card = styled('div')({
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  marginTop: theme => theme.spacing(5),
  paddingBottom: theme => theme.spacing(2)
});

const error = styled('span')({
  verticalAlign: 'middle'
});

const title = styled('h2')({
  marginTop: theme => theme.spacing(2),
  color: theme => theme.palette.openTitle
});

const textField = styled('input')({
  marginLeft: theme => theme.spacing(1),
  marginRight: theme => theme.spacing(1),
  width: 300
});

const submitButton = styled('button')({
  margin: 'auto',
  marginBottom: theme => theme.spacing(2)
});

export const Signup = () => {

  const classes = { card, error, title, textField, submitButton }

  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: ''
  })

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    }
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, error: '', open: true })
      }
    })
  }

  return (<div>
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Sign Up
        </Typography>
        <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal" /><br />
        <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal" /><br />
        <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal" />
        <br /> {
          values.error && (<Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
            {values.error}</Typography>)
        }
      </CardContent>
      <CardActions>
        <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
      </CardActions>
    </Card>
    <Dialog open={values.open} disableBackdropClick={true}>
      <DialogTitle>New Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          New account successfully created.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Link to="/signin">
          <Button color="primary" autoFocus="autoFocus" variant="contained">
            Sign In
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  </div>
  )
}