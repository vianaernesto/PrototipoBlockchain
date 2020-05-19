import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { EscenarioContext } from '../Context/context';

import './Menu.css'
import imagen from '../../assets/user.png';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        this.props.removeUsuario();
    }

    listarEnlaces() {
        if (this.props.getUsuario()) {
            return (
                <ul className="navbar-nav ml-0 align-items-end">
                    <li className="nav-item dropdown ml-5">
                        <EscenarioContext.Consumer>
                            {({ escenario,toggleSimple, toggleENS, toggleEther }) => (
                                <React.Fragment>
                                    <div className="but-solid" id="dropEscenario" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {`Escenario: ${escenario}`}
                                            </div>
                                    <div className="dropdown-menu dropdown-menu-sm-right" aria-labelledby="dropEscenario">
                                        <button className="dropdown-item" onClick={toggleSimple}>Escenario Simple</button>
                                        <button className="dropdown-item" onClick={toggleENS}>Escenario con ENS</button>
                                        <button className="dropdown-item" onClick={toggleEther}>Escenario con Ether</button>
                                    </div>
                                </React.Fragment>
                            )}
                        </EscenarioContext.Consumer>
                    </li>
                    <li className="nav-item mx-md-2">
                        <Link to="/balance" className="nav-link">
                            Balance
                        </Link>
                    </li>
                    <li className="nav-item mx-md-2">
                        <Link to="/endosos" className="nav-link">
                            Endosos
                        </Link>
                    </li>
                    {this.revisarLogin()}
                </ul>
            );
        }
        else {
            return (
                <ul className="navbar-nav ml-0 align-items-end">
                    <li className="nav-item dropdown ml-5">
                        <EscenarioContext.Consumer>
                            {({ escenario,toggleSimple, toggleENS, toggleEther }) => (
                                <React.Fragment>
                                    <div className="but-solid" id="dropEscenario" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {`Escenario: ${escenario}`}
                                            </div>
                                    <div className="dropdown-menu dropdown-menu-sm-right" aria-labelledby="dropEscenario">
                                        <button className="dropdown-item" onClick={toggleSimple}>Escenario Simple</button>
                                        <button className="dropdown-item" onClick={toggleENS}>Escenario con ENS</button>
                                        <button className="dropdown-item" onClick={toggleEther}>Escenario con Ether</button>
                                    </div>
                                </React.Fragment>
                            )}
                        </EscenarioContext.Consumer>
                    </li>
                    {this.revisarLogin()}
                </ul>
            );
        }
    }

    revisarLogin() {
        if (this.props.getUsuario()) {
            return (
                <li className="nav-item dropdown ml-5">
                    <div id="drop" role="button" tabIndex="0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img className="rounded-circle profilePic" src={imagen} width="45" height="45" alt="Imagen de perfil" />
                    </div>
                    <div className="dropdown-menu dropdown-menu-sm-right" aria-labelledby="drop">
                        <h4>{this.props.getUsuario().nombres}</h4>
                        <h4>{this.props.getUsuario().apellidos}</h4>
                        <h4>{`Cedula: ${this.props.getUsuario().cedula}`}</h4>
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
                        <Link className="dropdown-item" to="/registrar">Registrarse</Link>
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