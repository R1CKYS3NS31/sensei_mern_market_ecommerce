import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { stripeUpdate } from './api-user.js';
import { styled } from '@mui/material/styles';
import auth from '../auth/auth-helper.js';

const RootPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  marginTop: theme.spacing(5),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  margin: `${theme.spacing(3)} 0 ${theme.spacing(2)}`,
  color: theme.palette.protectedTitle,
  fontSize: '1.1em',
}));

const SubheadingTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.openTitle,
  marginLeft: '24px',
}));

export default function StripeConnect(props) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    error: false,
    connecting: false,
    connected: false,
  });
  const jwt = auth.isAuthenticated();
  const location = useLocation();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const parsed = new URLSearchParams(location.search);
    if (parsed.get('error')) {
      setValues({ ...values, error: true });
    }
    if (parsed.get('code')) {
      setValues({ ...values, connecting: true, error: false });
      // post call to stripe, get credentials and update user data
      stripeUpdate(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        parsed.get('code'),
        signal
      ).then((data) => {
        if (data.error) {
          setValues({ ...values, error: true, connected: false, connecting: false });
        } else {
          setValues({ ...values, connected: true, connecting: false, error: false });
        }
      });
    }
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <RootPaper elevation={4}>
      <TitleTypography variant="h6">
        Connect your Stripe Account
      </TitleTypography>
      {values.error && (
        <SubheadingTypography variant="subtitle1">
          Could not connect your Stripe account. Try again later.
        </SubheadingTypography>
      )}
      {values.connecting && (
        <SubheadingTypography variant="subtitle1">
          Connecting your Stripe account ...
        </SubheadingTypography>
      )}
      {values.connected && (
        <SubheadingTypography variant="subtitle1">
          Your Stripe account successfully connected!
        </SubheadingTypography>
      )}
    </RootPaper>
  );
}
