import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import FileUpload from '@mui/icons-material/AddPhotoAlternate';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import { create } from './api-shop.js';
import { Link, useNavigation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import auth from '../../components/auth/auth-helper.js';

const CardWrapper = styled(Card)({
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  marginTop: theme => theme.spacing(5),
  paddingBottom: theme => theme.spacing(2),
});

const Title = styled(Typography)({
  marginTop: theme => theme.spacing(2),
  color: theme => theme.palette.primary.main,
  fontSize: '1em',
});

const TextFieldWrapper = styled(TextField)({
  marginLeft: theme => theme.spacing(1),
  marginRight: theme => theme.spacing(1),
  width: 300,
});

const SubmitButton = styled(Button)({
  margin: 'auto',
  marginBottom: theme => theme.spacing(2),
});

const CancelButton = styled(Button)({
  marginLeft: theme => theme.spacing(2),
});

export const NewShop = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    error: '',
  });

  const navigation = useNavigation();
  const jwt = auth.isAuthenticated();

  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = () => {
    let shopData = new FormData();
    values.name && shopData.append('name', values.name);
    values.description && shopData.append('description', values.description);
    values.image && shopData.append('image', values.image);
    create({ userId: jwt.user._id }, { t: jwt.token }, shopData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        navigation.navigate('/seller/shops');
      }
    });
  };

  return (
    <div>
      <CardWrapper>
        <CardContent>
          <Title variant="h6" component="h2">
            New Shop
          </Title>
          <br />
          <input
            accept="image/*"
            onChange={handleChange('image')}
            style={{ display: 'none' }}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload Logo
              <FileUpload />
            </Button>
          </label>{' '}
          <span>{values.image ? values.image.name : ''}</span>
          <br />
          <TextFieldWrapper
            id="name"
            label="Name"
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <br />
          <TextFieldWrapper
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={values.description}
            onChange={handleChange('description')}
            margin="normal"
          />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error">{values.error}</Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <SubmitButton color="primary" variant="contained" onClick={clickSubmit}>
            Submit
          </SubmitButton>
          <Link to="/seller/shops">
            <CancelButton variant="contained">Cancel</CancelButton>
          </Link>
        </CardActions>
      </CardWrapper>
    </div>
  );
};
