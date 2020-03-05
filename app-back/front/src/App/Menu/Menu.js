import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './Menu.css'
import imagen from '../../assets/user.png';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout(){
        this.props.removeUsuario();
    }

    listarEnlaces() {
        if(this.props.getUsuario()) {
            return (
                <ul className="navbar-nav ml-0 align-items-end">
                    {this.revisarLogin()}
                </ul>
            );
        }
        else {
            return (
                <ul className="navbar-nav ml-0 align-items-end">
                    {this.revisarLogin()}
                </ul>
            );
        }
    }

    revisarLogin() {
        if(this.props.getUsuario()) {
            return (
                <li className="nav-item dropdown ml-5">
                    <div id="drop" role="button" tabIndex="0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img className="rounded-circle profilePic" src={imagen} width="45" height="45" alt="Imagen del perfil" />
                    </div>
                    <div className="dropdown-menu dropdown-menu-sm-right" aria-labelledby="drop">
                        <Link className="dropdown-item" to="/" onClick={this.logout}>Cerrar sesión</Link>
                    </div>
                </li>
            );
        }
        else {
            return (
                <li className="nav-item dropdown ml-5">
                    <div className="but-solid" id="drop" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Entrar
                    </div>
                    <div className="dropdown-menu dropdown-menu-sm-right" aria-labelledby="drop">
                        <Link className="dropdown-item" to="/login">Ingresar</Link>
                    </div>
                </li>
            );
        }
    }

    render() {
        return (
            <nav className="fixed-top navbar navbar-expand-md bg-white shadow navbar-light">
                <Link className="navbar-brand d-flex align-items-center ml-3 font-weight-bold" to="/" title="Prototipo">
                    <span className="prefix">Blockchain</span> Prototype
                </Link>
                <button className="navbar-toggler mr-md-4" type="button" data-toggle="collapse" data-target="#thebar" aria-controls="thebar" aria-expanded="false" aria-label="Toggle Navigation Menu">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="thebar" className="collapse navbar-collapse justify-content-end mr-md-4">
                    {this.listarEnlaces()}
                </div>
            </nav>
        )
    }
}