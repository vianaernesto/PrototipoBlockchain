import React from "react";
import { Switch, Route } from "react-router-dom";
import { PrivateRoute } from './SpecialRoutes.js';
import Cookies from 'universal-cookie';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import "./App.css"

import Menu from "../Menu/Menu";
import Login from "../Login/Login.js";
import Registrar from "../Registrar/Registrar.js";
import CrearPagare from "../Transaction/CrearPagare.js";
import Home from "../Home/Home.js";
import Footer from "../Footer/Footer.js";
import Balance from "../Balance/Balance.js";
import PagareDetail from "../Balance/PagareDetail.js";
import CrearEndoso from "../Endosos/CrearEndoso.js";
import Endosos from "../Endosos/Endosos.js";

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
                <Route exact path="/" component={(props) => <Home {...props} getUsuario={this.getUsuario}/>} />
                <Route exact path="/login" component={(props) => <Login {...props} setUsuario={this.setUsuario} getUsuario={this.getUsuario} />} />
                <Route exact path="/registrar" component={(props) => <Registrar {...props} getUsuario={this.getUsuario} />} />
                <PrivateRoute exact path="/pagare/crear" component={ (props) => <CrearPagare {...props} getUsuario={this.getUsuario} />} getUsuario={this.getUsuario} />
                <PrivateRoute exact path="/balance" component={ (props) => <Balance {...props} getUsuario={this.getUsuario} />} getUsuario={this.getUsuario}/>
                <PrivateRoute exact path="/pagareDetail" component={PagareDetail} getUsuario={this.getUsuario} />
                <PrivateRoute exact path="/endoso/crear" component={ (props) => <CrearEndoso {...props} getUsuario={this.getUsuario}/>} getUsuario={this.getUsuario}/>
                <PrivateRoute exact path="/endosos" component={(props)=> <Endosos {...props} getUsuario={this.getUsuario}/>} getUsuario={this.getUsuario}/>
              </Switch>
            </div>
            <Footer/>
          </div>
        );
      }
}