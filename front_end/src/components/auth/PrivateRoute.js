import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import auth from './auth-helper'

export const PrivateRoute = ({ component: Component, ...rest }) => {
  return auth.isAuthenticated() ? (
    <Component />
  ) : (
    <Navigate
      to={{
        pathname: '/signin',
        state: { from: rest.location }
      }}
      replace
    />
  );
};