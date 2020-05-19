import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies();

class Endosos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers: {
                "Content-Type": "application/json",
                "authorization": cookies.get("token")
            },
            cedulaUsuario: this.props.getUsuario().cedula,
            endosos: [],
        };

        this.etapaLevel = this.etapaLevel.bind(this);
        this.etapaTexto = this.etapaTexto.bind(this);
        this.hasPendiente = this.hasPendiente.bind(this);
    }

    componentDidMount() {
        axios.get(`/endosos/endosante/${this.state.cedulaUsuario}`, { headers: this.state.headers })
            .then(response => {
                let endososLocal = response.data;
                for (let x in endososLocal) {
                    axios.get(`pagares/${endososLocal[x].id_pagare}`, { headers: this.state.headers })
                        .then(response => {
                            let pagareLocal = response.data;
                            endososLocal[x].pagare = pagareLocal;

                            this.setState({
                                endosos: endososLocal,
                            });
                        });
                }

            });
        axios.get(`/endosos/endosatario/${this.state.cedulaUsuario}`, { headers: this.state.headers })
            .then(response => {
                let endososLocal = this.state.endosos.concat(response.data);
                for (let x in endososLocal) {
                    axios.get(`pagares/${endososLocal[x].id_pagare}`, { headers: this.state.headers })
                        .then(response => {
                            let pagareLocal = response.data;
                            endososLocal[x].pagare = pagareLocal;

                            this.setState({
                                endosos: endososLocal,
                            });
                        });
                }

            });
    }

    etapaLevel(etapa) {
        if (etapa === 1) {
            return 'bg-warning';
        } else if (etapa === 2) {
            return 'bg-success'
        }
    }

    etapaTexto(etapa) {
        if (etapa === 1) {
            return 'Establecer Código de retiro'
        } else if (etapa === 2) {
            return 'Firma'
        }
    }

    etapaColor(etapa) {
        if (etapa === 1) {
            return "#ffcc00"
        } else if (etapa === 2) {
            return "#99cc33"
        }
    }

    hasPendiente() {
        let y = false;
        for (let x in this.state.endosos) {
            if (this.state.endosos[x].etapa < 3) {
                y = true;
            }
        }
        return y;
    }


    render() {
        return (
            <div className="host">
                <div className="row align-items-center justify-content-center">
                    {this.hasPendiente()
                        ? <React.Fragment>
                            <div className="col-lg-4 col-4 col-md-6 text-center">
                                <h1 className="display-4 text-center font-weight-bold">
                                    Pendientes
                        </h1>
                            </div>
                            <div className="col-lg-8 col-8 col-md-8 text-center">
                                <h1 className="display-4 text-center font-weight-bold">
                                    Terminados
                        </h1>
                            </div>
                        </React.Fragment>
                        : <React.Fragment>
                            <div className="col-lg-12 col-12 col-md-12 text-center">
                                <h1 className="display-4 text-center font-weight-bold">
                                    Endosos
                        </h1>
                            </div>
                        </React.Fragment>}
                </div>
                <div className="row align-items-center justify-content-center">
                    {this.state.endosos.length > 0
                        ? <React.Fragment>
                            {this.hasPendiente()
                                ? <React.Fragment>
                                    <div className="col-lg-4 col-4 col-md-4">
                                        {this.state.endosos.map((x, i) => {
                                            if (x.etapa < 3) {
                                                return (
                                                    <div key={i}>
                                                        <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                        <div className="col-lg-4 col-md-8 col-sd-12" style={{ marginTop: "2em" }}>
                                                            <div className="card" style={{ width: "18em" }}>
                                                                <div className={`card-body ${this.etapaLevel(x.etapa)}`}>
                                                                    <p className="card-text text-left" style={{ color: "white" }}>Endoso #{x._id}</p>
                                                                    <h2 className={`card-title`} style={{ color: "white" }}>Etapa: {this.etapaTexto(x.etapa)}</h2>
                                                                </div>
                                                                <ul className="list-group list-group-flush">
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Endosante: </span><span className="text-right">{x.nombre_endosante}</span></li>
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Endosatario: </span><span className="text-right">{x.nombre_endosatario}</span></li>
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Cedula de Endosante: </span><span className="text-right">{x.id_endosante}</span></li>
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Cedula de Endosatario: </span><span className="text-right">{x.id_endosante}</span></li>
                                                                </ul>
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col-md-6 col-6 col-lg-6">
                                                                            <Link to={{ pathname: '/endoso/crear/', state: { endoso: x, pagare: x.pagare, usuario: { nombre: this.state.nombre, cedula: this.state.cedulaUsuario } } }}><button className={`but-solid ${this.etapaLevel(x.etapa)}`} style={{ borderColor: this.etapaColor(x.etapa) }} >Dar siguiente paso</button></Link>

                                                                        </div>
                                                                        <div className="col-md-6 col-6 col-lg-6">
                                                                            <Link to={{ pathname: '/pagareDetail/', state: { pagare: x.pagare, } }}><button className={`but-solid ${this.etapaLevel(x.etapa)}`} style={{ borderColor: this.etapaColor(x.etapa) }} >Ver Pagaré Asociado</button></Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                    <div className="col-lg-8 col-8 col-md-8">
                                        {this.state.endosos.map((y, j) => {
                                            if (y.etapa === 3) {
                                                return (
                                                    <div key={j}>
                                                        <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                        <div className="col-lg-4 col-md-8 col-sd-12" style={{ marginTop: "2em" }}>
                                                            <div className="card" style={{ width: "18em" }}>
                                                                <div className={`card-body`}>
                                                                    <p className="card-text text-left" style={{ fontWeight: "bold" }}>Endoso #{y._id}</p>
                                                                    <h2 className={`card-title`} >Etapa: {this.etapaTexto(y.etapa)}</h2>
                                                                </div>
                                                                <ul className="list-group list-group-flush">
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Endosante: </span><span className="text-right">{y.nombre_endosante}</span></li>
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Endosatario: </span><span className="text-right">{y.nombre_endosatario}</span></li>
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Cedula de Endosante: </span><span className="text-right">{y.id_endosante}</span></li>
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Cedula de Endosatario: </span><span className="text-right">{y.id_endosante}</span></li>
                                                                </ul>
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col-2"></div>
                                                                        <div className="col-8"><Link to={{ pathname: '/pagareDetail/', state: { pagare: y.pagare } }}><button className={`but-solid`}>Ver Pagaré Asociado</button></Link></div>
                                                                        <div className="col-2"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </React.Fragment>
                                : <React.Fragment>
                                    <div className="col-lg-12 col-12 col-md-12">
                                        {this.state.endosos.map((y, j) => {
                                            if (y.etapa === 3 && y.pagare) {
                                                return (
                                                    <div key={j}>
                                                        <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                        <div className="col-lg-4 col-md-8 col-sd-12" style={{ marginTop: "2em" }}>
                                                            <div className="card" style={{ width: "18em" }}>
                                                                <div className={`card-body`}>
                                                                    <p className="card-text text-left" style={{ fontWeight: "bold" }}>Endoso #{y._id}</p>
                                                                    <h2 className={`card-title`} >Titular</h2>
                                                                </div>
                                                                <ul className="list-group list-group-flush">
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Endosante: </span><span className="text-right">{y.nombre_endosante}</span></li>
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Endosatario: </span><span className="text-right">{y.nombre_endosatario}</span></li>
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Cedula de Endosante: </span><span className="text-right">{y.id_endosante}</span></li>
                                                                    <li className="list-group-item"><span className="text-left font-weight-bold">Cedula de Endosatario: </span><span className="text-right">{y.id_endosante}</span></li>
                                                                </ul>
                                                                <div className="card-body">
                                                                    <Link to={{ pathname: '/pagareDetail/', state: { endoso: y, pagare: y.pagare } }}><button className={`but-solid`}>Ver Pagaré Asociado</button></Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </React.Fragment>}
                        </React.Fragment>
                        : <h1 className="display-3 text-center font-weight-bold">
                            No tiene endosos registrados.
                    <p className="display-4">Si quieres endosar un pagaré revisa uno de los tuyos</p>
                        </h1>}

                </div>
            </div>);
    }
}

export default Endosos;