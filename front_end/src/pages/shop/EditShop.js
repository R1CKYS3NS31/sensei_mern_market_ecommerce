import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { MyProducts } from '../product/MyProducts';
import FileUpload from '@mui/icons-material/AddPhotoAlternate';
import auth from '../../components/auth/auth-helper.js';
import { read, update } from './api-shop.js';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  margin: 30,
}));

const CardContainer = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  paddingBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
  color: theme.palette.primary.main,
  fontSize: '1.2em',
}));

const Subheading = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.openTitle,
}));

const ErrorIcon = styled(Icon)(({ theme }) => ({
  verticalAlign: 'middle',
}));

const TextFieldStyled = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: 400,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: 'auto',
  marginBottom: theme.spacing(2),
}));

const BigAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  margin: 'auto',
}));

const Input = styled('input')(({ theme }) => ({
  display: 'none',
}));

const Filename = styled('span')(({ theme }) => ({
  marginLeft: '10px',
}));

export const EditShop = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    redirect: false,
    error: '',
    id: '',
  });

  const navigate = useNavigate();
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ shopId: match.params.shopId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          description: data.description,
          owner: data.owner.name,
        });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const clickSubmit = () => {
    let shopData = new FormData();
    values.name && shopData.append('name', values.name);
    values.description && shopData.append('description', values.description);
    values.image && shopData.append('image', values.image);

    update({ shopId: match.params.shopId }, { t: jwt.token }, shopData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          navigate('/seller/shops');
        }
      }
    );
  };

  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const logoUrl = values.id
    ? `/api/shops/logo/${values.id}?${new Date().getTime()}`
    : '/api/shops/defaultphoto';

  return (
    <Root>
      <Grid container spacing={8}>
        <Grid item xs={6} sm={6}>
          <CardContainer>
            <CardContent>
              <Title variant="h6" component="h2">
                Edit Shop
              </Title>
              <br />
              <BigAvatar src={logoUrl} /><br />
              <Input accept="image/*" onChange={handleChange('image')} id="icon-button-file" type="file" />
              <label htmlFor="icon-button-file">
                <Button variant="contained" color="default" component="span">
                  Change Logo
                  <FileUpload />
                </Button>
              </label> <Filename>{values.image ? values.image.name : ''}</Filename><br />
              <TextFieldStyled id="name" label="Name" value={values.name} onChange={handleChange('name')} margin="normal" /><br />
              <TextFieldStyled
                id="multiline-flexible"
                label="Description"
                multiline
                rows={3}
                value={values.description}
                onChange={handleChange('description')}
                margin="normal"
              /><br />
              <Subheading variant="subtitle1" component="h4">
                Owner: {values.owner}
              </Subheading><br />
              {values.error && (
                <Typography component="p" color="error">
                  <ErrorIcon color="error" />{values.error}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <SubmitButton color="primary" variant="contained" onClick={clickSubmit}>
                Update
              </SubmitButton>
            </CardActions>
          </CardContainer>
        </Grid>
        <Grid item xs={6} sm={6}>
          <MyProducts shopId={match.params.shopId} />
        </Grid>
      </Grid>
    </Root>
  );
};
