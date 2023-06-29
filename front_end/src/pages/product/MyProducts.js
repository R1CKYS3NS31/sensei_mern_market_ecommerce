import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import EditIcon from '@mui/icons-material/Edit';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import { listByShop } from './../product/api-product.js';
import { DeleteProduct } from './DeleteProduct.js';

const ProductsCard = styled(Card)(({ theme }) => ({
  padding: '24px',
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
  color: theme.palette.protectedTitle,
  fontSize: '1.2em',
}));

const AddButton = styled(Button)(({ theme }) => ({
  float: 'right',
}));

const LeftIcon = styled(Icon)(({ theme }) => ({
  marginRight: '8px',
}));

const Subheading = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.openTitle,
}));

const Cover = styled(CardMedia)(({ theme }) => ({
  width: 110,
  height: 100,
  margin: '8px',
}));

const Details = styled('div')(({ theme }) => ({
  padding: '10px',
}));

export const MyProducts = ({ shopId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByShop({ shopId }, signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [shopId]);

  const removeProduct = (product) => {
    const updatedProducts = [...products];
    const index = updatedProducts.indexOf(product);
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  return (
    <ProductsCard>
      <Title variant="h6">
        Products
        <AddButton component={Link} to={`/seller/${shopId}/products/new`} color="primary" variant="contained">
          <LeftIcon>add_box</LeftIcon> New Product
        </AddButton>
      </Title>
      <List dense>
        {products.map((product, i) => (
          <span key={i}>
            <ListItem>
              <Cover image={`/api/product/image/${product._id}?${new Date().getTime()}`} title={product.name} />
              <Details>
                <Typography variant="h6" color="primary">
                  {product.name}
                </Typography>
                <Subheading>
                  Quantity: {product.quantity} | Price: ${product.price}
                </Subheading>
              </Details>
              <ListItemSecondaryAction>
                <IconButton component={Link} to={`/seller/${product.shop._id}/${product._id}/edit`} aria-label="Edit" color="primary">
                  <EditIcon />
                </IconButton>
                <DeleteProduct product={product} shopId={shopId} onRemove={removeProduct} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </span>
        ))}
      </List>
    </ProductsCard>
  );
};

MyProducts.propTypes = {
  shopId: PropTypes.string.isRequired,
};
