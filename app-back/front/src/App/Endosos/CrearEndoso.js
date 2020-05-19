import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import jsPDF from 'jspdf';
import Eth from 'ethjs-query';
import EthContract from 'ethjs-contract';
import { CircleToBlockLoading } from 'react-loadingg';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Web3 from 'web3';
import { EscenarioContext} from '../Context/context';
import { abi, address, abiEther, addressEther} from '../metamask/abi.js';

import 'react-toastify/dist/ReactToastify.css';
import './CrearEndoso.css';

class CrearEndoso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            codigo_retiro: "",
            confirmacion_transaccion: "",
            es_ultimo_endoso: null,
            etapa: 3,
            fecha: new Date(),
            firma: "",
            hash_transaccion: "",
            id_anterior_endoso: "",
            id_endosante: 0,
            id_endosatario: 0,
            id_pagare: "",
            nombre_endosante: "",
            nombre_endosatario: "",
            redirect: false,
            endososAnteriores: [],
            pdf: {},
            contrasenia: "",
            isSame: false,
            isweb3: false,
            account : '',
            show: false,
            show2:false,
        }
        this.setUpPDF = this.setUpPDF.bind(this);
        this.renderEtapa1 = this.renderEtapa1.bind(this);
        this.renderEtapa2 = this.renderEtapa2.bind(this);
        this.renderEtapa3 = this.renderEtapa3.bind(this);
        this.handleChangeEtapa1 = this.handleChangeEtapa1.bind(this);
        this.handleEtapa1 = this.handleEtapa1.bind(this);
        this.handleChangeEtapa2 = this.handleChangeEtapa2.bind(this);
        this.handleChangeContrasenia = this.handleChangeContrasenia.bind(this);
        this.handleEtapa2 = this.handleEtapa2.bind(this);
        this.handleEtapa3 = this.handleEtapa3.bind(this);
        this.isWeb3 = this.isWeb3.bind(this);
        this.waitForTxToBeMined = this.waitForTxToBeMined.bind(this);
        this.getConfirmation = this.getConfirmation.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            let pagare = this.props.location.state.pagare;
            axios.get(`/endosos/pagare/${pagare._id}`, { headers: this.state.headers })
                .then(response => {
                    this.setState({
                        endososAnteriores: response.data,
                    });
                    this.setUpPDF(pagare, endoso, response.data);
                });
            let endoso = this.props.location.state.endoso;
            let endoso2 = this.props.location.state.endoso2;
            if(endoso2 !== undefined){
                this.setState({
                    _id:"",
                    codigo_retiro: "",
                    confirmacion_transaccion:"",
                    es_ultimo_endoso: null,
                    etapa: 0,
                    fecha: "",
                    firma: "",
                    hash_transaccion: "",
                    id_anterior_endoso: "",
                    id_endosante: endoso2.id_endosatario,
                    id_endosatario: 0,
                    id_pagare: endoso2.id_pagare,
                    nombre_endosante: endoso2.nombre_endosatario,
                    nombre_endosatario:"",
                    redirect: false,
                    isSame: false,
                    isContrasenia: false,
                });
            }
            else if (endoso === undefined) {
                this.setState({
                    _id: "",
                    codigo_retiro: "",
                    confirmacion_transaccion: "",
                    es_ultimo_endoso: null,
                    etapa: 0,
                    fecha: "",
                    firma: "",
                    hash_transaccion: "",
                    id_anterior_endoso: "",
                    id_endosante: pagare.idAcreedor,
                    id_endosatario: 0,
                    id_pagare: pagare._id,
                    nombre_endosante: pagare.nombreAcreedor,
                    nombre_endosatario: "",
                    redirect: false,
                });
            } else if (endoso !== undefined) {
                this.setState({
                    _id: endoso._id,
                    codigo_retiro: endoso.codigo_retiro,
                    confirmacion_transaccion: endoso.confirmacion_transaccion,
                    es_ultimo_endoso: endoso.es_ultimo_endoso,
                    etapa: endoso.etapa,
                    fecha: endoso.fecha,
                    firma: endoso.firma,
                    hash_transaccion: endoso.hash_transaccion,
                    id_anterior_endoso: endoso.id_anterior_endoso,
                    id_endosante: endoso.id_endosante,
                    id_endosatario: endoso.id_endosatario,
                    id_pagare: endoso.id_pagare,
                    nombre_endosante: endoso.nombre_endosante,
                    nombre_endosatario: endoso.nombre_endosatario,
                    redirect: false,
                    isSame: false,
                    isContrasenia: false,
                });
            }
        } else {
            this.setState({
                redirect: true
            })
        }
        this.isWeb3();
    }

    redirect() {
        if (this.state.redirect) {
            return <Redirect to='/balance' />
        }
    }

    isWeb3() {
        if (typeof window.web3 !== 'undefined') {
            let newWeb3 = new Web3(window.web3.currentProvider);
            newWeb3.eth.getAccounts().then(accounts => {
                if (accounts.length !== 0) {
                    let userAddress = accounts[0];
                    this.setState({
                        account: userAddress,
                    })
                }
            });
            this.setState({
                isweb3: true,
            })
        }
    }

    setUpPDF(pagare, endoso, endososAnteriores) {
        let creacion = new Date(pagare.fechaCreacion)
        let dia = creacion.getDate().toString();
        let mes = creacion.getMonth().toString();
        let anio = creacion.getFullYear().toString();
        let counter = 0;
        let endososPasados = endososAnteriores;
        const doc = new jsPDF();
        doc.setFontSize(15);
        doc.text(10, 25, `Pagaré No.  ${pagare._id}`);
        doc.setFontSize(12);
        doc.text(10, 35, `Yo ${pagare.nombreDeudor} idenficado con la cedula de ciudadanía ${pagare.idDeudor} me obligo `);
        doc.text(10, 42, `a pagar solidaria e incondicionalmente a favor de ${pagare.nombreAcreedor} `);
        doc.text(10,49, 'o de quien represente sus derechos');
        doc.text(10, 56, `o al tenedor legitimo del presente titulo valor en la ciudad de ${pagare.lugarCreacion} la suma de`);
        doc.text(10, 63, `${pagare.valor} pesos moneda corriente el día ${dia} del mes de ${mes} del ${anio}. `)
        doc.text(10, 77, `Autorizo irrevocablemente a ${pagare.nombreAcreedor} o a quien represente sus derechos`)
        doc.text(10, 84, `o al tenedor legítimo del presente título valor para declarar el plazo vencido el presente`)
        doc.text(10, 91, `pagaré y que para tal evento proceda inmediatamente.`)
        doc.text(10, 260, `Firma: ${pagare.firma}`)
        doc.text(10, 270, `Cedula: ${pagare.idDeudor}`)
        doc.addPage();
        for (let x in endososPasados) {
            if(endososPasados[x]._id !== this.state._id){
                doc.text(10, 25 + counter, `Endosante: ${endososPasados[x].nombre_endosante}`)
                doc.text(10, 32 + counter, `Cedula Endosante: ${endososPasados[x].id_endosante}`)
                doc.text(10, 39 + counter, `Endosatario: ${endososPasados[x].nombre_endosatario}`)
                doc.text(10, 46 + counter, `Cedula Endosatario: ${endososPasados[x].id_endosatario}`)
                doc.text(10, 53 + counter, `Fecha Endoso: ${dia}/${mes}/${anio}`)
                doc.text(10, 60 + counter, `Firma: ${endososPasados[x].firma}`)
                counter += 60;
            }
        }
        if (endoso !== undefined) {
            doc.setTextColor(255, 0, 0);
            doc.text(10, 25 + counter, `Endoso Pendiente:`)
            doc.setTextColor(0,0,0);
            doc.text(10, 32 + counter, `Endosante: ${endoso.nombre_endosante}`)
            doc.text(10, 39 + counter, `Cedula Endosante: ${endoso.id_endosante}`)
            doc.text(10, 46 + counter, `Endosatario: ${endoso.nombre_endosatario}`)
            doc.text(10, 53 + counter, `Cedula Endosatario: ${endoso.id_endosatario}`)
        }
        const pdf = doc.output('datauristring');
        this.setState({
            pdf: pdf,
        });
    }

    isSuccessful(pEtapa, element) {
        if (element === 'card') {
            if (pEtapa < this.state.etapa) {
                return 'btn-success';
            } else {
                return '';
            }
        } else if (element === 'title') {
            if (pEtapa < this.state.etapa) {
                return '-success';
            } else if (pEtapa === this.state.etapa) {
                return '';
            } else {
                return '-ongoing';
            }
        }

    }

    isDisabled(pEtapa, element) {
        if (element === 'card') {

            if (pEtapa === this.state.etapa) {
                return '';
            } else {
                return 'collapsed'
            }
        } else if (element === 'aria') {
            if (pEtapa === this.state.etapa) {
                return true;
            } else {
                return false;
            }
        } else if (element === 'accordion') {
            if (pEtapa === this.state.etapa) {
                return 'collapse show';
            } else {
                return 'collapse';
            }
        } else if (element === 'input') {
            if (pEtapa !== this.state.etapa) {
                return true;
            } else {
                return false;
            }
        } else if (element === 'button') {
            if (pEtapa > this.state.etapa) {
                return true;
            } else {
                return false;
            }
        } else if (element === 'submit') {
            if (pEtapa < this.state.etapa) {
                return 'hidden';
            } else {
                return 'visible';
            }
        }


    }

    placeholder(pEtapa, input) {
        if (input === 'nombre_endosante') {
            if (this.state.nombre_endosante !== "") {
                return `${this.state.nombre_endosante}`;
            } else {
                return 'Nombre del Endosante';
            }
        }
        if (input === 'id_endosante') {
            if (this.state.id_endosante !== 0) {
                return `${this.state.id_endosante}`;
            } else {
                return 'Cedula del Endosante';
            }
        }
        if (input === 'nombre_endosatario') {
            if (this.state.nombre_endosatario !== "") {
                return `${this.state.nombre_endosatario}`;
            } else {
                return 'Nombre del Endosatario';
            }
        }
        if (input === 'id_endosatario') {
            if (this.state.id_endosatario !== 0) {
                return `${this.state.id_endosatario}`;
            } else {
                return 'Cedula del Endosatario';
            }
        }
        if (input === 'codigo_retiro') {
            if (pEtapa > 2) {
                return `$${this.state.codigo_retiro}`;
            } else {
                return 'Codigo Retiro'
            }
        }

    }

    handleChangeEtapa1(event) {
        let target = event.target;
        let value = target.value;
        let name = target.name;
        if (name === 'id_endosatario' || name === 'id_endosante') {
            value = parseInt(value, 10);

        }
        if (name === 'id_endosatario' && value === this.state.id_endosante) {
            this.setState({
                isSame: true,
            });
        } else if (name === 'id_endosatario' && value !== this.state.id_endosante) {
            this.setState({
                isSame: false,
            });
        }

        this.setState({
            [name]: value,
        });

    }

    async handleEtapa1(event) {
        event.preventDefault();
        var data = {
            nombre_endosante: this.state.nombre_endosante,
            id_endosante: this.state.id_endosante,
            nombre_endosatario: this.state.nombre_endosatario,
            id_endosatario: this.state.id_endosatario,
        }

        await axios.post(
            `/endosos/pagare/${this.state.id_pagare}/etapa1`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {

            let endoso = response.data;
            this.setState({
                id_endosatario: endoso.id_endosatario,
                nombre_endosatario: endoso.nombre_endosatario,
                etapa: endoso.etapa,
            });


        }).catch(err => {
            if(err.response.status === 401){
                toast.error("El pagaré ya está en un proceso de endoso");
                setTimeout(()=>{
                    this.setState({
                        redirect :true,
                    });
                },5000);
            }
        })
    }

    renderEtapa1() {
        return (
            <div id="accordion">
                <div className="card">
                    <div className="card-header" id="etapa1">
                        <div className="col-md-10">
                            <button className={`btn ${this.isSuccessful(0, 'card')}  ${this.isDisabled(0, 'card')}`} data-toggle="collapse" data-target="#etapa1Collapse" aria-expanded={this.isDisabled(0, 'aria')} aria-controls="etapa1Collapse" disabled={this.isDisabled(0, 'button')}>
                                <h5 className={`title-card${this.isSuccessful(0, 'title')}`}>Información Básica</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa1Collapse" className={`collapse ${this.isDisabled(0, 'accordion')}`} aria-labelledby="etapa1" data-parent="#accordion">
                        <div className="row">
                            <form>
                                <div className="row">
                                    <div className="col-1 col-md-1 col-lg-1"></div>
                                    <div className="col-5 col-md-5 col-lg-5">
                                        <div className="form-group">
                                            <label htmlFor="nombre_endosante">Nombre del Endosante</label>
                                            <input name="nombre_endosante" type="text" className="form-control" id="nombre_endosante" onChange={this.handleChangeEtapa1} aria-describedby="nombre_endosante" placeholder={this.placeholder(0, 'nombre_endosante')} disabled={true} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="id_endosante">Cédula del Endosante</label>
                                            <input name="id_endosante" type="number" min="0" className="form-control" id="id_endosante" onChange={this.handleChangeEtapa1} placeholder={this.placeholder(0, 'id_endosante')} disabled={true} />
                                        </div>

                                    </div>
                                    <div className="col-5 col-md-5 col-lg-5">
                                        <div className="form-group">
                                            <label htmlFor="nombre_endosatario">Nombre del Endosatario</label>
                                            <input name="nombre_endosatario" type="text" className="form-control" id="nombre_endosatario" onChange={this.handleChangeEtapa1} aria-describedby="nombre_endosatario" placeholder={this.placeholder(0, 'nombre_endosatario')} disabled={this.isDisabled(0, 'button')} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="id_endosatario">Cédula del Endosatario</label>
                                            <input name="id_endosatario" type="number" min="0" className="form-control" id="id_endosatario" onChange={this.handleChangeEtapa1} placeholder={this.placeholder(0, 'id_endosatario')} disabled={this.isDisabled(0, 'button')} />
                                        </div>
                                    </div>
                                    <div className="col-1 col-md-1 col-lg-1"></div>
                                </div>
                                <div className="row">
                                    <div className="col-3 col-md-3 col-lg-5"></div>
                                    <div className="col-6 col-md-6 col-lg-6">
                                        <button type="submit" className="btn btn-primary" onClick={this.handleEtapa1} style={{ visibility: this.isDisabled(0, 'submit') }} disabled={this.state.isSame}>Siguiente Paso</button>
                                    </div>
                                    <div className="col-1 col-md-1 col-lg-1"></div>
                                </div>

                            </form>
                        </div>
                        <div className="row">&nbsp;</div>
                    </div>
                </div>
            </div>
        )
    }

    handleChangeEtapa2(event) {
        event.preventDefault();
        let target = event.target;
        let value = target.value;
        let name = target.name;

        this.setState({
            [name]: value,
        });
    }

    async handleEtapa2(event) {
        event.preventDefault();
        var data = {
            codigo_retiro: this.state.codigo_retiro
        }

        await axios.post(
            `/endosos/pagare/${this.state.id_pagare}/etapa2`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            let endoso = response.data;
            this.setState({
                codigo_retiro: endoso.codigo_retiro,
                etapa: endoso.etapa,
            });

        });
    }
    renderEtapa2() {

        if (this.props.getUsuario().cedula !== this.state.id_endosante) {
            return (
                <div id="accordion">
                    <div className="card">
                        <div className="card-header" id="etapa2">
                            <div className="col-md-10">
                                <button className={`btn ${this.isSuccessful(1, 'card')}  ${this.isDisabled(1, 'card')}`} data-toggle="collapse" data-target="#etapa1Collapse" aria-expanded={this.isDisabled(1, 'aria')} aria-controls="etapa1Collapse" disabled={this.isDisabled(1, 'button')}>
                                    <h5 className={`title-card${this.isSuccessful(1, 'title')}`}>Información de Retiro</h5>
                                </button>
                            </div>
                        </div>

                        <div id="etapa2Collapse" className={`collapse ${this.isDisabled(1, 'accordion')}`} aria-labelledby="etapa2" data-parent="#accordion">
                            <div className="row">
                                <form>
                                    <div className="row">
                                        <div className="col-1 col-md-1 col-lg-1"></div>
                                        <div className="col-10 col-md-10 col-lg-10">
                                            <div className="form-group">
                                                <label htmlFor="codigo_retiro">Código de Retiro</label>
                                                <input name="codigo_retiro" type="text" className="form-control" id="codigo_retiro" onChange={this.handleChangeEtapa2} aria-describedby="codigo_retiro" placeholder={this.placeholder(1, 'codigo_retiro ')} disabled={true} disabled={this.isDisabled(1, 'button')} />
                                            </div>
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1"></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3 col-md-3 col-lg-5"></div>
                                        <div className="col-6 col-md-6 col-lg-6">
                                            <button type="submit" className="btn btn-primary" onClick={this.handleEtapa2} style={{ visibility: this.isDisabled(1, 'submit') }} >Siguiente Paso</button>
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1"></div>
                                    </div>

                                </form>
                            </div>
                            <div className="row">&nbsp;</div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div id="accordion">
                    <div className="card">
                        <div className="card-header" id="etapa2">
                            <div className="col-md-10">
                                <button className={`btn ${this.isSuccessful(1, 'card')}  ${this.isDisabled(1, 'card')}`} data-toggle="collapse" data-target="#etapa1Collapse" aria-expanded={this.isDisabled(1, 'aria')} aria-controls="etapa2Collapse" disabled={this.isDisabled(1, 'button')}>
                                    <h5 className={`title-card${this.isSuccessful(1, 'title')}`}>Información de Retiro</h5>
                                </button>
                            </div>
                        </div>

                        <div id="etapa2Collapse" className={`collapse ${this.isDisabled(1, 'accordion')}`} aria-labelledby="etapa2" data-parent="#accordion">
                            <div className="row">
                                <form>
                                    <div className="row">
                                        <div className="col-1 col-md-1 col-lg-1"></div>
                                        <div className="col-5 col-md-5 col-lg-5">
                                            <p>&nbsp;</p>
                                            <h3 className="text-left font-weight-bold">Esperando el código para retirar el dinero</h3>
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1"></div>
                                    </div>
                                </form>
                            </div>
                            <div className="row">&nbsp;</div>
                        </div>
                    </div>
                </div>
            )
        }

    }


    async handleChangeContrasenia(event) {
        event.preventDefault();
        let { usuario } = this.props.location.state;
        this.setState({
            contrasenia: event.target.value,
        });
        await axios.post(
            '/users/login',
            {
                "cedula": usuario.cedula,
                "contrasenia": event.target.value,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {

            if (response.data.success) {
                this.setState({
                    isContrasenia: true,
                });
            } else {
                this.setState({
                    isContrasenia: false,
                });
            }

        }).catch(err => {
        })
    }

    handleEtapa3(event) {
        event.preventDefault();
        let fecha = new Date();
        let fechaString = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
        if(this.context.escenario === 'Ether'){

        }else{
            const eth = new Eth(window.web3.currentProvider);
            const account = this.state.account;
            const contract = new EthContract(eth);
            const MiniToken = contract(abi);
            const miniToken = MiniToken.at(address);
            let endosante = `${this.state.id_endosante}, ${this.state.nombre_endosante}`;
            let endosatario = `${this.state.id_endosatario}, ${this.state.nombre_endosatario}`;
            let pagare = `${this.state.id_pagare}`;
            let firma = "N/A";
            let idEndoso = `${this.state._id}`;
            miniToken.endosarPagare(endosante, endosatario,pagare,fechaString,firma, idEndoso, {from: account})
                .then((txHash)=>{
                    this.waitForTxToBeMined(txHash);
                }).catch(error => {
                    console.log(error);
                    this.setState({
                        show2: true,
                    });
                });
        }
    }

    waitForTxToBeMined(txHash) {
        var self = this;
        this.setState({
            show: true,
        });
        setTimeout(function () {
            self.getConfirmation(txHash);
        }, 10000);
    };

    getConfirmation(txHash) {
        let eth = window.web3.eth;
        var self = this;
        let data = {
            firma: txHash,
        }
        let txReceipt;
        eth.getTransactionReceipt(txHash, function (error, result) {
            if (!error) {
                txReceipt = result;
                if (txReceipt != null) {
                    axios.post(
                        `/endosos/pagare/${self.state.id_pagare}/etapa3`,
                        data,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    ).then(response => {
                        self.setState({
                            isContrasenia: false,
                            redirect: true,
                        });
                    });
                } else {
                    self.waitForTxToBeMined(txHash);
                }

            }
            else
                console.error(error);
        });
    }

    renderEtapa3() {
        if (this.state.id_endosante === this.props.getUsuario().cedula) {
            return (
                <div id="accordion">
                    <div className="card">
                        <div className="card-header" id="etapa3">
                            <div className="col-md-10">
                                <button className={`btn ${this.isSuccessful(2, 'card')}  ${this.isDisabled(2, 'card')}`} data-toggle="collapse" data-target="#etapa3Collapse" aria-expanded={this.isDisabled(2, 'aria')} aria-controls="etapa3Collapse" disabled={this.isDisabled(2, 'button')} >
                                    <h5 className={`title-card${this.isSuccessful(2, 'title')}`}>Firma</h5>
                                </button>
                            </div>
                        </div>

                        <div id="etapa3Collapse" className={`collapse ${this.isDisabled(2, 'accordion')}`} aria-labelledby="etapa4" data-parent="#accordion">
                            <div className="row">
                                <div className="col-1 col-md-1 col-lg-1"></div>
                                <div className="col-5 col-md-5 col-lg-5">
                                    <p>&nbsp;</p>
                                    <p className="text-center font-weight-bold">Antes de Firmar por favor revisa la previsualización del pagaré y su endoso en la segunda página.</p>
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="contrasenia">Digite su contraseña para poder firmar:</label>
                                            <input name="contrasenia" type="password" onChange={this.handleChangeContrasenia} className="form-control" id="contrasenia" placeholder="Contraseña" disabled={this.isDisabled(2, 'input')} />
                                        </div>
                                        <button name="firmar" type="submit" className="btn btn-success" onClick={this.handleEtapa3} disabled={!this.state.isContrasenia} >Firmar</button>
                                    </form>
                                </div>
                                <div className="col-6 col-md-6 col-lg-6"></div>
                            </div>
                            <div className="row">&nbsp;</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div id="accordion">
                    <div className="card">
                        <div className="card-header" id="etapa3">
                            <div className="col-md-10">
                                <button className={`btn ${this.state.etapa === 2 ? 'btn-warning' : ''}  ${this.isDisabled(2, 'card')}`} data-toggle="collapse" data-target="#etapa3Collapse" aria-expanded={this.isDisabled(2, 'aria')} aria-controls="etapa3Collapse" disabled={this.isDisabled(2, 'button')}>
                                    <h5 className={`title-card-${this.state.etapa === 2 ? 'success' : 'ongoing'}`}>Firma</h5>
                                </button>
                            </div>
                        </div>

                        <div id="etapa3Collapse" className={`collapse ${this.isDisabled(2, 'accordion')}`} aria-labelledby="etapa3" data-parent="#accordion">
                            <div className="row">
                                <div className="col-1 col-md-1 col-lg-1"></div>
                                <div className="col-5 col-md-5 col-lg-5">
                                    <p>&nbsp;</p>
                                    <h3 className="text-left font-weight-bold">Esperando la firma del Endosante</h3>
                                </div>
                                <div className="col-6 col-md-6 col-lg-6"></div>
                            </div>
                            <div className="row">&nbsp;</div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    renderPDF() {
        const pdf = this.state.pdf;
        return (
            <div style={{
                height: '650px',
                position: 'relative',
                zIndex: 999,
                border: '1px solid #000',
            }}>
                <embed className="pdfobject" src={pdf} type="application/pdf" style={{
                    overflow: 'auto',
                    width: '100%',
                    height: '100%',
                }} internalinstanceid="30"></embed>
                {/*
                <iframe title="preview" src={pdf} style={{
                    width: '100%',
                    height: '700px',
                }} frameBorder="0"></iframe>
            */}
            </div>
        )
    }

    render() {
        return (<div className="content-body host">
            {this.redirect()}
            <div className="row">
                <div className="col-md-6 col-6 col-lg-6">
                    <h1 className="display-4 text-center font-weight-bold">
                        Pasos por completar
                    </h1>
                </div>
                <div className="col-md-6 col-6 col-lg-6">
                    <h1 className="display-4 text-center font-weight-bold">
                        Previsualización en PDF
                </h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-6 col-lg-6">
                    <div className="row">&nbsp;</div>
                    {this.renderEtapa1()}
                    <div className="row">&nbsp;</div>
                    {this.renderEtapa2()}
                    <div className="row">&nbsp;</div>
                    {this.renderEtapa3()}
                    <div className="row">&nbsp;</div>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
                <div className="col-md-6 col-lg-6 col-6">
                    {this.renderPDF()}
                </div>
                <Modal show={this.state.show}>
                    <Modal.Header>
                        <Modal.Title>Esperando confirmación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <h6>&nbsp;Se está confirmando la creación del endoso, cuando se confirme te redigiremos a tu balance.</h6>
                        </div>
                        <div className="row">
                            &nbsp;
                </div>
                        <div className="row">
                            &nbsp;
                </div>
                        <Modal.Footer>
                            <div className="row">
                                <CircleToBlockLoading size={35} />
                            </div>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.show2} onHide={() => { this.setState({ show2: false }) }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Transacción rechazada</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <h6>&nbsp;Rechazaste la transacción</h6>
                            </div>
                            <div className="row">
                                &nbsp;
                </div>
                            <div className="row">
                                <h6>&nbsp;Para firmar el endoso necesitas confirmar la transacción</h6>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="but-solid" onClick={() => { this.setState({ show2: false }) }}>
                                Cerrar
                </Button>
                        </Modal.Footer>
                    </Modal>
            </div>

        </div>);
    }
}

CrearEndoso.contextType = EscenarioContext;

export default CrearEndoso;