import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import ENS from 'ethereum-ens';
import Web3 from 'web3';
import { CircleToBlockLoading } from 'react-loadingg';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Eth from 'ethjs-query';
import EthContract from 'ethjs-contract';
import { address2, abi2 } from '../metamask/abi.js';
import { EscenarioContext } from '../Context/context';

import './Registrar.css';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const correoRegex = RegExp(/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        (val) => {
            if (val.length > 0) {
                valid = false;
            }
        }
    );
    return valid;
}

class Registrar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cedula: 0,
            nombres: '',
            apellidos: '',
            correo: '',
            contrasenia: '',
            errors: false,
            errores: {
                cedula: '',
                correo: '',
                contrasenia: '',
            },
            isWeb3: false,
            browser: '',
            isUser: false,
            address: "",
            show: false,
            show2: false,
            domain: '',
            domainSubmit: '',
            modalState: 'subdominio',
            alreadyRegistered: false,
        }

        this.handleCedula = this.handleCedula.bind(this);
        this.handleNombres = this.handleNombres.bind(this);
        this.handleCorreo = this.handleCorreo.bind(this);
        this.handleApellidos = this.handleApellidos.bind(this);
        this.handleContrasenia = this.handleContrasenia.bind(this);
        this.handleDomain = this.handleDomain.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.confirmarENS = this.confirmarENS.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.waitForTxToBeMined = this.waitForTxToBeMined.bind(this);
        this.getConfirmation = this.getConfirmation.bind(this);
    }

    componentDidMount() {
        let isweb3 = typeof window.web3 !== 'undefined';
        let browser = "https://metamask.io/download.html";
        let isuser = false;
        if (typeof window.web3 !== 'undefined') {
            let newWeb3 = new Web3(window.web3.currentProvider);
            const ens = new ENS(window.web3.currentProvider);
            window.ethereum.enable()
                .then(enabled => {
                        setInterval(() => {
                            newWeb3.eth.getAccounts().then(accounts => {
                                if (accounts.length !== 0 && accounts[0] !== this.state.address) {
                                    isuser = true;
                                    let userAddress = accounts[0];
                                    if(this.context.escenario === "Ens"){
                                        ens.reverse(userAddress).name()
                                        .then(response => {
                                            ens.resolver(response).addr()
                                                .then(dir => {
                                                    if (dir === userAddress) {
                                                        this.setState({
                                                            isUser: isuser,
                                                            address: userAddress,
                                                            domain: response,
                                                            domainSubmit: 'propio'
                                                        });
                                                    } else {
                                                        this.setState({
                                                            isUser: isuser,
                                                            address: userAddress,
                                                            domainSubmit: 'nuevo'
                                                        });
                                                    }
                                                })
                                                .catch(error => {
                                                    console.log(error);
                                                    this.setState({
                                                        isUser: isuser,
                                                        address: userAddress,
                                                        domainSubmit: 'nuevo'
                                                    });
                                                });
                                        })
                                        .catch(error => {
                                            console.log(error);
                                            this.setState({
                                                isUser: isuser,
                                                address: userAddress,
                                                domainSubmit: 'nuevo'
                                            });
                                        });
                                    }else if(this.context.escenario !== "Ether" && accounts[0] !== this.state.address){
                                        axios.get(`/users/direccion/${userAddress}`)
                                        .then(response => {
                                            if (response.data === null) {
                                                this.setState({
                                                    alreadyRegistered: false,
                                                    isUser: true,
                                                    address: userAddress,
                                                });
                                            } else {
                                                this.setState({
                                                    alreadyRegistered: true,
                                                    isUser: true,
                                                    address: userAddress,
                                                })
                                            }
                                        });
                                    }
                                    

                                } else if (accounts.length === 0) {
                                    this.setState({
                                        isUser: false,
                                    })
                                }
                            });

                        }, 100);
                })
                .catch(error => {
                    this.setState({ show2: true });
                });
        }
        if (typeof InstallTrigger !== 'undefined') {
            browser = "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";
        }
        if (!!window.chrome) {
            browser = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en";
        }
        this.setState({
            isWeb3: isweb3,
            browser: browser,
        });

    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errores;

        switch (name) {
            case 'correo':
                errors.correo =
                    correoRegex.test(value)
                        ? ''
                        : 'El correo ingresado no es valido';
                break;
            case 'contrasenia':
                errors.contrasenia =
                    value.length < 6
                        ? 'Contraseña ingresada es muy corta'
                        : '';

                break;
            default:
        }
    }

    handleDomain(event) {
        this.setState({ domainSubmit: event.target.value })
    }

    handleCedula(event) {
        this.handleChange(event);
        this.setState({
            cedula: parseInt(event.target.value, 10),
            nombres: this.state.nombres,
            apellidos: this.state.apellidos,
            correo: this.state.correo,
            contrasenia: this.state.contrasenia,
            errors: false,
        })
    }

    handleNombres(event) {
        this.handleChange(event);
        this.setState({
            cedula: this.state.cedula,
            nombres: event.target.value,
            apellidos: this.state.apellidos,
            correo: this.state.correo,
            contrasenia: this.state.contrasenia,
            errors: false,
        })
    }

    handleApellidos(event) {
        this.handleChange(event);
        this.setState({
            cedula: this.state.cedula,
            nombres: this.state.nombres,
            apellidos: event.target.value,
            correo: this.state.correo,
            contrasenia: this.state.contrasenia,
            errors: false,
        })
    }

    handleCorreo(event) {
        this.handleChange(event);
        this.setState({
            cedula: this.state.cedula,
            nombres: this.state.nombres,
            apellidos: this.state.apellidos,
            correo: event.target.value,
            contrasenia: this.state.contrasenia,
            errors: false,
        })
    }
    handleContrasenia(event) {
        this.handleChange(event);
        this.setState({
            cedula: this.state.cedula,
            nombres: this.state.nombres,
            apellidos: this.state.apellidos,
            correo: this.state.correo,
            contrasenia: event.target.value,
            errors: false,
        })
    }

    async registrar(cedula, nombres, apellidos, correo, contrasenia, address) {
        if (this.state.domainSubmit === 'propio') {
            let domain = this.state.domain;
            await axios.post(
                '/users',
                {
                    "cedula": cedula,
                    "nombres": nombres,
                    "apellidos": apellidos,
                    "correo": correo,
                    "contrasenia": contrasenia,
                    "address": address,
                    "domain": domain,
                    "propio": true,
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(response => {
                if (response.data.success) {
                    this.props.history.push('/login');
                }
                else {
                    this.setState({
                        cedula: this.state.cedula,
                        nombres: this.state.nombres,
                        apellidos: this.state.apellidos,
                        correo: this.state.correo,
                        contrasenia: this.state.contrasenia,
                        errors: true
                    });
                }
            });
        } else if (this.context.escenario !== 'Ens') {
            await axios.post(
                '/users',
                {
                    "cedula": cedula,
                    "nombres": nombres,
                    "apellidos": apellidos,
                    "correo": correo,
                    "contrasenia": contrasenia,
                    "address": address,
                    "domain": 'NA',
                    "propio": false,
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(response => {
                if (response.data.success) {
                    this.props.history.push('/login');
                }
                else {
                    this.setState({
                        cedula: this.state.cedula,
                        nombres: this.state.nombres,
                        apellidos: this.state.apellidos,
                        correo: this.state.correo,
                        contrasenia: this.state.contrasenia,
                        errors: true
                    });
                }
            });
        }
        else {
            let nombreCompleto = `${nombres}${apellidos}`;
            let nombreLower = nombreCompleto.toLowerCase();
            let nombreArray = nombreLower.split(" ");
            let subdomain = "";
            for (const element of nombreArray) {
                subdomain += element;
            }
            let domain = subdomain + '.pagaresvirtuales.test';
            await axios.post(
                '/users',
                {
                    "cedula": cedula,
                    "nombres": nombres,
                    "apellidos": apellidos,
                    "correo": correo,
                    "contrasenia": contrasenia,
                    "address": address,
                    "domain": domain,
                    "propio": false,
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            ).then(response => {
                if (response.data.success) {
                    this.confirmarENS(subdomain, address);
                }
                else {
                    this.setState({
                        cedula: this.state.cedula,
                        nombres: this.state.nombres,
                        apellidos: this.state.apellidos,
                        correo: this.state.correo,
                        contrasenia: this.state.contrasenia,
                        errors: true
                    });
                }
            });
        }


    }

    confirmarENS(subdomain, address) {
        this.setState({
            show: true,
        });
        let self = this;
        const ens = new ENS(window.web3.currentProvider);
        ens.owner(`${subdomain}.pagaresvirtuales.test`).then(res => {
            if (res !== '0x0000000000000000000000000000000000000000') {
                this.setState({
                    modalState: 'resolver',
                });
                ens.setResolver(`${subdomain}.pagaresvirtuales.test`, '0x42D63ae25990889E35F215bC95884039Ba354115', { from: address })
                    .then(responseResolver => {
                        this.setState({
                            modalState: 'address',
                        });
                        ens.resolver(`${subdomain}.pagaresvirtuales.test`).setAddr(address, { from: address })
                            .then(responseAddress => {
                                this.setState({
                                    modalState: 'name',
                                });
                                const eth = new Eth(window.web3.currentProvider);
                                const contract = new EthContract(eth);
                                const MiniToken = contract(abi2);
                                const miniToken = MiniToken.at(address2);
                                miniToken.setName(`${subdomain}.pagaresvirtuales.test`, { from: address })
                                    .then(response => {
                                        this.waitForTxToBeMined(response);
                                    }).catch(error => {
                                        console.log(error);
                                    });
                            }).catch(error => {
                                console.log(error);
                            });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                setTimeout(function () {
                    self.confirmarENS(subdomain, address);
                }, 10000);
            }
        }).catch(err => console.log);


    }

    waitForTxToBeMined(txHash) {
        var self = this;
        setTimeout(function () {
            self.getConfirmation(txHash);
        }, 10000);
    }

    getConfirmation(txHash) {
        let eth = window.web3.eth;
        var self = this;
        let txReceipt;
        eth.getTransactionReceipt(txHash, function (error, result) {
            if (!error) {
                txReceipt = result;
                if (txReceipt != null) {
                    self.props.history.push('/login');
                } else {
                    self.waitForTxToBeMined(txHash);
                }
            }
            else
                console.error(error);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.cedula !== 0 && this.state.nombres !== "" && this.state.apellidos && this.state.correo !== "" && this.state.contrasenia !== "" && validateForm(this.state.errores)) {
            this.registrar(this.state.cedula, this.state.nombres, this.state.apellidos, this.state.correo, this.state.contrasenia, this.state.address);
        }
        else {
            this.setState({
                cedula: this.state.cedula,
                nombres: this.state.nombres,
                apellidos: this.state.apellidos,
                contrasenia: this.state.contrasenia,
                correo: this.state.correo,
                error: true,
            });
        }
    }

    renderRedirect() {
        if (this.props.getUsuario()) {
            return <Redirect to='/balance' />
        }
    }

    renderModal(state) {
        if (state === 'subdominio') {
            return (
                <React.Fragment>
                    <Modal.Header>
                        <Modal.Title>Creando cuenta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <h6>&nbsp;Se está creando una cuenta con nombre de dominio, esperando confirmación.</h6>
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
                </React.Fragment>
            );
        } else if (state === 'resolver') {
            return (
                <React.Fragment>
                    <Modal.Header>
                        <Modal.Title>Asociando Resolver</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <h6>&nbsp;Se está asociando un resolver, permanece atento a avisos o notificaciones de MetaMask</h6>
                        </div>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6"><img src="https://i.ibb.co/dk2W2Xh/2.png" alt="Notificaciones" /></div>
                            <div className="col-md-3"><CircleToBlockLoading size={35} /></div>
                        </div>
                        <div className="row">
                            <h6>&nbsp;Cuando se le solicite, clickee como se muestra en la imagen</h6>
                        </div>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6"><img src="https://i.ibb.co/0m2pnNS/1.png" alt="Resolver" height='380' /></div>
                            <div className="col-md-3"></div>
                        </div>
                    </Modal.Body>
                </React.Fragment>
            )
        } else if (state === 'address') {
            return (
                <React.Fragment>
                    <Modal.Header>
                        <Modal.Title>Asociando Dirección</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <h6>&nbsp;Se está asociando tu dirección, permanece atento a avisos o notificaciones de MetaMask</h6>
                        </div>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6"><img src="https://i.ibb.co/dk2W2Xh/2.png" alt="Notificaciones" /></div>
                            <div className="col-md-3"><CircleToBlockLoading size={35} /></div>
                        </div>
                        <div className="row">
                            <h6>&nbsp;Cuando se le solicite, clickee como se muestra en la imagen</h6>
                        </div>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6"> <img src="https://i.ibb.co/yR02xbN/3.png" alt="Dirección" height='380' /></div>
                            <div className="col-md-3"></div>
                        </div>
                    </Modal.Body>
                </React.Fragment>
            );
        } else if (state === 'name') {
            return (
                <React.Fragment>
                    <Modal.Header>
                        <Modal.Title>Asociando Nombre</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <h6>&nbsp;Se está asociando tu nombre a tu dirección, permanece atento a avisos o notificaciones de MetaMask</h6>
                        </div>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6"><img src="https://i.ibb.co/dk2W2Xh/2.png" alt="Notificaciones" /></div>
                            <div className="col-md-3"><CircleToBlockLoading size={35} /></div>
                        </div>
                        <div className="row">
                            <h6>&nbsp;Cuando se le solicite, clickee como se muestra en la imagen</h6>
                        </div>
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-6"><img src="https://i.ibb.co/SPJGdV8/4.png" alt="Nombre" height='380' /></div>
                            <div className="col-md-3"></div>
                        </div>
                    </Modal.Body>
                </React.Fragment>
            );
        }

    }


    render() {
        const { errores } = this.state;
        let incorrectMessage;

        let cedula = "Ejemplo: 123456789";

        if (this.state.errors) {
            incorrectMessage =
                <Container className="error">
                    Hay campos vacios o son incorrectos
            </Container>
        }

        return (
            <div className="content-body host">
                <div>{this.renderRedirect()}</div>
                <div>
                    {this.state.isWeb3 === false
                        ? <React.Fragment>
                            <Container>
                                <h3 textalign="center">Para registrarte necesitas la extensión de MetaMask</h3>
                                <div className="row">&nbsp;</div>
                                <a href={this.state.browser} target="_blank" rel="noopener noreferrer"><img src={`https://miro.medium.com/max/1400/1*FMNaYm1KqZSZZkqwXASsUg.png`} alt="Metamask Download Prompt" /></a>
                                <div className="row">&nbsp;</div>
                                <h3>Clickea en la imagen para obtenerla</h3>
                            </Container>
                        </React.Fragment>
                        : <React.Fragment>
                            {this.state.isUser === false
                                ? <React.Fragment>
                                    <Container>
                                        <h3 textalign="center">Estas cerca de registrate tienes que ingresar a tu billetera de MetaMask</h3>
                                        <div className="row">&nbsp;</div>
                                        <img src="https://www.trufflesuite.com/img/docs/truffle/truffle-with-metamask/metamask.png" height="160" alt="MetaMask Logo" />
                                        <div className="row">&nbsp;</div>
                                        <h4>Abre la extensión y sigue las instrucciones, luego de eso ingresa a tu billetera</h4>
                                        <div className="row">&nbsp;</div>
                                        <img src="https://cdn-images-1.medium.com/max/800/1*g_nuCb6G8JS7T7jQzdYPbw.png" alt="MetaMask Ingresar" />
                                    </Container>
                                </React.Fragment>
                                : <React.Fragment>
                                    <Container>
                                        <Row className="justify-content-lg-center">
                                            <Col xs="0" sm="0" md="3" large="3" xl="3"></Col>
                                            <Col xs="12" sm="12" md="6" large="6" xl="6">
                                                <h1 className="title font-weight-bold med" style={{ textAlign: "center" }}>
                                                    Registrate
                                        </h1>
                                            </Col>
                                            <Col xs="0" sm="0" md="3" large="3" xl="3"></Col>
                                        </Row>
                                        {incorrectMessage}
                                        <Row className="justify-content-lg-center">
                                            <Col xs="1" sm="1" md="3" large="4" xl="4"></Col>
                                            <Col xs="10" sm="10" md="6" large="4" xl="4">
                                                <div >
                                                    <Container className="registrar-container">
                                                        <Form className="text-left">
                                                            {this.state.alreadyRegistered
                                                                ? <small className="error">Ya hay una cuenta registrada con su dirección de metamask.</small>
                                                                : <small className="text-muted">Todos los campos con (*) son obligatorios</small>}
                                                            <Form.Group>
                                                                <Form.Label htmlFor="cedula">Cedula *</Form.Label>
                                                                <Form.Control type="text" id="cedula" autoComplete="new-password" name="cedula" placeholder={cedula} onChange={this.handleCedula}></Form.Control>
                                                                {errores.cedula.length > 0 &&
                                                                    <span className='error'>{errores.cedula}</span>}
                                                            </Form.Group>
                                                            <Form.Group>
                                                                <Form.Label htmlFor="nombres">Nombres *</Form.Label>
                                                                <Form.Control type="name" id="nombres" name="nombres" placeholder="(e.g: Tomás Andrés)" onChange={this.handleNombres}></Form.Control>
                                                            </Form.Group>
                                                            <Form.Group>
                                                                <Form.Label htmlFor="apellidos">Apellidos *</Form.Label>
                                                                <Form.Control type="name" id="apellidos" name="apellidos" placeholder="(e.g: Castillo Rios)" onChange={this.handleApellidos}></Form.Control>
                                                            </Form.Group>
                                                            <Form.Group>
                                                                <Form.Label htmlFor="email">Correo Electrónico *</Form.Label>
                                                                <Form.Control type="email" id="email" name="email" placeholder="(e.g: correo@gmail.com)" onChange={this.handleCorreo}></Form.Control>
                                                                {errores.correo.length > 0 &&
                                                                    <span className='error'>{errores.correo}</span>}
                                                            </Form.Group>
                                                            <Form.Group>
                                                                <Form.Label htmlFor="contrasenia">Contraseña *</Form.Label>
                                                                <Form.Control type="password" id="password" autoComplete="new-password" name="password" placeholder='Pas$W0rd' onChange={this.handleContrasenia}></Form.Control>
                                                                {errores.contrasenia.length > 0 &&
                                                                    <span className='error'>{errores.contrasenia}</span>}
                                                            </Form.Group>
                                                            {this.state.domain !== '' && this.context.escenario === 'Ens'
                                                                ? <Form.Group>
                                                                    <Form.Label htmlFor="domain">Escoja su dominio para el servicio de nombres de Ethereum *:</Form.Label>
                                                                    <Form.Check onChange={this.handleChange}>
                                                                        <Form.Check.Input type="radio" name="ens" id="propio" onChange={this.handleDomain} checked={this.state.domainSubmit === 'propio'} value='propio'></Form.Check.Input>
                                                                        <Form.Check.Label htmlFor='own'>{`Propio: ${this.state.domain}`}</Form.Check.Label>
                                                                    </Form.Check>
                                                                    <Form.Check onChange={this.handleChange}>
                                                                        <Form.Check.Input type="radio" name="ens" id="nuevo" onChange={this.handleDomain} checked={this.state.domainSubmit === 'nuevo'} value='nuevo'></Form.Check.Input>
                                                                        <Form.Check.Label htmlFor='new'>{`Nuevo: usuario.pagaresvirtuales.test`}</Form.Check.Label>
                                                                    </Form.Check>
                                                                </Form.Group>
                                                                : <div></div>}
                                                            <div className="d-flex justify-content-center pt-3">
                                                                <button type="submit" className="but-solid" onClick={this.handleSubmit} disabled={this.state.alreadyRegistered}>Registrarse</button>
                                                            </div>
                                                        </Form>
                                                    </Container>

                                                </div>
                                            </Col>
                                            <Col xs="1" sm="1" md="3" large="4" xl="4"></Col>
                                        </Row>
                                    </Container>
                                    <Container>
                                        <Row>
                                            <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                                            <Col xs="0" sm="1" md="3" large="4" xl="4" style={{ textAlign: "center" }}>
                                                ¿Ya Tienes una cuenta? <Link to="/login"><span style={{ color: "#0073b1" }}>Ingresa</span></Link>
                                            </Col>
                                            <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                                        </Row>
                                    </Container>
                                    <Container>
                                        <Row>
                                            <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                                            <Col xs="0" sm="1" md="3" large="4" xl="4" style={{ textAlign: "center" }}>
                                                &nbsp;
                                </Col>
                                            <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                                        </Row>
                                    </Container>
                                </React.Fragment>
                            }
                        </React.Fragment>}
                </div>
                <Modal show={this.state.show}>
                    {this.renderModal(this.state.modalState)}
                </Modal>
                <Modal show={this.state.show2}>
                    <Modal.Header>
                        <Modal.Title>Permiso para acceder a tu cuenta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <h5>&nbsp;Debes permitirnos conectarnos con MetaMask. Clickea en Conectar como se muestra en la imagen</h5>
                        </div>
                        <div className="row">
                            &nbsp;
                </div>
                        <div className="row">
                            &nbsp;
                </div>
                        <Modal.Footer>
                            <div className="row">
                                <img src="https://i.ibb.co/Xtn30Kv/1.png" alt="Aceptar permisos" />
                            </div>
                            <div className="row">
                                <Button className="but-solid" onClick={() => { this.setState({ show2: false }); window.location.reload() }}>
                                    Aceptar
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

Registrar.contextType = EscenarioContext;

export default Registrar;