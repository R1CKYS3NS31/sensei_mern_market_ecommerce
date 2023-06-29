import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { read } from './api-shop.js';
import { listByShop } from './../product/api-product.js';
import { Products } from '../product/Products.js';

const RootContainer = styled('div')({
  flexGrow: 1,
  margin: 30,
});

const CardContainer = styled(Card)({
  textAlign: 'center',
  paddingBottom: (theme) => theme.spacing(2),
});

const Title = styled(Typography)({
  margin: (theme) => theme.spacing(2),
  color: (theme) => theme.palette.protectedTitle,
  fontSize: '1.2em',
});

const Subheading = styled(Typography)({
  marginTop: (theme) => theme.spacing(1),
  color: (theme) => theme.palette.openTitle,
});

const BigAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  margin: 'auto',
});

const ProductTitle = styled(Typography)({
  padding: (theme) => `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
  color: (theme) => theme.palette.openTitle,
  width: '100%',
  fontSize: '1.2em',
});

export const Shop = ({ match }) => {
  const [shop, setShop] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByShop(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data);
      }
    });

    read(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setShop(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.shopId]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByShop(
      {
        shopId: match.params.shopId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.shopId]);

  const logoUrl = shop._id ? `/api/shops/logo/${shop._id}?${new Date().getTime()}` : '/api/shops/defaultphoto';

  return (
    <RootContainer>
      <Grid container spacing={8}>
        <Grid item xs={4} sm={4}>
          <CardContainer>
            <CardContent>
              <Title type="headline" component="h2">
                {shop.name}
              </Title>
              <br />
              <BigAvatar src={logoUrl} /><br />
              <Subheading type="subheading" component="h2">
                {shop.description}
              </Subheading><br />
            </CardContent>
          </CardContainer>
        </Grid>
        <Grid item xs={8} sm={8}>
          <Card>
            <ProductTitle type="title" component="h2">Products</ProductTitle>
            <Products products={products} searched={false} />
          </Card>
        </Grid>
      </Grid>
    </RootContainer>
  );
}
