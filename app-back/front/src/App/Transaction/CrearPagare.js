import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';

import './CrearPagare.css';

class CrearPagare extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            nombreDeudor: "",
            firmaDeudor:"123122hfff",
            cedulaDeudor: "",
            monto : 0,
            nombreAcreedor: "",
            cedulaAcreedor: "",
            fechaDeCreacion: "",
            lugarDeCreacion: "",
            lugarDeCumplimiento: ""
         }

         this.handleNombreDeudorChange = this.handleNombreDeudorChange.bind(this);
         this.handleCedulaDeudorChange = this.handleCedulaDeudorChange.bind(this);
         this.handleMontoChange = this.handleMontoChange.bind(this);
         this.handleNombreAcreedorChange = this.handleNombreAcreedorChange.bind(this);
         this.handleCedulaAcreedorChange = this.handleCedulaAcreedorChange.bind(this);
         this.handleFechaCreacionChange = this.handleFechaCreacionChange.bind(this);
         this.handleLugarCreacionChange = this.handleLugarCreacionChange.bind(this);
         this.handleLugarCumplimientoChange = this.handleLugarCumplimientoChange.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
         this.post = this.post.bind(this);
    }

    handleNombreDeudorChange(event) {
        this.setState({
            nombreDeudor: event.target.value,
            firmaDeudor: this.state.firmaDeudor,
            monto : this.state.monto,
            cedulaDeudor: this.state.cedulaDeudor,
            nombreAcreedor : this.state.nombreAcreedor,
            cedulaAcreedor: this.state.cedulaAcreedor,
            fechaDeCreacion : this.state.fechaDeCreacion,
            lugarDeCreacion: this.state.lugarDeCreacion,
            lugarDeCumplimiento : this.state.lugarDeCumplimiento,
        });
    }


    handleMontoChange(event) {
        this.setState({
            nombreDeudor: this.state.nombreDeudor,
            firmaDeudor: this.state.firmaDeudor,
            monto : event.target.value,
            cedulaDeudor: this.state.cedulaDeudor,
            nombreAcreedor : this.state.nombreAcreedor,
            cedulaAcreedor: this.state.cedulaAcreedor,
            fechaDeCreacion : this.state.fechaDeCreacion,
            lugarDeCreacion: this.state.lugarDeCreacion,
            lugarDeCumplimiento : this.state.lugarDeCumplimiento,
        });
    }

    handleCedulaDeudorChange(event) {
        this.setState({
            nombreDeudor: this.state.nombreDeudor,
            firmaDeudor: this.state.firmaDeudor,
            monto : this.state.monto,
            cedulaDeudor: event.target.value,
            nombreAcreedor : this.state.nombreAcreedor,
            cedulaAcreedor: this.state.cedulaAcreedor,
            fechaDeCreacion : this.state.fechaDeCreacion,
            lugarDeCreacion: this.state.lugarDeCreacion,
            lugarDeCumplimiento : this.state.lugarDeCumplimiento,
        });
    }

    handleNombreAcreedorChange(event) {
        this.setState({
            nombreDeudor: this.state.nombreDeudor,
            firmaDeudor: this.state.firmaDeudor,
            monto : this.state.monto,
            cedulaDeudor: this.state.cedulaDeudor,
            nombreAcreedor : event.target.value,
            cedulaAcreedor: this.state.cedulaAcreedor,
            fechaDeCreacion : this.state.fechaDeCreacion,
            lugarDeCreacion: this.state.lugarDeCreacion,
            lugarDeCumplimiento : this.state.lugarDeCumplimiento,
        });
    }

    handleCedulaAcreedorChange(event) {
        this.setState({
            nombreDeudor: this.state.nombreDeudor,
            firmaDeudor: this.state.firmaDeudor,
            monto : this.state.monto,
            cedulaDeudor: this.state.cedulaDeudor,
            nombreAcreedor : this.state.nombreAcreedor,
            cedulaAcreedor: event.target.value,
            fechaDeCreacion : this.state.fechaDeCreacion,
            lugarDeCreacion: this.state.lugarDeCreacion,
            lugarDeCumplimiento : this.state.lugarDeCumplimiento,
        });
    }

    handleFechaCreacionChange(event) {
        this.setState({
            nombreDeudor: this.state.nombreDeudor,
            firmaDeudor: this.state.firmaDeudor,
            monto : this.state.monto,
            cedulaDeudor: this.state.cedulaDeudor,
            nombreAcreedor : this.state.nombreAcreedor,
            cedulaAcreedor: this.state.cedulaAcreedor,
            fechaDeCreacion : event.target.value,
            lugarDeCreacion: this.state.lugarDeCreacion,
            lugarDeCumplimiento : this.state.lugarDeCumplimiento,
        });
    }

    handleLugarCreacionChange(event) {
        this.setState({
            nombreDeudor: this.state.nombreDeudor,
            firmaDeudor: this.state.firmaDeudor,
            monto : this.state.monto,
            cedulaDeudor: this.state.cedulaDeudor,
            nombreAcreedor : this.state.nombreAcreedor,
            cedulaAcreedor: this.state.cedulaAcreedor,
            fechaDeCreacion : this.state.fechaDeCreacion,
            lugarDeCreacion: event.target.value,
            lugarDeCumplimiento : this.state.lugarDeCumplimiento,
        });
    }

    handleLugarCumplimientoChange(event) {
        this.setState({
            nombreDeudor: this.state.nombreDeudor,
            firmaDeudor: this.state.firmaDeudor,
            monto : this.state.monto,
            cedulaDeudor: this.state.cedulaDeudor,
            nombreAcreedor : this.state.nombreAcreedor,
            cedulaAcreedor: this.state.cedulaAcreedor,
            fechaDeCreacion : this.state.fechaDeCreacion,
            lugarDeCreacion: this.state.lugarDeCreacion,
            lugarDeCumplimiento : event.target.value,
        });
    }

    async post(data) {
        axios.post(
            '/pagares/crear',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response => {
            if (response.data.success) {
                // cookies.set('token', response.data.token);
                response.status(200).json();
            }


        }).catch(err => {
            console.log(err)
        })
    }
    
    handleSubmit(event) {
        event.preventDefault();
        var data = {
            nombreDeudor: this.state.nombreDeudor,
            firmaDeudor: this.state.firmaDeudor,
            monto : this.state.monto,
            cedulaDeudor: this.state.cedulaDeudor,
            nombreAcreedor : this.state.nombreAcreedor,
            cedulaAcreedor: this.state.cedulaAcreedor,
            fechaDeCreacion : this.state.fechaDeCreacion,
            lugarDeCreacion: this.state.lugarDeCreacion,
            lugarDeCumplimiento : this.state.lugarDeCumplimiento
        }
        this.post(data);
    }

    
    render() { 
        return (
        <div className="content-body host">
            <Container>
                <Row className="justify-content-lg-center">
                    <Col xs="0" sm="1" md="4" large="4" xl="4"></Col>
                    <Col xs="0" sm="1" md="4" large="4" xl="4">
                    <h1 className="title font-weight-bold med">
                                Crear Pagaré
                    </h1>
                    </Col>
                    <Col xs="0" sm="1" md="4" large="4" xl="4"></Col>
                </Row>
                <Row className="justify-content-lg-center"></Row>
                    <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
                    <Col xs="12" sm="10" md="6" large="4" xl="4">
                    <div className="border-container">
                                <div className="form-container">
                                    <Form className="text-left">
                                        <Form.Group>
                                            <Form.Label htmlFor="nombreDeudor">nombreDeudor</Form.Label>
                                            <Form.Control name="nombreDeudor" id="nombreDeudor" required type="text" onChange={this.handleNombreDeudorChange}></Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label htmlFor="cedulaDeudor">Cedula del deudor</Form.Label>
                                            <Form.Control name="cedulaDeudor" id="cedulaDeudor" type="text" onChange={this.handleCedulaDeudorChange}></Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label htmlFor="monto">Monto del pagaré</Form.Label>
                                            <Form.Control name="monto" id="monto" type="text" onChange={this.handleMontoChange}></Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label htmlFor="nombreAcreedor">Nombre del acreedor</Form.Label>
                                            <Form.Control name="nombreAcreedor" id="nombreAcreedor" type="text" onChange={this.handleNombreAcreedorChange}></Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label htmlFor="cedulaAcreedor">Cedula del acreedor</Form.Label>
                                            <Form.Control name="cedulaAcreedor" id="cedulaAcreedor" type="text" onChange={this.handleCedulaAcreedorChange}></Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label htmlFor="fechaCreacion">Fecha de creación</Form.Label>
                                            <Form.Control name="fechaCreacion" id="fechaCreacion" type="date" onChange={this.handleFechaCreacionChange}></Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label htmlFor="LugarCreacion">Lugar de Creación</Form.Label>
                                            <Form.Control name="LugarCreacion" id="LugarCreacion" type="text" onChange={this.handleLugarCreacionChange}></Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label htmlFor="LugarCumplimiento">Lugar de Cumplimiento</Form.Label>
                                            <Form.Control name="LugarCumplimiento" id="LugarCumplimiento" type="text" onChange={this.handleLugarCumplimientoChange}></Form.Control>
                                        </Form.Group>
                                        <div className="d-flex justify-content-center">
                                            <Link to="/pagareDetail"><button type="submit" className="but-solid">Crear Pagaré</button></Link>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                    </Col>
                    <Col xs="0" sm="1" md="3" large="4" xl="4"></Col>
            </Container>
        </div>  );
    }
}
 
export default CrearPagare;