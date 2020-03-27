import React, { Component } from 'react';
import { Link, Redirect} from 'react-router-dom';
import axios from 'axios';

import './Registrar.css';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const correoRegex = RegExp(/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const validateForm =(errors) =>{
    let valid = true;
    Object.values(errors).forEach(
        (val) => {
            if(val.length >0){
                valid = false;
            }
        }
    );
    return valid;
}

export default class Registrar extends Component {
    constructor(props){
        super(props);

        this.state = {
            cedula: 0,
            nombres: '',
            apellidos: '',
            correo: '',
            contrasenia: '',
            errors: false,
            errores: {
                cedula :'',
                correo: '',
                contrasenia: '',
            }
        }

        this.handleCedula = this.handleCedula.bind(this);
        this.handleNombres = this.handleNombres.bind(this);
        this.handleCorreo = this.handleCorreo.bind(this);
        this.handleApellidos = this.handleApellidos.bind(this);
        this.handleContrasenia= this.handleContrasenia.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        let errors = this.state.errores;

        switch(name){
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

    handleCedula(event){
        this.handleChange(event);
        this.setState({
            cedula: parseInt(event.target.value,10),
            nombres: this.state.nombres,
            apellidos: this.state.apellidos,
            correo: this.state.correo,
            contrasenia: this.state.contrasenia,
            errors: false,
        })
    }

    handleNombres(event){
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

    handleApellidos(event){
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

    handleCorreo(event){
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
    handleContrasenia(event){
        this.handleChange(event);
        this.setState({
            cedula:this.state.cedula,
            nombres: this.state.nombres,
            apellidos: this.state.apellidos,
            correo: this.state.correo,
            contrasenia: event.target.value,
            errors: false,
        })
    }

    async registrar(cedula, nombres, apellidos, correo, contrasenia){
        await axios.post(
            '/users',
            {
                "cedula" : cedula,
                "nombres": nombres,
                "apellidos": apellidos,
                "correo" : correo,
                "contrasenia": contrasenia
            },
            {
                headers: {'Content-Type': 'application/json'}
            }
        ).then(response =>{
            if(response.data.success){
                this.props.history.push('/login');
            }
            else{
                this.setState({
                    cedula : this.state.cedula,
                    nombres: this.state.nombres,
                    apellidos : this.state.apellidos,
                    correo : this.state.correo,
                    contrasenia : this.state.contrasenia,
                    errors : true
                });
            }
        })
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.state.cedula !== 0 && this.state.nombres !== "" && this.state.apellidos && this.state.correo !== "" && this.state.contrasenia !== "" && validateForm(this.state.errores)){
            this.registrar(this.state.cedula, this.state.nombres, this.state.apellidos, this.state.correo, this.state.contrasenia);
        } 
        else{
            this.setState({
                cedula : this.state.cedula,
                nombres: this.state.nombres,
                apellidos: this.state.apellidos,
                contrasenia: this.state.contrasenia,
                correo: this.state.correo,
                error: true,
            });
        }
    }

    renderRedirect(){
        if(this.props.getUsuario()){
            return <Redirect to='/balance'/>
        }
    }

    

    render(){
        const {errores} = this.state;

        let incorrectMessage;

        let cedula = "Ejemplo: 123456789";

        if(this.state.errors){
            incorrectMessage =
            <Container className = "error">
                Hay campos vacios o son incorrectos
            </Container>
        }

        return (
        <div className="content-body host">
            <div>{this.renderRedirect()}</div>
            <Container>
                <Row className="justify-content-lg-center">
                <Col xs="0" sm="0" md="3" large="3" xl="3"></Col>
                        <Col xs="12" sm="12" md="6" large="6" xl="6">
                            <h1 className="title font-weight-bold med" style={{textAlign:"center"}}>
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
                                        <small className="text-muted">Todos los campos con (*) son obligatorios</small>
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
                                        <div className="d-flex justify-content-center pt-3">
                                            <button type="submit" className="but-solid" onClick={this.handleSubmit}>Registrarse</button>
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
                    <Col xs="0" sm="1" md="3" large="4" xl="4" style={{textAlign:"center"}}>
                        ¿Ya Tienes una cuenta? <Link to="/login"><span style={{color:"#0073b1"}}>Ingresa</span></Link>
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
        )
    }
}