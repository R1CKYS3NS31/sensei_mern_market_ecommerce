import React, { useState } from 'react'
import auth from './../auth/auth-helper'
import { useNavigate } from 'react-router-dom'
import { signin } from './api-auth.js'
import { Button, Card, CardActions, CardContent, Icon, TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';


const card = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  marginTop: theme.spacing(5),
  paddingBottom: theme.spacing(2),
}));

const title = styled('h2')(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.openTitle,
}));

const error = styled('span')({
  verticalAlign: 'middle',
});

const textField = styled('input')(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: 300,                  
}));

const submit = styled('button')(({ theme }) => ({
  margin: 'auto',
  marginBottom: theme.spacing(2),
}));

export const Signin = (props) => {
  const classes = {card,title,error,textField,submit}
  const navigate = useNavigate()
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    redirectToReferrer: false
  })

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '', redirectToReferrer: true })
        })
      }
    })
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  // const { from } = props.location.state || {
  //   from: {
  //     pathname: '/'
  //   }
  // }
  const { redirectToReferrer } = values
  if (redirectToReferrer) {
    navigate('/');
    return null;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Sign In
        </Typography>
        <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal" /><br />
        <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal" />
        <br /> {
          values.error && (<Typography component="p" color="error">
            <Icon color="error" className={classes.error}>error</Icon>
            {values.error}
          </Typography>)
        }
      </CardContent>
      <CardActions>
        <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
      </CardActions>
    </Card>
  )
}
