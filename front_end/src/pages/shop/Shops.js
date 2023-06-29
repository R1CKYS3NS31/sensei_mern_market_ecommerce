import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { list } from './api-shop.js';
import { Link } from 'react-router-dom';

const RootPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(3),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
  color: theme.palette.info.main,
  textAlign: 'center',
  fontSize: '1.2em',
}));

const AvatarImage = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
}));

const SubheadingTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const ShopTitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.2em',
  marginBottom: '5px',
}));

const DetailsDiv = styled('div')(({ theme }) => ({
  padding: '24px',
}));

export default function Shops() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    list(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setShops(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <RootPaper elevation={4}>
        <TitleTypography variant="h6" component="h1">
          All Shops
        </TitleTypography>
        <List dense>
          {shops.map((shop, i) => (
            <Link to={`/shops/${shop._id}`} key={i}>
              <Divider />
              <ListItem button>
                <ListItemAvatar>
                  <AvatarImage src={`/api/shops/logo/${shop._id}?${new Date().getTime()}`} />
                </ListItemAvatar>
                <DetailsDiv>
                  <ShopTitleTypography variant="subtitle1" component="h2" color="primary">
                    {shop.name}
                  </ShopTitleTypography>
                  <SubheadingTypography variant="subtitle2" component="h4">
                    {shop.description}
                  </SubheadingTypography>
                </DetailsDiv>
              </ListItem>
              <Divider />
            </Link>
          ))}
        </List>
      </RootPaper>
    </div>
  );
}
