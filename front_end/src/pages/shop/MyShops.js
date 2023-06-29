import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import { listByOwner } from './api-shop.js';
import { useNavigate } from 'react-router-dom';
import DeleteShop from './DeleteShop';
import auth from '../../components/auth/auth-helper.js';

const Root = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  marginTop: theme.spacing(5),
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
  color: theme.palette.info.main,
  fontSize: '1.2em',
}));

const AddButton = styled('span')({
  float: 'right',
});

const LeftIcon = styled('span')({
  marginRight: '8px',
});

export const MyShops = () => {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listByOwner({ userId: jwt.user._id }, { t: jwt.token }, signal).then((data) => {
      if (data.error) {
        navigate('/signin');
      } else {
        setShops(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [navigate]);

  const removeShop = (shop) => {
    const updatedShops = [...shops];
    const index = updatedShops.indexOf(shop);
    updatedShops.splice(index, 1);
    setShops(updatedShops);
  };

  return (
    <Root>
      <Paper elevation={4}>
        <Title variant="h6">
          Your Shops
          <AddButton>
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate('/seller/shop/new')}
            >
              <LeftIcon>
                <Icon>add_box</Icon>
              </LeftIcon>
              New Shop
            </Button>
          </AddButton>
        </Title>
        <List dense>
          {shops.map((shop, i) => (
            <React.Fragment key={i}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar src={`/api/shops/logo/${shop._id}?${new Date().getTime()}`} />
                </ListItemAvatar>
                <ListItemText primary={shop.name} secondary={shop.description} />
                {auth.isAuthenticated().user &&
                  auth.isAuthenticated().user._id === shop.owner._id && (
                    <ListItemSecondaryAction>
                      <Button
                        aria-label="Orders"
                        color="primary"
                        onClick={() => navigate(`/seller/orders/${shop.name}/${shop._id}`)}
                      >
                        View Orders
                      </Button>
                      <IconButton
                        aria-label="Edit"
                        color="primary"
                        onClick={() => navigate(`/seller/shop/edit/${shop._id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <DeleteShop shop={shop} onRemove={removeShop} />
                    </ListItemSecondaryAction>
                  )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Root>
  );
};
