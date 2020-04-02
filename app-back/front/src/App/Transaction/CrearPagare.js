import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import jsPDF from 'jspdf';

import './CrearPagare.css';

class CrearPagare extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: '',
            valor : -1,
            nombreDeudor: "",
            idDeudor : 0,
            nombreAcreedor: "",
            idAcreedor : 0,
            fechaCreacion: null,
            lugarCreacion : "",
            fechaVencimiento : null,
            fechaExpiracion : null,
            etapa : 1,
            terminos : "",
            codigoRetiro: "",
            confirmacionRetiro: "",
            rol : 'acreedor',
            redirect : false,
            pdf : {},
         }

         this.redirect = this.redirect.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
         this.post = this.post.bind(this);
         this.isDisabled = this.isDisabled.bind(this);
         this.isSuccessful = this.isSuccessful.bind(this);
         this.renderPreview = this.renderPreview.bind(this);
         this.placeholder = this.placeholder.bind(this);
    }

    componentDidMount(){
        if(this.props.location.state !== undefined){
            let {usuario} = this.props.location.state;
            const {rol} = this.props.location.state;
            let y = `${rol}`;
            if(rol === 'acreedor'){
                this.setState({
                    rol: y,
                    nombreAcreedor : usuario.nombre,
                    idAcreedor :usuario.cedula,
                });
            } else{
                this.setState({
                    rol: y,
                    nombreDeudor : usuario.nombre,
                    idDeudor :usuario.cedula,
                });
            }
            
        } else{
            this.setState({redirect: true});
        }
       this.setup();
    }

    setup(){
        const doc = new jsPDF();
        doc.text(35,25, 'Texto');
        const pdf = doc.output('datauristring');
        this.setState({
            pdf:pdf,
        });

        this.doc= doc;
    }

    renderPreview(){
        const pdf = this.state.pdf;
        return(
            <div style={{
                height:'650px',
                position:'relative',
                zIndex:999,
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

    redirect(){
        if(this.state.redirect){
            return <Redirect to='/balance'/>
        }
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

    isDisabled(pEtapa,element){

        if(element === 'card'){
            if(pEtapa === this.state.etapa){
                return '';
            } else{
                return 'collapsed disabled'
            }
        }else if(element === 'aria'){
            if(pEtapa === this.state.etapa){
                return true;
            } else{
                return false;
            }
        }else if(element === 'accordion'){
            if(pEtapa === this.state.etapa){
                return 'collapse show';
            }else{
                return 'collapse';
            }            
        }else if(element === 'input'){
            if(pEtapa !== this.state.etapa){
                return true;
            } else{
               return  false;
            }
        }
        
    }

    isSuccessful(pEtapa, element){
        if(element === 'card'){
            if(pEtapa < this.state.etapa){
                return 'btn-success';
            }
        } else if(element === 'title'){
            if(pEtapa < this.state.etapa){
                return 'success';
            }
        }
        
    }

    placeholder(pEtapa,input){
        if(input  === 'nombreDeudor'){
            if(this.state.nombreDeudor !== ""){
                return `${this.state.nombreDeudor}`;
            } else{
                return 'Nombre del deudor';
            }
        }
        if(input === 'idDeudor'){
            if(this.state.idDeudor !==0){
                return `${this.state.idDeudor}`;
            } else{
                return 'Cedula del deudor';
            }
        }
        if(input === 'nombreAcreedor'){
            if(this.state.nombreDeudor !== ""){
                return `${this.state.nombreDeudor}`;
            } else{
                return 'Nombre del deudor';
            }
        }
        if(input === 'idAcreedor'){
            if(this.state.idAcreedor !==0){
                return `${this.state.idAcreedor}`;
            } else{
                return 'Cedula del acreedor';
            }
        }
        if(input ==='valor'){
            if(pEtapa > 2 ){
                return `$${this.state.valor}`;
            } else{
                return '$9000'
            }
        }
        if(input ==='terminos'){
            if(pEtapa > 2 ){
                return `${this.state.terminos}`;
            } else{
                return 'Condiciones con las cuales se lleva a cabo el prestamo'
            }
        }
    }
    render() { 
        return (
        <div className="content-body host">
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
            <div id="accordion">
                <div className="card">
                    <div className="card-header" id="etapa1">
                        <div className="col-md-10">
                            <button className={`btn ${this.isSuccessful(1,'card')}  ${this.isDisabled(1,'card')}`} data-toggle="collapse" data-target="#etapa1Collapse" aria-expanded={this.isDisabled(1,'aria')} aria-controls="etapa1Collapse">
                                <h5 className={`title-card ${this.isSuccessful(1,'title')}`}>Información Básica</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa1Collapse" className={`collapse ${this.isDisabled(1,'accordion')}`} aria-labelledby="etapa1" data-parent="#accordion">
                    <div className="row">
                        <form>
                        <div className="row">
                        <div className="col-1 col-md-1 col-lg-1"></div>
                        <div className="col-4 col-md-4 col-lg-4">
                            <div className="form-group">
                                <label htmlFor="valor">Valor</label>
                                <input type="number" min="1" className="form-control" id="valor" aria-describedby="Valor" placeholder={this.placeholder(1,'valor')} disabled={this.isDisabled(1,'input')}/>
                                <small id="valorHelp" className="form-text text-muted">valor acordado de prestamo</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Condiciones">Condiciones</label>
                                <input type="text" className="form-control" id="exampleInputPassword1" placeholder="5% mensual" disabled={this.isDisabled(1,'input')}/>
                            </div>
                        
                        </div>
                        <div className="col-2 col-md-2 col-lg-2"></div>
                        <div className="col-4 col-md-4 col-lg-4">
                            <div className="form-group">
                                <label htmlFor="valor">Valor</label>
                                <input type="number" min="1" className="form-control" id="valor" aria-describedby="Valor" placeholder={this.placeholder(1,'valor')} disabled={this.isDisabled(1,'input')}/>
                                <small id="valorHelp" className="form-text text-muted">valor acordado de prestamo</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Condiciones">Condiciones</label>
                                <input type="text" className="form-control" id="exampleInputPassword1" placeholder="5% mensual" disabled={this.isDisabled(1,'input')}/>
                            </div> 
                        </div>
                        <div className="col-1 col-md-1 col-lg-1"></div>
                        </div>      
                        <div className="row">
                        <div className="col-3 col-md-3 col-lg-5"></div>
                        <div className="col-6 col-md-6 col-lg-6">
                            <button type="submit" className="btn btn-primary">Siguiente Paso</button>
                        </div>  
                            <div className="col-1 col-md-1 col-lg-1"></div>
                        </div>                      
                            
                        </form>
                    </div>
                    <div className="row">&nbsp;</div>
                    </div>
                </div>
            </div>
            <div className="row">&nbsp;</div>
            <div id="accordion">
                <div className="card">
                    <div className="card-header" id="etapa1">
                        <div className="col-md-10">
                            <button className={`btn ${this.isSuccessful(2,'card')}  ${this.isDisabled(2,'card')}`} data-toggle="collapse" data-target="#etapa1Collapse" aria-expanded={this.isDisabled(2,'aria')} aria-controls="etapa1Collapse">
                                <h5 className={`title-card ${this.isSuccessful(2,'title')}`}>Acuerdos del prestamo</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa1Collapse" className={`collapse ${this.isDisabled(2,'accordion')}`} aria-labelledby="etapa1" data-parent="#accordion">
                    <div className="row">
                    <div className="col-1 col-md-1 col-lg-1"></div>
                    <div className="col-5 col-md-5 col-lg-5">
                        <form>
                            <div className="form-group">
                                <label htmlFor="valor">Valor</label>
                                <input type="number" min="1" className="form-control" id="valor" aria-describedby="Valor" placeholder={this.placeholder(2,'valor')} disabled={this.isDisabled(2,'input')}/>
                                <small id="valorHelp" className="form-text text-muted">valor acordado de prestamo</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Condiciones">Condiciones</label>
                                <input type="text" className="form-control" id="exampleInputPassword1" placeholder="5% mensual" disabled={this.isDisabled(2,'input')}/>
                            </div>
                                <button type="submit" className="btn btn-primary">Crear pagaré</button>
                        </form>
                     </div>
                     <div className="col-6 col-md-6 col-lg-6"></div>
                    </div>
                    <div className="row">&nbsp;</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-6 col-lg-6 col-6">{this.renderPreview()}</div>
        </div>
        </div>  );
    }
}
 
export default CrearPagare;