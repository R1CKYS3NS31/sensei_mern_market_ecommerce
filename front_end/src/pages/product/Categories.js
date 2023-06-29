import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import { list } from './api-product';
import { Products } from './Products';

const CategoriesCard = styled(Card)(({ theme }) => ({
  margin: 'auto',
  marginTop: 20,
}));

const Title = styled(Typography)(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(2.5)} ${theme.spacing(2)}`,
  color: theme.palette.openTitle,
  backgroundColor: '#80808024',
  fontSize: '1.1em',
}));


const TileTitle = styled(Grid)(({ theme }) => ({
  verticalAlign: 'middle',
  lineHeight: 2.5,
  textAlign: 'center',
  fontSize: '1.35em',
  margin: '0 4px 0 0',
}));

const Link = styled('span')(({ theme }) => ({
  color: '#4d6538',
  textShadow: '0px 2px 12px #ffffff',
  cursor: 'pointer',
}));

export const Categories = ({ categories }) => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(categories[0]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list({
      category: categories[0],
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [categories]);

  const listbyCategory = (category) => (event) => {
    setSelected(category);
    list({
      category: category,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  return (
    <div>
      <CategoriesCard>
        <Title variant="h6">
          Explore by category
        </Title>
        <div>
          <Grid container spacing={2}>
            {categories.map((tile, i) => (
              <TileTitle
                item
                key={i}
                xs={3}
                style={{
                  height: '64px',
                  backgroundColor:
                    selected === tile ? 'rgba(95, 139, 137, 0.56)' : 'rgba(95, 124, 139, 0.32)',
                }}
              >
                <Link onClick={listbyCategory(tile)}>
                  {tile} <Icon>{selected === tile && 'arrow_drop_down'}</Icon>
                </Link>
              </TileTitle>
            ))}
          </Grid>
        </div>
        <Divider />
        <Products products={products} searched={false} />
      </CategoriesCard>
    </div>
  );
};

Categories.propTypes = {
  categories: PropTypes.array.isRequired,
};
