import React, { Component } from 'react';
import axios from 'axios';



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

         
         this.handleSubmit = this.handleSubmit.bind(this);
         this.post = this.post.bind(this);
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
            <div id="accordion">
                <div class="card">
                    <div class="card-header" id="headingOne">
                        <h5 class="mb-0">
                            <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                <h5 className="title-card">Llenar condiciones de prestamo</h5>
                            </button>
                        </h5>
                    </div>

                    <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                        <form>
                         <div class="form-group">
                            <label for="valor">Valor</label>
                            <input type="number" class="form-control" id="valor" aria-describedby="Valor" placeholder="8000"/>
                                <small id="emailHelp" class="form-text text-muted">valor acordado de prestamo</small>
                        </div>
                        <div class="form-group">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Condiciones de prestamo
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <button class="dropdown-item" type="button">Intereses</button>
                                <button class="dropdown-item" type="button">Opción 2 </button>
                                <button class="dropdown-item" type="button">Opción 3</button>
                            </div>
                        </div>
                            <label for="Condiciones">Condiciones</label>
                            <input type="text" class="form-control" id="exampleInputPassword1" placeholder="5% por mes"/>
                         </div>
                            <button type="submit" class="btn btn-primary">Crear pagaré</button>
                        </form>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header" id="headingOne">
                        <h5 class="mb-0">
                            <button class="btn btn-link collapsed disabled" data-toggle="collapse" data-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                 <h5 className="title-card">Acordar condiciones de pago</h5>
                            </button>
                        </h5>
                    </div>

                    <div id="collapse2" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                        <form>
                         <div class="form-group">
                            <label for="valor">Valor</label>
                            <input type="number" class="form-control" id="valor" aria-describedby="Valor" placeholder="8000"/>
                                <small id="emailHelp" class="form-text text-muted">valor acordado de prestamo</small>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Condiciones</label>
                            <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
                         </div>
                            <button type="submit" class="btn btn-primary">Acordar Pago</button>
                        </form>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header" id="headingOne">
                        <h5 class="mb-0">
                            <button class="btn btn-link collapsed disabled" data-toggle="collapse" data-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                 <h5 className="title-card">Revisar Condiciones</h5>
                            </button>
                        </h5>
                    </div>

                    <div id="collapse2" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                        <form>
                         <div class="form-group">
                            <label for="valor">Valor</label>
                            <input type="number" class="form-control" id="valor" aria-describedby="Valor" placeholder="8000"/>
                                <small id="emailHelp" class="form-text text-muted">valor acordado de prestamo</small>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Condiciones</label>
                            <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
                         </div>
                            <button type="submit" class="btn btn-primary">Acordar Pago</button>
                        </form>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header" id="headingOne">
                        <h5 class="mb-0">
                            <button class="btn btn-link collapsed disabled" data-toggle="collapse" data-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                                 <h5 className="title-card">Llenar datos personales</h5>
                            </button>
                        </h5>
                    </div>

                    <div id="collapse2" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                        <form>
                         <div class="form-group">
                            <label for="valor">Valor</label>
                            <input type="number" class="form-control" id="valor" aria-describedby="Valor" placeholder="8000"/>
                                <small id="emailHelp" class="form-text text-muted">valor acordado de prestamo</small>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Condiciones</label>
                            <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
                         </div>
                            <button type="submit" class="btn btn-primary">Acordar Pago</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>  );
    }
}
 
export default CrearPagare;