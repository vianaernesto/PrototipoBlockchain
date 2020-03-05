import React from "react";
import { Switch, Route } from "react-router-dom";
import { PrivateRoute } from './SpecialRoutes.js';
import Cookies from 'universal-cookie';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import Menu from "../Menu/Menu";
import Login from "../Login/Login.js";
import CrearPagare from "../Transaction/CrearPagare.js";

let jwt = require('jsonwebtoken');
const cookies = new Cookies();

export default class App extends React.Component {
   
    constructor(){
        super();
        this.state = {
          user: jwt.decode(cookies.get('token'))
        }
    
        this.setUsuario = this.setUsuario.bind(this);
        this.getUsuario = this.getUsuario.bind(this);
        this.removeUsuario = this.removeUsuario.bind(this);
    }
    
    setUsuario(token){
        cookies.set('token', token);
        this.setState({user: jwt.decode(cookies.get('token'))});
    }

    getUsuario() {
        return this.state.user;
    }

    removeUsuario() {
        this.setState({user: undefined});
        cookies.remove('token');
    }

    render() {
        return (
          <div className="App">
            <div role="main" className="container-fluid">
              <Menu getUsuario={this.getUsuario} removeUsuario={this.removeUsuario}  />
              <Switch>
                <Route exact path="/login" component={(props) => <Login {...props} setUsuario={this.setUsuario} getUsuario={this.getUsuario} />} />
                <PrivateRoute exact path="/pagare/crear" component={CrearPagare} getUsuario={this.getUsuario} />
              </Switch>
            </div>
          </div>
        );
      }
}