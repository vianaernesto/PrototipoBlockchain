import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import "./Login.css"

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';



const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        (val) => {
            if (val.length > 0) {
                valid = false
            }
        }
    );
    return valid;
}

const cookies = new Cookies();



export default class Login extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            cedula: '',
            contrasenia: '',
            incorrectLogin: false,
            errMsg: '',
            errors: {
                cedula: '',
                contrasenia: ''
            }
        }

        this.handleCedulaChange = this.handleCedulaChange.bind(this);
        this.handleContraseniaChange = this.handleContraseniaChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;

        switch (name) {
            case 'cedula':
                errors.usuario =
                    value.length < 3
                        ? "Cedula muy corta"
                        : '';
                break;
            case 'contrasenia':
                errors.contrasenia =
                    value.length < 6
                        ? "Contrasenia muy corta, debe ser de más de 6 digitos"
                        : '';
                break;
            default:
        }
    }

    async login(cedula, contrasenia) {
        await axios.post(
            '/users/login',
            {
                "cedula": cedula,
                "contrasenia": contrasenia
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            if (response.data.success) {
                cookies.set('token', response.data.token);
                this.props.setUsuario(response.data.token);
                this.props.history.push('/');
            }
            else {
                this.setState({ cedula: this.state.cedula, contrasenia: this.state.contrasenia, incorrectLogin: true, errMsg: "Por favor llene todos los campos"})
            }


        }).catch(err => {
            console.log(err)
            this.setState({ cedula: this.state.cedula, contrasenia: this.state.contrasenia, incorrectLogin: true, errMsg: "Cedula o contraseña incorrectos" })
        })
    }

    handleCedulaChange(event) {
        this.handleChange(event);
        this.setState({
            cedula: parseInt(event.target.value,10),
            contrasenia: this.state.contrasenia
        });
    }

    handleContraseniaChange(event) {
        this.handleChange(event);
        this.setState({
            cedula: this.state.cedula,
            contrasenia: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

            if (this.state.cedula !== "" && !this.state.contrasenia !== "" && validateForm(this.state.errors)) {
                this.login(this.state.cedula, this.state.contrasenia);
            } 

    }

    renderRedirect() {
        if (this.props.getUsuario()) {
            return <Redirect to='/balance' />
        }
    }

    render() {
        let incorrectMessage;

        if (this.state.incorrectLogin) {
            incorrectMessage =
                <Container className="error">
                   Cedula o contraseña no es correcta
                </Container>
        }

        return (
            <div className="content-body host">
                <div>{this.renderRedirect()}</div>
                <Container className="login-container">
                    <Row className="justify-content-lg-center">
                        <Col xs="0" sm="1" md="4" large="4" xl="4"></Col>
                        <Col xs="12" sm="10" md="4" large="4" xl="4">
                            <h1 className="title font-weight-bold med">
                                Ingresar
                            </h1>
                        </Col>
                        <Col xs="0" sm="1" md="4" large="4" xl="4"></Col>
                    </Row>
                    {incorrectMessage}
                    <Row className="justify-content-lg-center">
                        <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                        <Col xs="12" sm="10" md="6" large="4" xl="4">
                            <div>
                                <div className="login-container">
                                    <Form className="text-left">
                                        <Form.Group>
                                            <Form.Label htmlFor="cedula">Cedula</Form.Label>
                                            <Form.Control name="cedula" id="cedula" required type="text" placeholder="Ej: 123456789" onChange={this.handleCedulaChange}></Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label htmlFor="contrasenia">Contraseña</Form.Label>
                                            <Form.Control name="contrasenia" id="contrasenia" type="text" placeholder="Ej: pas$w0rD" onChange={this.handleContraseniaChange}></Form.Control>
                                        </Form.Group>
                                        <div className="d-flex justify-content-center">
                                            <button type="submit" className="but-solid" onClick={this.handleSubmit}>Ingresar</button>
                                        </div>
                                    </Form>
                                </div>
                            </div>

                        </Col>
                        <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                    </Row>

                </Container>
                <Container>
                    <Row>
                        <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                        <Col xs="0" sm="1" md="3" large="4" xl="4" style={{textAlign:"center"}}>
                            ¿No tienes una cuenta? <Link to="/registrar"><span style={{color:"#0073b1"}}>Registrate</span></Link>
                        </Col>
                        <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                    </Row>
                </Container>
                <Container>
                <Row>
                    <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                    <Col xs="0" sm="1" md="3" large="4" xl="4" style={{textAlign:"center"}}>
                        &nbsp;
                    </Col>
                    <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                </Row>
            </Container>
            </div>
        );
    }
}