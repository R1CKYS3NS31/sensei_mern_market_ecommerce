import React, { useState, useEffect } from 'react'
import { DeleteUser } from './DeleteUser'
import auth from './../auth/auth-helper'
import { read } from './api-user.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@mui/material'
import styled from '@emotion/styled'
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';


const root = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  marginTop: theme.spacing(5),
}));

const title = styled('h1')(({ theme }) => ({
  marginTop: theme.spacing(3),
  color: theme.palette.protectedTitle,
}));

export const Profile = () => {
  const classes = { root, title }
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  const params = useParams()

  useEffect(() => {
    // const abortController = new AbortController()
    // const signal = abortController.signal

    read({
      userId: params.userId
    }, { t: jwt.token }, 
    // signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true)
      } else {
        setUser(data)
      }
    })
  
    // return function cleanup() {
    //   abortController.abort()
    // }

  }, [params.userId, jwt.token])

  if (redirectToSignin) {
    return navigate('/signin')
  }
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} /> {
            auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id &&
            (<ListItemSecondaryAction>
              <Link to={"/user/edit/" + user._id}>
                <IconButton aria-label="Edit" color="primary">
                  <EditIcon />
                </IconButton>
              </Link>
              <DeleteUser userId={user._id} />
            </ListItemSecondaryAction>)
          }
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={"Joined: " + (
            new Date(user.createdAt)).toDateString()} />
        </ListItem>
      </List>
    </Paper>
  )
}