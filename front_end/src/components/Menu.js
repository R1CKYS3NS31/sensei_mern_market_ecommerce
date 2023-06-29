import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Badge } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CartIcon from '@mui/icons-material/ShoppingCart';
import auth from './auth/auth-helper';
import cart from '../pages/cart/cart-helper';


const isActive = (location, path) => {
  return location.pathname === path ? { color: '#bef67a' } : { color: '#ffffff' };
};

const isPartActive = (location, path) => {
  return location.pathname.includes(path) ? { color: '#bef67a' } : { color: '#ffffff' };
};

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" component={Link} to="/">
          MERN Marketplace
        </Typography>
        <div>
          <IconButton aria-label="Home" component={Link} to="/" style={isActive(location, '/')}>
            <HomeIcon />
          </IconButton>
          <Button component={Link} to="/shops/all" style={isActive(location, '/shops/all')}>
            All Shops
          </Button>
          <Button component={Link} to="/auctions/all" style={isActive(location, '/auctions/all')}>
            All Auctions
          </Button>
          <Button component={Link} to="/cart" style={isActive(location, '/cart')}>
            Cart
            <Badge
              invisible={false}
              color="secondary"
              badgeContent={cart.itemTotal()}
              sx={{ marginLeft: '7px' }}
            >
              <CartIcon />
            </Badge>
          </Button>
        </div>
        <div style={{ position: 'absolute', right: '10px' }}>
          <span style={{ float: 'right' }}>
            {!auth.isAuthenticated() && (
              <span>
                <Button component={Link} to="/signup" style={isActive(location, '/signup')}>
                  Sign up
                </Button>
                <Button component={Link} to="/signin" style={isActive(location, '/signin')}>
                  Sign In
                </Button>
              </span>
            )}
            {auth.isAuthenticated() && (
              <span>
                {auth.isAuthenticated().user.seller && (
                  <>
                    <Button component={Link} to="/seller/shops" style={isPartActive(location, '/seller/')}>
                      My Shops
                    </Button>
                    <Button component={Link} to="/myauctions" style={isPartActive(location, '/myauctions')}>
                      My Auctions
                    </Button>
                  </>
                )}
                <Button
                  component={Link}
                  to={`/user/${auth.isAuthenticated().user._id}`}
                  style={isActive(location, `/user/${auth.isAuthenticated().user._id}`)}
                >
                  My Profile
                </Button>
                <Button
                  color="inherit"
                  onClick={() => {
                    auth.clearJWT(() => {
                      navigate('/');
                    });
                  }}
                >
                  Sign out
                </Button>
              </span>
            )}
          </span>
        </div>
      </Toolbar>
    </AppBar>
 
 );
};

export default Menu;