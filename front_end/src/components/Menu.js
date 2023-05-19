import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import auth from './auth/auth-helper'
import { useNavigate } from 'react-router-dom'

const isActive = (location, path) => {
  if (location.pathname === path) {
    return { color: '#ff4081' }
  } else {
    return { color: '#ffffff' }
  }
}
const Menu = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          MERN Skeleton
        </Typography>
        <Link to='/'>
          <IconButton aria-label='Home' style={isActive(navigate, '/')}>
            <HomeIcon />
          </IconButton>
        </Link>
        <Link to='/users'>
          <Button style={isActive(navigate, '/users')}>Users</Button>
        </Link>
        {!auth.isAuthenticated() && (
          <span>
            <Link to='/signup'>
              <Button style={isActive(navigate, '/signup')}>Sign up</Button>
            </Link>
            <Link to='/signin'>
              <Button style={isActive(navigate, '/signin')}>Sign In</Button>
            </Link>
          </span>
        )}
        {auth.isAuthenticated() && (
          <span>
            <Link to={'/user/' + auth.isAuthenticated().user._id}>
              <Button style={isActive(navigate, '/user/' + auth.isAuthenticated().user._id)}>My Profile</Button>
            </Link>
            <Button
              color='inherit'
              onClick={() => {
                auth.clearJWT(() => navigate('/'))
              }}
            >
              Sign out
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Menu
