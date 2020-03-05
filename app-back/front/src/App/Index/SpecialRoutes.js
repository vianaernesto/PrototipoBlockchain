import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute ({ ...rest }) {
    const getUsuario = rest.getUsuario;
    if(getUsuario()) {
      return (
        <Route {...rest} />
      );
    }
    else {
      return (
        <Redirect to='/login' />
      );
    }
  }
  
  export { PrivateRoute };