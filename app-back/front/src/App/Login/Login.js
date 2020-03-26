import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

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

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usuario: '',
            contrasenia: '',
            incorrectLogin: false,
            errMsg: '',
            errors: {
                usuario: '',
                nombre: '',
                correo: '',
                contrasenia: ''
            }
        }

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePassChange = this.handlePassChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;

        switch (name) {
            case 'usuario':
                errors.usuario =
                    value.length < 3
                        ? "Nombre de usuario muy corto"
                        : '';
                break;
            case 'contrasenia':
                errors.contrasenia =
                    value.length < 6
                        ? "Contrasenia muy corta, debe ser de más de 6"
                        : '';
                break;
            default:
        }
    }

    async login(usuario, contrasenia) {
        await axios.post(
            '/users/login',
            {
                "usuario": usuario,
                "contrasenia": contrasenia
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            if (response.data.success) {
                // cookies.set('token', response.data.token);
                this.props.setUsuario(response.data.token);
                this.props.history.push('/');
                console.log(this.props.getUsuario())
            }
            else {
                this.setState({ usuario: this.state.usuario, contrasenia: this.state.contrasenia, incorrectLogin: true, errMsg: "Por favor llene todos los campos"})
            }


        }).catch(err => {
            console.log(err)
            this.setState({ usuario: this.state.usuario, password: this.state.contrasenia, incorrectLogin: true, errMsg: "Login o contraseña incorrectos" })
        })
    }

    handleUserChange(event) {
        this.handleChange(event);
        this.setState({
            usuario: event.target.value,
            contrasenia: this.state.contrasenia
        });
    }

    handlePassChange(event) {
        this.handleChange(event);
        this.setState({
            usuario: this.state.usuario,
            contrasenia: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

            if (this.state.usuario !== "" && !this.state.contrasenia !== "" && validateForm(this.state.errors)) {
                this.login(this.state.usuario, this.state.contrasenia);
            } 

    }

    renderRedirect() {
        if (this.props.getUsuario()) {
            return <Redirect to='/pagare/crear' />
        }
    }

    render() {
        let incorrectMessage;

        if (this.state.incorrectLogin) {
            incorrectMessage =
                <Container className="error">
                   Login o contraseña no es correcta
                </Container>
        }

        return (
            <div className="content-body host">
                <div>{this.renderRedirect()}</div>
                <Container>
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
                            <div className="border-container">
                                <div className="login-container">
                                    <Form className="text-left">
                                        <Form.Group>
                                            <Form.Label htmlFor="nombreUsuario">Usuario</Form.Label>
                                            <Form.Control name="nombreUsuario" id="nombreUsuario" required type="text" onChange={this.handleUserChange}></Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label htmlFor="contrasenia">Contraseña</Form.Label>
                                            <Form.Control name="contrasenia" id="contrasenia" type="password" onChange={this.handlePassChange}></Form.Control>
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
                <Container className="cuenta-inexistente">
                    <Row>
                        <Col>
                            <Link to="/registrar">Registrase</Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}