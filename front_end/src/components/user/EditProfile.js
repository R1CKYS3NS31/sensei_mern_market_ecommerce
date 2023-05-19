import React, { useState, useEffect } from 'react'
import auth from './../auth/auth-helper'
import { read, update } from './api-user.js'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Button, Card, CardActions, CardContent, Icon, TextField, Typography } from '@mui/material'

const cardContainer = styled('div')({
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  marginTop: theme => theme.spacing(5),
  paddingBottom: theme => theme.spacing(2)
});

const title = styled('h2')({
  margin: theme => theme.spacing(2),
  color: theme => theme.palette.protectedTitle
});

const errorIcon = styled('svg')({
  verticalAlign: 'middle'
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


export const EditProfile = ({ match }) => {
  const classes = { cardContainer, title, errorIcon, textField, submitButton }

  const navigate = useNavigate()
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: '',
    redirectToProfile: false
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, name: data.name, email: data.email })
      }
    })
    return function cleanup() {
      abortController.abort()
    }

  }, [match.params.userId, jwt.token, values])

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    }
    update({
      userId: match.params.userId
    }, {
      t: jwt.token
    }, user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, userId: data._id, redirectToProfile: true })
      }
    })
  }
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }


if (values.redirectToProfile) {
  navigate(`/user/${values.userId}`);
}

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal" /><br />
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

