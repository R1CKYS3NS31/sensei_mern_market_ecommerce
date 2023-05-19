import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { list } from './api-user.js'
import styled from '@emotion/styled'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const root = styled('div')(({ theme }) => ({
  ...theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5)
  })
}));

const title = styled('h1')(({ theme }) => ({
  margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
  color: theme.palette.openTitle
}));

export const Users = () => {
  const classes = { root, title }
  const [users, setUsers] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    // const signal = abortController.signal

    list(
      // signal
      ).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])


  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        All Users
      </Typography>
      <List dense>
        {users.map((item, i) => {
          return <Link to={"/user/" + item._id} key={i}>
            <ListItem button>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction>
                <IconButton>
                  <ArrowForwardIosIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Link>
        })
        }
      </List>
    </Paper>
  )
}
