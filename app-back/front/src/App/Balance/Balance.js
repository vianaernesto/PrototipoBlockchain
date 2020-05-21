import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import { Switch } from "react-router-dom";
import { PrivateRoute } from '../Index/SpecialRoutes.js';
import { EscenarioContext } from '../Context/context';
import Web3 from 'web3';
import Eth from 'ethjs-query';
import EthContract from 'ethjs-contract';
import { abiEther, addressEther } from '../metamask/abi.js';

import CrearPagare from '../Transaction/CrearPagare.js';
import "./Balance.css";

const cookies = new Cookies();

class Balance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers: {
                "Content-Type": "application/json",
                "authorization": cookies.get("token")
            },
            pagaresAfavor: [],
            pagaresEnContra: [],
            nombre: `${this.props.getUsuario().nombres} ${this.props.getUsuario().apellidos}`,
            cedulaUsuario: this.props.getUsuario().cedula,
            totalDeuda: 0,
            totalCobro: 0,
            rol: 'acreedor',
        }

        this.getPagares = this.getPagares.bind(this);
        this.renderEtapas = this.renderEtapas.bind(this);
        this.etapaLevel = this.etapaLevel.bind(this);
        this.etapaTexto = this.etapaTexto.bind(this);
        this.etapaColor = this.etapaColor.bind(this);
        this.renderNormal = this.renderNormal.bind(this);
        this.renderEther = this.renderEther.bind(this);
        this.convertidorEtheraPesos = this.convertidorEtheraPesos.bind(this);
    }

    componentDidMount() {
        this.getPagares();
    }

    getPagares() {

        if (this.context.escenario === 'Ether' && typeof window.web3 !== 'undefined') {
            let newWeb3 = new Web3(window.web3.currentProvider);
            newWeb3.eth.getAccounts().then(accounts => {
                if (accounts.length !== 0) {
                    const eth = new Eth(window.web3.currentProvider);
                    const account = accounts[0];
                    const contract = new EthContract(eth);
                    const MiniToken = contract(abiEther);
                    const miniToken = MiniToken.at(addressEther);
                    console.log(miniToken);
                    miniToken.getIdPagaresDeudor(account, { from: account })
                        .then(encontra => {
                            let encontraPagares = encontra[0];
                            let id = 0;
                            for (let i = 0; i < encontraPagares.length; i++) {
                                id = newWeb3.utils.toDecimal(encontraPagares[i]);
                                miniToken.getPagareById(id)
                                    .then(pagare => {
                                        let info = pagare[3].split(',');
                                        let newPagare = {
                                            id: i+1,
                                            valorWei: newWeb3.utils.fromWei(pagare[0]),
                                            valorPeso: this.convertidorEtheraPesos(newWeb3.utils.fromWei(pagare[0])),
                                            addresssDeudor: pagare[1],
                                            adddressAcreedor: pagare[2],
                                            lugarCreacion: info[3],
                                            idAcreedor: info[4],
                                            nombreAcreedor: info[5],
                                            idDeudor: info[6],
                                            nombewDedudor:info[7],
                                            firmado: pagare[4],
                                            fechaCreacion: new Date(newWeb3.utils.toDecimal(pagare[5]) * 1000),
                                            fechaVencimiento: new Date(newWeb3.utils.toDecimal(pagare[6]) * 1000),
                                        }
                                        this.setState(state => {
                                            const pagaresEnContra = state.pagaresEnContra.concat(newPagare);
                                            const totalDeuda = state.totalDeuda + newPagare.valorPeso;
                                            return {
                                                pagaresEnContra,
                                                totalDeuda,
                                            };
                                        });
                                    });
                            }

                        });

                    miniToken.getIdPagaresAcreedor(account, { from: account })
                        .then(afavor => {
                            let afavorPagares = afavor[0];
                            let id = 0;
                            for (let i = 0; i < afavorPagares.length; i++) {
                                id = newWeb3.utils.toDecimal(afavorPagares[i]);
                                miniToken.getPagareById(id)
                                    .then(pagare => {
                                        let info = pagare[3].split(',');
                                        let newPagare = {
                                            id: i+10,
                                            valorWei: newWeb3.utils.fromWei(pagare[0]),
                                            valorPeso: this.convertidorEtheraPesos(newWeb3.utils.fromWei(pagare[0])),
                                            addresssDeudor: pagare[1],
                                            adddressAcreedor: pagare[2],
                                            lugarCreacion: info[3],
                                            idAcreedor: info[4],
                                            nombreAcreedor: info[5],
                                            idDeudor: info[6],
                                            nombewDedudor:info[7],
                                            firmado: pagare[4],
                                            fechaCreacion: new Date(newWeb3.utils.toDecimal(pagare[5]) * 1000),
                                            fechaVencimiento: new Date(newWeb3.utils.toDecimal(pagare[6]) * 1000),
                                        }
                                        this.setState(state => {
                                            const pagaresAfavor = state.pagaresAfavor.concat(newPagare);
                                            const totalCobro = state.totalCobro + newPagare.valorPeso;
                                            return {
                                                pagaresAfavor,
                                                totalCobro,
                                            };
                                        });
                                    });
                            }
                        });

                }
            });

        } else {

            let getPagaresAFavor = axios.get(`pagares/acreedor/${this.state.cedulaUsuario}`, { headers: this.state.headers });

            let getPagaresEnContra = axios.get(`pagares/deudor/${this.state.cedulaUsuario}`, { headers: this.state.headers });

            axios.all([getPagaresAFavor, getPagaresEnContra])
                .then(axios.spread((...responses) => {


                    let datosAFavor = responses[0].data;
                    let datosEnContra = responses[1].data;
                    let totalAFavor = 0;
                    let totalEnContra = 0;

                    datosAFavor.map((x) => {
                        if (x.valor === -1) {
                            x.valor = 0;
                        }
                        totalAFavor = x.valor + totalAFavor;
                        return totalAFavor;
                    });

                    datosEnContra.map((x) => {
                        if (x.valor === -1) {
                            x.valor = 0;
                        }
                        totalEnContra = x.valor + totalEnContra;
                        return totalEnContra;
                    });

                    this.setState({
                        pagaresAfavor: datosAFavor,
                        pagaresEnContra: datosEnContra,
                        totalCobro: totalAFavor,
                        totalDeuda: totalEnContra,
                    });
                }));

        }
    }

    convertidorEtheraPesos(ether) {
        let etherC = 0.0000013;
        let pesos = ether / etherC;
        return pesos;
    }

    renderEtapas(pagare) {
        let etapa = pagare.etapa;
        if (etapa === 2) {
            return (
                <div>
                    <li className="list-group-item"><span className="text-left font-weight-bold">Valor: </span><span className="text-right">{pagare.valor}</span></li>
                    <li className="list-group-item"><span className="text-left font-weight-bold">Terminos del prestamo: </span><span className="text-right">{pagare.terminos}</span></li>
                </div>
            )
        } else if (etapa === 3) {
            return (
                <div>
                    <li className="list-group-item"><span className="text-left font-weight-bold">Valor: </span><span className="text-right">{pagare.valor}</span></li>
                    <li className="list-group-item"><span className="text-left font-weight-bold">Creado en: </span><span className="text-right">{pagare.lugarCreacion}</span></li>
                    <li className="list-group-item"><span className="text-left font-weight-bold">Fecha de vencimiento: </span><span className="text-right">{new Date(pagare.fechaVencimiento).getDate()}/{new Date(pagare.fechaVencimiento).getMonth() + 1}/{new Date(pagare.fechaVencimiento).getFullYear()}</span></li>

                </div>
            )
        }

    }

    etapaLevel(etapa) {
        if (etapa === 1) {
            return 'bg-danger';
        }
        else if (etapa === 1.5) {
            return 'bg-warning'
        } else if (etapa === 2) {
            return 'bg-info';
        } else if (etapa === 3) {
            return 'bg-success';
        }
    }

    etapaColor(etapa) {
        if (etapa === 1) {
            return '#cc3300';
        }
        else if (etapa === 1.5) {
            return '#ffcc00'
        }
        else if (etapa === 2) {
            return '#5bc0de';
        } else if (etapa === 3) {
            return '#99cc33';
        }
    }

    etapaTexto(etapa) {
        if (etapa === 1) {
            return 'Establecimiento de condiciones';
        } else if (etapa === 1.5) {
            return 'Aceptación de condiciones';
        } else if (etapa === 2) {
            return 'Información de retiro';
        } else if (etapa === 3) {
            return 'Firma del Pagaré';
        }
    }

    renderEther() {
        return (
            <div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-6 col-6 col-md-6 text-center ">
                        <h1 className="display-4 text-center font-weight-bold">
                            A Su Favor
                        </h1>
                    </div>
                    <div className="col-lg-6 col-6 col-md-6 text-center">
                        <h1 className="display-4 text-center font-weight-bold">
                            Usted Debe
                        </h1>
                    </div>
                </div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-3 col-3 col-md-3"></div>
                    <div className="col-lg-6 col-6 col-md-6">
                        <Link to={{ pathname: '/pagare/crear/', state: { rol: 'deudor', escenario: this.context.escenario, usuario: { nombre: this.state.nombre, cedula: this.state.cedulaUsuario } } }}  ><button className="but-solid">Crear Pagaré como Deudor </button></Link>
                    </div>
                    <div className="col-lg-6 col-6 col-md-6"></div>
                </div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-6 col-6 col-md-6 text-center ">
                        <div className="row" id="CardsContainer">
                            {this.state.pagaresAfavor.length > 0 ? (
                                <React.Fragment>
                                    {this.state.pagaresAfavor.map((x, i) => {
                                        if (x.firmado) {
                                            return (
                                                <div key={i}>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                    <div
                                                        className="col-lg-4 col-md-8 col-sd-12"
                                                        style={{ marginTop: "2em" }}>
                                                        <div className="card" style={{ width: "18em" }}>
                                                            <div className="card-body">
                                                                <p className="card-text text-left" style={{ fontWeight: "bold" }}>Pagaré #{x.id}</p>
                                                                <h2 className="card-title">${`${x.valorPeso}`}<br/>{`(Ether: ${x.valorWei})`}</h2>
                                                            </div>
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Deudor: </span><span className="text-right">{x.nombreDeudor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Cédula del Deudor: </span><span className="text-right">{x.idDeudor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Creado el: </span><span className="text-right">{new Date(x.fechaCreacion).getDate()}/{new Date(x.fechaCreacion).getMonth() + 1}/{new Date(x.fechaCreacion).getFullYear()}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Fecha de vencimiento: </span><span className="text-right">{new Date(x.fechaVencimiento).getDate()}/{new Date(x.fechaVencimiento).getMonth() + 1}/{new Date(x.fechaVencimiento).getFullYear()}</span></li>
                                                            </ul>

                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                </div>

                                            );
                                        } else {
                                            return (
                                                <div key={i}>
                                                <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                <div
                                                    className="col-lg-4 col-md-8 col-sd-12"
                                                    style={{ marginTop: "2em" }}>
                                                    <div className="card" style={{ width: "18em" }}>
                                                        <div className="card-body">
                                                            <p className="card-text text-left" style={{ fontWeight: "bold" }}>Pagaré #{x.id}</p>
                                                            <h2 className="card-title">${`${x.valorPeso}`}<br/>{`(Ether: ${x.valorWei})`}</h2>
                                                        </div>
                                                        <ul className="list-group list-group-flush">
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Deudor: </span><span className="text-right">{x.nombreDeudor}</span></li>
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Cédula del Deudor: </span><span className="text-right">{x.idDeudor}</span></li>
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Creado el: </span><span className="text-right">{new Date(x.fechaCreacion).getDate()}/{new Date(x.fechaCreacion).getMonth() + 1}/{new Date(x.fechaCreacion).getFullYear()}</span></li>
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Fecha de vencimiento: </span><span className="text-right">{new Date(x.fechaVencimiento).getDate()}/{new Date(x.fechaVencimiento).getMonth() + 1}/{new Date(x.fechaVencimiento).getFullYear()}</span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                            </div>
                                            );
                                        }

                                    })}
                                </React.Fragment>
                            ) : (
                                    <div className="col-md-12"
                                        style={{ marginTop: "2em", width: "100%" }}>
                                        <div className="card" style={{ textAlign: "center" }}>
                                            <div className="card-body">
                                                <p className="card-text">
                                                    No tiene pagarés a su favor en este momento
                                        </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                    <div className="col-lg-6 col-6 col-md-6 text-center ">
                        <div className="row" id="CardsContainer">
                            {this.state.pagaresEnContra.length > 0 ? (
                                <React.Fragment>
                                    {this.state.pagaresEnContra.map((x, i) => {
                                        if (x.firmado) {
                                            return (
                                                <div key={i}>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                    <div
                                                        className="col-lg-4 col-md-8 col-sd-12"
                                                        style={{ marginTop: "2em" }}>
                                                        <div className="card" style={{ width: "18em" }}>
                                                            <div className="card-body">
                                                                <p className="card-text text-left" style={{ fontWeight: "bold" }}>Pagaré #{x.id}</p>
                                                                <h2 className="card-title">${`${x.valorPeso}`}<br/>{`(Ether: ${x.valorWei})`}</h2>
                                                            </div>
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Acreedor: </span><span className="text-right">{x.nombreAcreedor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Cédula del Acreedor: </span><span className="text-right">{x.idAcreedor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Creado el: </span><span className="text-right">{new Date(x.fechaCreacion).getDate()}/{new Date(x.fechaCreacion).getMonth() + 1}/{new Date(x.fechaCreacion).getFullYear()}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Fecha de vencimiento: </span><span className="text-right">{new Date(x.fechaVencimiento).getDate()}/{new Date(x.fechaVencimiento).getMonth() + 1}/{new Date(x.fechaVencimiento).getFullYear()}</span></li>
                                                            </ul>
                                                            <div className="card-body">
                                                                <Link to={{ pathname: '/pagareDetail/', state: { pagare: x, } }} ><button className={`but-solid`} >Ver en Detalle</button></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                </div>

                                            );
                                        } else {
                                            return (
                                                <div key={i}>
                                                <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                <div
                                                    className="col-lg-4 col-md-8 col-sd-12"
                                                    style={{ marginTop: "2em" }}>
                                                    <div className="card" style={{ width: "18em" }}>
                                                        <div className="card-body">
                                                            <p className="card-text text-left" style={{ fontWeight: "bold" }}>Pagaré #{x.id}</p>
                                                            <h2 className="card-title">${`${x.valorPeso}`}<br/>{`(Ether: ${x.valorWei})`}</h2>
                                                        </div>
                                                        <ul className="list-group list-group-flush">
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Acreedor: </span><span className="text-right">{x.nombreAcreedor}</span></li>
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Cédula del Acreedor: </span><span className="text-right">{x.idAcreedor}</span></li>
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Creado el: </span><span className="text-right">{new Date(x.fechaCreacion).getDate()}/{new Date(x.fechaCreacion).getMonth() + 1}/{new Date(x.fechaCreacion).getFullYear()}</span></li>
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                            <li className="list-group-item"><span className="text-left font-weight-bold">Fecha de vencimiento: </span><span className="text-right">{new Date(x.fechaVencimiento).getDate()}/{new Date(x.fechaVencimiento).getMonth() + 1}/{new Date(x.fechaVencimiento).getFullYear()}</span></li>
                                                        </ul>
                                                        <div className="card-body">
                                                        <Link to={{ pathname: '/pagare/crear/', state: { rol: 'deudor', pagare: x,escenario: this.context.escenario, usuario: { nombre: this.state.nombre, cedula: this.state.cedulaUsuario } } }} ><button className={`but-solid ${this.etapaLevel(2)}`} style={{ borderColor: this.etapaColor(2) }}>Firmar</button></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                            </div>
                                            );
                                        }

                                    })}
                                </React.Fragment>
                            ) : (
                                    <div className="col-md-12"
                                        style={{ marginTop: "2em", width: "100%" }}>
                                        <div className="card" style={{ textAlign: "center" }}>
                                            <div className="card-body">
                                                <p className="card-text">
                                                    No tiene deudas en forma de pagaré en este momento.
                                        </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    &nbsp;
                </div>
                <div className="row align-content-start">
                    <div className="col-lg-6 col-6 col-md-6">
                        {this.state.pagaresAfavor.length !== 0
                            ? <div className="col-lg-8 col-8 col-md-8">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item active" aria-current="page"><h5 className="favor">Total a Favor:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${this.state.totalCobro}</h5></li>
                                    </ol>
                                </nav>
                            </div>
                            : <div></div>}
                    </div>
                    <div className="col-lg-6 col-6 col-md-6">
                        {this.state.pagaresEnContra.length !== 0
                            ? <div className="col-lg-8 col-8 col-md-8">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item active" aria-current="page"><h5 className="contra">Total en Contra:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${this.state.totalDeuda < 0 ? 0 : this.state.totalDeuda}</h5></li>
                                    </ol>
                                </nav>
                            </div>
                            : <div></div>
                        }
                    </div>
                </div>
                <Switch>
                    <PrivateRoute exact path="/pagare/crear/:rol" component={(props) => <CrearPagare {...props} getUsuario={this.getUsuario} />} getUsuario={this.getUsuario} />
                </Switch>
                
            </div>
        );
    }

    renderNormal() {
        return (
            <div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-6 col-6 col-md-6 text-center ">
                        <h1 className="display-4 text-center font-weight-bold">
                            A Su Favor
                        </h1>
                    </div>
                    <div className="col-lg-6 col-6 col-md-6 text-center">
                        <h1 className="display-4 text-center font-weight-bold">
                            Usted Debe
                        </h1>
                    </div>
                </div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-2 col-2 col-md-2"></div>
                    <div className="col-lg-2 col-2 col-md-2">
                        <Link to={{ pathname: '/pagare/crear/', state: { rol: 'acreedor', usuario: { nombre: this.state.nombre, cedula: this.state.cedulaUsuario } } }}  ><button className="but-solid">Crear Pagaré como Acreedor </button></Link>
                    </div>
                    <div className="col-lg-2 col-2 col-md-2"></div>
                    <div className="col-lg-2 col-2 col-md-2"></div>
                    <div className="col-lg-2 col-2 col-md-2">
                        <Link to={{ pathname: '/pagare/crear/', state: { rol: 'deudor', usuario: { nombre: this.state.nombre, cedula: this.state.cedulaUsuario } } }}><button className="but-solid">Crear Pagaré como Deudor</button></Link>
                    </div>
                    <div className="col-lg-2 col-2 col-md-2"></div>
                </div>
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-6 col-6 col-md-6 text-center ">
                        <div className="row" id="CardsContainer">
                            {this.state.pagaresAfavor.length > 0 ? (
                                <React.Fragment>
                                    {this.state.pagaresAfavor.map((x, i) => {
                                        if (x.etapa > 3) {
                                            return (
                                                <div key={i}>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                    <div
                                                        className="col-lg-4 col-md-8 col-sd-12"
                                                        style={{ marginTop: "2em" }}>
                                                        <div className="card" style={{ width: "18em" }}>
                                                            <div className="card-body">
                                                                <p className="card-text text-left" style={{ fontWeight: "bold" }}>Pagaré #{x._id}</p>
                                                                <h2 className="card-title">${x.valor}</h2>
                                                            </div>
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Deudor: </span><span className="text-right">{x.nombreDeudor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Cédula del Deudor: </span><span className="text-right">{x.idDeudor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Creado el: </span><span className="text-right">{new Date(x.fechaCreacion).getDate()}/{new Date(x.fechaCreacion).getMonth() + 1}/{new Date(x.fechaCreacion).getFullYear()}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Fecha de Expiración: </span><span className="text-right">{new Date(x.fechaExpiracion).getDate()}/{new Date(x.fechaExpiracion).getMonth() + 1}/{new Date(x.fechaExpiracion).getFullYear()}</span></li>
                                                            </ul>
                                                            <div className="card-body">
                                                                <Link to={{ pathname: '/pagareDetail', state: { rol: 'acreedor', pagare: x, usuario: { nombre: this.state.nombre, cedula: this.state.cedulaUsuario } } }} ><button className={`but-solid`}>Ver en Detalle</button></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                </div>

                                            );
                                        } else {
                                            return (
                                                <div key={i}>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                    <div
                                                        className="col-lg-4 col-md-8 col-sd-12"
                                                        style={{ marginTop: "2em" }}>
                                                        <div className="card" style={{ width: "18em" }}>
                                                            <div className={`card-body ${this.etapaLevel(x.etapa)}`} >
                                                                <p className="card-text text-left" style={{ color: "white" }}>Pagaré #{x._id}</p>
                                                                <h2 className={`card-title`} style={{ color: "white" }}>Etapa: {this.etapaTexto(x.etapa)}</h2>
                                                            </div>
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Deudor: </span><span className="text-right">{x.nombreDeudor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Cédula del Deudor: </span><span className="text-right">{x.idDeudor}</span></li>
                                                                {this.renderEtapas(x)}
                                                            </ul>
                                                            <div className="card-body">
                                                                <Link to={{ pathname: '/pagare/crear/', state: { rol: 'acreedor', pagare: x, usuario: { nombre: this.state.nombre, cedula: this.state.cedulaUsuario } } }}><button className={`but-solid ${this.etapaLevel(x.etapa)}`} style={{ borderColor: this.etapaColor(x.etapa) }} >Dar siguiente paso</button></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div></div>
                                            );
                                        }

                                    })}
                                </React.Fragment>
                            ) : (
                                    <div className="col-md-12"
                                        style={{ marginTop: "2em", width: "100%" }}>
                                        <div className="card" style={{ textAlign: "center" }}>
                                            <div className="card-body">
                                                <p className="card-text">
                                                    No tiene pagarés a su favor en este momento
                                        </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                    <div className="col-lg-6 col-6 col-md-6 text-center ">
                        <div className="row" id="CardsContainer">
                            {this.state.pagaresEnContra.length > 0 ? (
                                <React.Fragment>
                                    {this.state.pagaresEnContra.map((x, i) => {
                                        if (x.etapa >= 4) {
                                            return (
                                                <div key={i}>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                    <div
                                                        className="col-lg-4 col-md-8 col-sd-12"
                                                        style={{ marginTop: "2em" }}>
                                                        <div className="card" style={{ width: "18em" }}>
                                                            <div className="card-body">
                                                                <p className="card-text text-left" style={{ fontWeight: "bold" }}>Pagaré #{x._id}</p>
                                                                <h2 className="card-title">${x.valor}</h2>
                                                            </div>
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Acreedor: </span><span className="text-right">{x.nombreAcreedor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Cédula del Acreedor: </span><span className="text-right">{x.idAcreedor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Creado el: </span><span className="text-right">{new Date(x.fechaCreacion).getDate()}/{new Date(x.fechaCreacion).getMonth() + 1}/{new Date(x.fechaCreacion).getFullYear()}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Fecha de Expiración: </span><span className="text-right">{new Date(x.fechaExpiracion).getDate()}/{new Date(x.fechaExpiracion).getMonth() + 1}/{new Date(x.fechaExpiracion).getFullYear()}</span></li>
                                                            </ul>
                                                            <div className="card-body">
                                                                <Link to={{ pathname: '/pagareDetail/', state: { pagare: x, } }} ><button className={`but-solid`} >Ver en Detalle</button></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                </div>

                                            );
                                        } else {
                                            return (
                                                <div key={i}>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                    <div
                                                        className="col-lg-4 col-md-8 col-sd-12"
                                                        style={{ marginTop: "2em" }}>
                                                        <div className="card" style={{ width: "18em" }}>
                                                            <div className={`card-body ${this.etapaLevel(x.etapa)}`}>
                                                                <p className="card-text text-left" style={{ color: "white" }}>Pagaré #{x._id}</p>
                                                                <h2 className={`card-title`} style={{ color: "white" }}>Etapa: {this.etapaTexto(x.etapa)}</h2>
                                                            </div>
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Acreedor: </span><span className="text-right">{x.nombreAcreedor}</span></li>
                                                                <li className="list-group-item"><span className="text-left font-weight-bold">Cédula del Acreedor: </span><span className="text-right">{x.idAcreedor}</span></li>
                                                                {this.renderEtapas(x)}
                                                            </ul>
                                                            <div className="card-body">
                                                                <Link to={{ pathname: '/pagare/crear/', state: { rol: 'deudor', pagare: x, usuario: { nombre: this.state.nombre, cedula: this.state.cedulaUsuario } } }} ><button className={`but-solid ${this.etapaLevel(x.etapa)}`} style={{ borderColor: this.etapaColor(x.etapa) }}>Dar siguiente paso</button></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                                </div>
                                            );
                                        }

                                    })}
                                </React.Fragment>
                            ) : (
                                    <div className="col-md-12"
                                        style={{ marginTop: "2em", width: "100%" }}>
                                        <div className="card" style={{ textAlign: "center" }}>
                                            <div className="card-body">
                                                <p className="card-text">
                                                    No tiene deudas en forma de pagaré en este momento.
                                        </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    &nbsp;
                </div>
                <div className="row align-content-start">
                    <div className="col-lg-6 col-6 col-md-6">
                        {this.state.pagaresAfavor.length !== 0
                            ? <div className="col-lg-8 col-8 col-md-8">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item active" aria-current="page"><h5 className="favor">Total a Favor:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${this.state.totalCobro}</h5></li>
                                    </ol>
                                </nav>
                            </div>
                            : <div></div>}
                    </div>
                    <div className="col-lg-6 col-6 col-md-6">
                        {this.state.pagaresEnContra.length !== 0
                            ? <div className="col-lg-8 col-8 col-md-8">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item active" aria-current="page"><h5 className="contra">Total en Contra:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${this.state.totalDeuda < 0 ? 0 : this.state.totalDeuda}</h5></li>
                                    </ol>
                                </nav>
                            </div>
                            : <div></div>
                        }
                    </div>
                </div>
                <Switch>
                    <PrivateRoute exact path="/pagare/crear/:rol" component={(props) => <CrearPagare {...props} getUsuario={this.getUsuario} />} getUsuario={this.getUsuario} />
                </Switch>
            </div>
        )
    }

    render() {
        return (
            <div className="host">
                {this.context.escenario === 'Ether'
                    ? this.renderEther()
                    : this.renderNormal()}
            </div>);
    }
}

Balance.contextType = EscenarioContext;

export default Balance;