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
            etapa : 0,
            terminos : "",
            codigoRetiro: "",
            confirmacionRetiro: "",
            rol : 'acreedor',
            redirect : false,
            pdf : {},
            disableAcreedor : false,
            disableDeudor : false,
         }

         this.redirect = this.redirect.bind(this);
         this.handleChangeEtapa1 = this.handleChangeEtapa1.bind(this);
         this.handleEtapa1 = this.handleEtapa1.bind(this);
         this.handleChangeEtapa2 = this.handleChangeEtapa2.bind(this);
         this.handleEtapa2 = this.handleEtapa2.bind(this);
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
                    disableAcreedor : true,
                    etapa: 0, ///AQUI ES IMPORTANTISIMO CAMBIARLO POR EL PROPS QUE LLEGA SI LO ABRIMOS DESDE AFUERA
                    id: '',
                });
            } else{
                this.setState({
                    rol: y,
                    nombreDeudor : usuario.nombre,
                    idDeudor :usuario.cedula,
                    disableDeudor : true,
                    etapa: 0, ///AQUI ES IMPORTANTISIMO CAMBIARLO POR EL PROPS QUE LLEGA SI LO ABRIMOS DESDE AFUERA
                    id: '',
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

    handleChangeEtapa1(event){
        event.preventDefault();
        let target = event.target;
        let  value = target.value;
        let name = target.name;
        if(name === 'idDeudor' || name=== 'idAcreedor'){
            value = parseInt(value,10);
        }
        
        this.setState({
            [name]: value,
        });

    }

    handleChangeEtapa2(event){
        event.preventDefault();
        let target = event.target;
        let  value = target.value;
        let name = target.name;
        if(name=== 'valor'){
            value = parseInt(value,10);
        }
        this.setState({
            [name]: value,
        });

    }
    
    handleEtapa1(event) {
        event.preventDefault();
        var data = {
            nombreDeudor: this.state.nombreDeudor,
            idDeudor : this.state.idDeudor,
            nombreAcreedor: this.state.nombreAcreedor,
            idAcreedor : this.state.idAcreedor,
        }
        
        axios.post(
            '/pagares/etapa1',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            let pagare = response.data[0];
                this.setState({
                    id:pagare._id,
                    etapa : pagare.etapa,
                    disableAcreedor: true,
                    disableDeudor : true,
                });
                
        });
    }

    handleEtapa2(event) {
        event.preventDefault();
        var data = {
            valor :this.state.valor,
            terminos : this.state.terminos,
        }
        
        axios.patch(
            `/pagares/${this.state.id}/etapa2`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            let pagare = response.data;
                this.setState({
                    etapa : pagare.etapa,
                });
        });
    }

    isDisabled(pEtapa,element){

        if(element === 'card'){
            
            if(pEtapa === this.state.etapa){
                return '';
            } else{
                return 'collapsed'
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
        } else if(element === 'button'){
            if(pEtapa > this.state.etapa){
                return true;
            } else{
                return false;
            }
        } else if(element === 'submit'){
            if(pEtapa < this.state.etapa){
                return 'hidden';
            } else{
                return 'visible';
            }
        }
        

    }

    isSuccessful(pEtapa, element){
        if(element === 'card'){
            if(pEtapa < this.state.etapa){
                return 'btn-success';
            }else{
                return '';
            }
        } else if(element === 'title'){
            if(pEtapa < this.state.etapa){
                return '-success';
            }else if(pEtapa === this.state.etapa){
                return '';
            } else {
                return '-ongoing';
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
            if(this.state.nombreAcreedor !== ""){
                return `${this.state.nombreAcreedor}`;
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
                            <button className={`btn ${this.isSuccessful(0,'card')}  ${this.isDisabled(0,'card')}`} data-toggle="collapse" data-target="#etapa1Collapse" aria-expanded={this.isDisabled(0,'aria')} aria-controls="etapa1Collapse" disabled={this.isDisabled(0,'button')}>
                                <h5 className={`title-card${this.isSuccessful(0,'title')}`}>Información Básica</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa1Collapse" className={`collapse ${this.isDisabled(0,'accordion')}`} aria-labelledby="etapa1" data-parent="#accordion">
                    <div className="row">
                        <form>
                        <div className="row">
                        <div className="col-1 col-md-1 col-lg-1"></div>
                        <div className="col-5 col-md-5 col-lg-5">
                            <div className="form-group">
                                <label htmlFor="nombreAcreedor">Nombre del Acreedor</label>
                                <input name= "nombreAcreedor" type="text" className="form-control" id="nombreAcreedor" onChange={this.handleChangeEtapa1} aria-describedby="nombreAcreedor" placeholder={this.placeholder(0,'nombreAcreedor')} disabled={this.state.disableAcreedor}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="idAcreedor">Cédula del Acreedor</label>
                                <input name= "idAcreedor" type="number" min="0" className="form-control" id="idAcreedor" onChange={this.handleChangeEtapa1} placeholder={this.placeholder(0,'idAcreedor')} disabled={this.state.disableAcreedor}/>
                            </div>
                        
                        </div>
                        <div className="col-5 col-md-5 col-lg-5">
                            <div className="form-group">
                                <label htmlFor="nombreDeudor">Nombre del deudor</label>
                                <input  name= "nombreDeudor" type="text" className="form-control" id="nombreDeudor" onChange={this.handleChangeEtapa1} aria-describedby="nombreDeudor" placeholder={this.placeholder(0,'nombreDeudor')} disabled={this.state.disableDeudor}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="idDeudor">Cédula del Deudor</label>
                                <input name= "idDeudor" type="number" min="0" className="form-control" id="idDeudor" onChange={this.handleChangeEtapa1}  placeholder={this.placeholder(0,'idDeudor')} disabled={this.state.disableDeudor}/>
                            </div>
                        </div>
                        <div className="col-1 col-md-1 col-lg-1"></div>
                        </div>      
                        <div className="row">
                        <div className="col-3 col-md-3 col-lg-5"></div>
                        <div className="col-6 col-md-6 col-lg-6">
                            <button type="submit" className="btn btn-primary" onClick={this.handleEtapa1} style={{visibility:this.isDisabled(0,'submit')}} >Siguiente Paso</button>
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
                    <div className="card-header" id="etapa2">
                        <div className="col-md-10">
                            <button className={`btn ${this.isSuccessful(1,'card')}  ${this.isDisabled(1,'card')}`} data-toggle="collapse" data-target="#etapa2Collapse" aria-expanded={this.isDisabled(1,'aria')} aria-controls="etapa2Collapse" disabled={this.isDisabled(1,'button')} >
                                <h5 className={`title-card${this.isSuccessful(1,'title')}`}>Acuerdos del prestamo</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa2Collapse" className={`collapse ${this.isDisabled(1,'accordion')}`} aria-labelledby="etapa2" data-parent="#accordion">
                    <div className="row">
                    <div className="col-1 col-md-1 col-lg-1"></div>
                    <div className="col-5 col-md-5 col-lg-5">
                        <form>
                            <div className="form-group">
                                <label htmlFor="valor">Valor</label>
                                <input name="valor" type="number" min="1" onChange={this.handleChangeEtapa2} className="form-control" id="valor" aria-describedby="Valor" placeholder={this.placeholder(1,'valor')} disabled={this.isDisabled(1,'input')}/>
                                <small id="valorHelp" className="form-text text-muted">valor acordado de prestamo</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Condiciones">Condiciones</label>
                                <input name="terminos" type="text" onChange={this.handleChangeEtapa2} className="form-control" id="terminos" placeholder="5% mensual" disabled={this.isDisabled(1,'input')}/>
                            </div>
                                <button type="submit" className="btn btn-primary" onClick={this.handleEtapa2} style={{visibility:this.isDisabled(1,'submit')}} >Siguiente Paso</button>
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