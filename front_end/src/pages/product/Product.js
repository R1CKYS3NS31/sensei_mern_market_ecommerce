import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Grid from '@mui/material/Grid';
import { read, listRelated } from './api-product.js';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material';
import { AddToCart } from '../cart/AddToCart.js';
import { Suggestions } from './Suggestions.js';

const RootContainer = styled('div')({
  flexGrow: 1,
  margin: 30,
});

const FlexContainer = styled('div')({
  display: 'flex',
});

const StyledCard = styled(Card)({
  padding: '24px 40px 40px',
});

const Subheading = styled(Typography)({
  margin: '24px',
  color: (theme) => theme.palette.openTitle,
});

const Price = styled('div')({
  padding: '16px',
  margin: '16px 0px',
  display: 'flex',
  backgroundColor: '#93c5ae3d',
  fontSize: '1.3em',
  color: '#375a53',
});

const Media = styled(CardMedia)({
  height: 200,
  display: 'inline-block',
  width: '50%',
  marginLeft: '24px',
});

const IconStyle = styled(Icon)({
  verticalAlign: 'sub',
});

const LinkStyle = styled(Link)({
  color: '#3e4c54b3',
  fontSize: '0.9em',
});

const AddCartButton = styled('div')({
  width: '35px',
  height: '35px',
  padding: '10px 12px',
  borderRadius: '0.25em',
  backgroundColor: '#5f7c8b',
});

const Action = styled('span')({
  margin: '8px 24px',
  display: 'inline-block',
});

export const Product = ({ match }) => {
  const [product, setProduct] = useState({ shop: {} });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ productId: match.params.productId }, signal).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.productId]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listRelated({ productId: match.params.productId }, signal).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setSuggestions(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.productId]);

  const imageUrl = product._id
    ? `/api/product/image/${product._id}?${new Date().getTime()}`
    : '/api/product/defaultphoto';

  return (
    <RootContainer>
      <Grid container spacing={10}>
        <Grid item xs={7} sm={7}>
          <StyledCard>
            <CardHeader
              title={product.name}
              subheader={product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              action={
                <Action>
                  <AddToCart cartStyle={AddCartButton} item={product} />
                </Action>
              }
            />
            <FlexContainer>
              <Media image={imageUrl} title={product.name} />
              <Typography component="p" variant="subtitle1" className={Subheading}>
                {product.description}
                <br />
                <Price>$ {product.price}</Price>
                <LinkStyle to={'/shops/' + product.shop._id}>
                  <span>
                    <IconStyle>shopping_basket</IconStyle> {product.shop.name}
                  </span>
                </LinkStyle>
              </Typography>
            </FlexContainer>
          </StyledCard>
        </Grid>
        {suggestions.length > 0 && (
          <Grid item xs={5} sm={5}>
            <Suggestions products={suggestions} title='Related Products' />
          </Grid>
        )}
      </Grid>
    </RootContainer>
  );
};
