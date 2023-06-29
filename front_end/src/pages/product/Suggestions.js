import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import ViewIcon from '@mui/icons-material/Visibility';
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { styled } from '@mui/system';
import { AddToCart } from '../cart/AddToCart';
import { useTheme } from '@mui/material/styles';

const RootPaper = styled(Paper)(({ theme }) => ({
  padding: `${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
  paddingBottom: 24,
  backgroundColor: '#80808024',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
  color: theme.palette.openTitle,
  fontSize: '1.1em',
}));

const CardWrapper = styled(Card)({
  width: '100%',
  display: 'inline-flex',
});

const DetailsWrapper = styled('div')({
  display: 'inline-block',
  width: '100%',
});

const ContentWrapper = styled(CardContent)(({ theme }) => ({
  flex: '1 0 auto',
  padding: `${theme.spacing(2)}px ${theme.spacing(1)}px 0px`,
}));

const CoverMedia = styled(CardMedia)({
  width: '65%',
  height: 130,
  margin: '8px',
});

const DateTypography = styled(Typography)({
  color: 'rgba(0, 0, 0, 0.4)',
});

const ProductTitleTypography = styled(Typography)({
  fontSize: '1.15em',
  marginBottom: '5px',
});

const SubheadingTypography = styled(Typography)({
  color: 'rgba(88, 114, 128, 0.67)',
});

const PriceTypography = styled(Typography)(({ theme }) => ({
  display: 'inline',
  lineHeight: '3',
  paddingLeft: '8px',
  color: theme.palette.text.secondary,
}));

export const Suggestions = (props) => {
  const theme = useTheme();

  return (
    <div>
      <RootPaper elevation={4}>
        <TitleTypography type="title">
          {props.title}
        </TitleTypography>
        {props.products.map((item, i) => (
          <span key={i}>
            <CardWrapper>
              <CoverMedia
                image={`/api/product/image/${item._id}`}
                title={item.name}
              />
              <DetailsWrapper>
                <ContentWrapper>
                  <Link to={`/product/${item._id}`}>
                    <ProductTitleTypography variant="h3" component="h3" color="primary">
                      {item.name}
                    </ProductTitleTypography>
                  </Link>
                  <Link to={`/shops/${item.shop._id}`}>
                    <SubheadingTypography type="subheading">
                      <Icon>shopping_basket</Icon> {item.shop.name}
                    </SubheadingTypography>
                  </Link>
                  <DateTypography component="p">
                    Added on {new Date(item.created).toDateString()}
                  </DateTypography>
                </ContentWrapper>
                <div>
                  <PriceTypography variant="h3" color="primary">
                    $ {item.price}
                  </PriceTypography>
                  <span>
                    <AddToCart item={item} />
                  </span>
                  <Link to={`/product/${item._id}`}>
                    <IconButton color="secondary" dense="dense">
                      <ViewIcon />
                    </IconButton>
                  </Link>
                </div>
              </DetailsWrapper>
            </CardWrapper>
            <Divider />
          </span>
        ))}
      </RootPaper>
    </div>
  );
};

Suggestions.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
};
