import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { AddToCart } from '../cart/AddToCart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  overflow: 'hidden',
  background: theme.palette.background.paper,
  textAlign: 'left',
  padding: '0 8px',
}));

const Container = styled('div')({
  minWidth: '100%',
  paddingBottom: '14px',
});

const Title = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(2.5)} ${theme.spacing(2)}`,
  color: theme.palette.primary.main,
  width: '100%',
}));

const Tile = styled(Grid)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(1),
}));

const Image = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
});

const TileTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '5px',
  color: 'rgb(189, 222, 219)',
  display: 'block',
  fontSize: theme.typography.subtitle1.fontSize,
}));

export const Products = ({ products, searched }) => {
  return (
    <Root>
      {products.length > 0 ? (
        <Container>
          <Grid container spacing={2}>
            {products.map((product, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Tile>
                  <Card>
                    <Link to={'/product/' + product._id}>
                      <Image image={'/api/product/image/' + product._id} alt={product.name} />
                    </Link>
                    <CardContent>
                      <TileTitle variant="subtitle1">
                        <Link to={'/product/' + product._id}>{product.name}</Link>
                      </TileTitle>
                      <Typography variant="subtitle1">$ {product.price}</Typography>
                      <AddToCart item={product} />
                    </CardContent>
                  </Card>
                </Tile>
              </Grid>
            ))}
          </Grid>
        </Container>
      ) : searched && (
        <Title variant="subtitle1" component="h4">
          No products found! :(
        </Title>
      )}
    </Root>
  );
};

Products.propTypes = {
  products: PropTypes.array.isRequired,
  searched: PropTypes.bool.isRequired,
};
