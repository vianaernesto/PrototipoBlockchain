import React, { Component } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import jsPDF from 'jspdf';
import DatePicker from 'react-datepicker';
import {registerLocale} from 'react-datepicker';
import es from 'date-fns/locale/es'
import { addYears } from 'date-fns';
import Eth from 'ethjs-query';
import EthContract  from 'ethjs-contract';
import {CircleToBlockLoading} from 'react-loadingg';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Web3 from 'web3';

import "react-datepicker/dist/react-datepicker.css";
import {abi, address} from '../metamask/abi.js';
import './CrearPagare.css';

registerLocale('es', es)

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
            fechaCreacion: new Date(),
            lugarCreacion : "",
            fechaVencimiento : new Date(),
            fechaExpiracion : new Date(),
            etapa : 0,
            terminos : "",
            codigoRetiro: "",
            confirmacionRetiro: "",
            rol : 'acreedor',
            redirect : false,
            pdf : {},
            disableAcreedor : false,
            disableDeudor : false,
            idAceptador : 0,
            cambiado : "false",
            isContrasenia : false,
            contrasenia : '',
            firma : '',
            isSame : false,
            isweb3 : false,
            show: false,
            show2: false,
            account : "",
        }

         this.redirect = this.redirect.bind(this);
         this.handleChangeEtapa1 = this.handleChangeEtapa1.bind(this);
         this.handleEtapa1 = this.handleEtapa1.bind(this);
         this.handleChangeEtapa2 = this.handleChangeEtapa2.bind(this);
         this.handleEtapa2 = this.handleEtapa2.bind(this);
         this.handleEtapa2Aceptar = this.handleEtapa2Aceptar.bind(this);
         this.handleEtapa2Rechazar= this.handleEtapa2Rechazar.bind(this);
         this.handleChangeEtapa3 = this.handleChangeEtapa3.bind(this);
         this.handleEtapa3 = this.handleEtapa3.bind(this);
         this.handleChangeDate = this.handleChangeDate.bind(this);
         this.handleChangeContrasenia = this.handleChangeContrasenia.bind(this);
         this.handleEtapa4 = this.handleEtapa4.bind(this);
         this.isDisabled = this.isDisabled.bind(this);
         this.isSuccessful = this.isSuccessful.bind(this);
         this.renderPreview = this.renderPreview.bind(this);
         this.placeholder = this.placeholder.bind(this);
         this.renderEtapa2 = this.renderEtapa2.bind(this);
         this.renderEtapa3 = this.renderEtapa3.bind(this);
         this.renderEtapa4 = this.renderEtapa4.bind(this);
         this.updatePDF = this.updatePDF.bind(this);
         this.isWeb3 = this.isWeb3.bind(this);
         this.waitForTxToBeMined = this.waitForTxToBeMined.bind(this);
         this.getConfirmation = this.getConfirmation.bind(this);
    }


    componentDidMount(){
        if(this.props.location.state !== undefined){
            let {usuario} = this.props.location.state;
            const {rol} = this.props.location.state;
            let y = `${rol}`;
            if(this.props.location.state.pagare === undefined){
                if(rol === 'acreedor'){
                    this.setState({
                        rol: y,
                        nombreAcreedor : usuario.nombre,
                        idAcreedor :usuario.cedula,
                        disableAcreedor : true,
                        etapa: 0, 
                        id: '', 
                    });
                } else{
                    this.setState({
                        rol: y,
                        nombreDeudor : usuario.nombre,
                        idDeudor :usuario.cedula,
                        disableDeudor : true,
                        etapa: 0, 
                        id: '',
                    });
                }
            } else if(this.props.location.state.pagare !== undefined) {
                let {pagare} = this.props.location.state;
                let idAceptadorNew = 0;
                if(pagare.etapa === 1.5){
                    if(pagare.deudorAcepta){
                        idAceptadorNew = pagare.idDeudor;
                    } else if(pagare.acreedorAcepta){
                        idAceptadorNew = pagare.idAcreedor;
                    };
                }
                if(rol === 'acreedor'){
                    let vencimiento = new Date();
                    if(pagare.fechaVencimiento !== null && pagare.fechaVencimiento !== ''){
                        vencimiento = new Date(pagare.fechaVencimiento);
                    }
                    
                    this.setState({
                        rol: y,
                        etapa: pagare.etapa, 
                        nombreAcreedor : usuario.nombre,
                        disableAcreedor : true,
                        disableDeudor : true,
                        idAcreedor :usuario.cedula,
                        id: pagare._id,
                        codigoRetiro : pagare.codigoRetiro,
                        confirmacionRetiro: pagare.confirmacionRetiro,
                        fechaCreacion : pagare.fechaCreacion,
                        fechaExpiracion : pagare.fechaExpiracion,
                        fechaVencimiento : vencimiento,
                        firma: pagare.firma,
                        idDeudor: pagare.idDeudor,
                        nombreDeudor: pagare.nombreDeudor,
                        terminos : pagare.terminos,
                        valor: pagare.valor,
                        idAceptador : idAceptadorNew,
                        lugarCreacion : pagare.lugarCreacion,
                    });

                } else{
                    let vencimiento = new Date();
                    if(pagare.fechaVencimiento !== null && pagare.fechaVencimiento !== ''){
                        vencimiento = new Date(pagare.fechaVencimiento);
                    }
                    this.setState({
                        rol: y,
                        etapa: pagare.etapa, 
                        id: pagare._id,
                        nombreDeudor : usuario.nombre,
                        idDeudor :usuario.cedula,
                        disableDeudor : true,
                        disableAcreedor: true,
                        codigoRetiro : pagare.codigoRetiro,
                        confirmacionRetiro: pagare.confirmacionRetiro,
                        fechaCreacion : pagare.fechaCreacion,
                        fechaExpiracion : pagare.fechaExpiracion,
                        fechaVencimiento : vencimiento,
                        firma: pagare.firma,
                        idAcreedor : pagare.idAcreedor,
                        nombreAcreedor : pagare.nombreAcreedor,
                        terminos : pagare.terminos,
                        valor: pagare.valor,
                        idAceptador : idAceptadorNew,
                        lugarCreacion : pagare.lugarCreacion,
                    });

                }
            }
            
            
        } else{
            this.setState({redirect: true});
        }
       this.setup();
       this.isWeb3();
    }

    setup(){
        const doc = new jsPDF();
        doc.setFontSize(15);
        doc.text(10,25, `Pagaré No. "Numero de pagaré"`);
        doc.setFontSize(12);
        doc.text(10,35, `Yo "Nombre del Deudor" idenficado con la cedula de ciudadanía "No. cedula" me obligo a pagar`);
        doc.text(10,42, `solidaria e incondicionalmente a favor de "Nombre Acreedor" o de quien represente sus derechos`);
        doc.text(10,49, `o al tenedor legitimo del presente titulo valor en la ciudad de "Ciudad de Creación" la suma de`);
        doc.text(10,56, `"Valor del prestamo" pesos moneda corriente el día "Dia" del mes "`)
        doc.text(10,63, `de "Mes" del "Año".`)
        doc.text(10,70, `Autorizo irrevocablemente a "Nombre del Acreedor"  o a quien represente sus derechos`)
        doc.text(10,77, `o al tenedor legítimo del presente título valor para declarar el plazo vencido el presente`)
        doc.text(10,84, `pagaré y que para tal evento proceda inmediatamente`)
        doc.text(10,260,`Firma: `)
        doc.text(10,260,`Cedula: `)
        const pdf = doc.output('datauristring');
        this.setState({
            pdf:pdf,
        });

    }

    updatePDF(event){
        event.preventDefault();
        let creacion = new Date();
        let dia = creacion.getDate().toString();
        let mes = creacion.getMonth().toString();
        let anio = creacion.getFullYear().toString();
        const doc = new jsPDF();
        doc.setFontSize(15);
        doc.text(10,25, `Pagaré No.  ${this.state.id}`);
        doc.setFontSize(12);
        doc.text(10,35, `Yo ${this.state.nombreDeudor} idenficado con la cedula de ciudadanía ${this.state.idDeudor} me obligo a pagar`);
        doc.text(10,42, `solidaria e incondicionalmente a favor de ${this.state.nombreAcreedor} o de quien represente sus derechos`);
        doc.text(10,49, `o al tenedor legitimo del presente titulo valor en la ciudad de ${this.state.lugarCreacion} la suma de`);
        doc.text(10,56, `${this.state.valor} pesos moneda corriente el día ${dia} del mes ${mes} del ${anio}` )
        doc.text(10,70, `Autorizo irrevocablemente a ${this.state.nombreAcreedor} o a quien represente sus derechos`)
        doc.text(10,77, `o al tenedor legítimo del presente título valor para declarar el plazo vencido el presente`)
        doc.text(10,84, `pagaré y que para tal evento proceda inmediatamente.`)
        doc.text(10,260,`Firma: *`)
        doc.text(10,270,`Cedula: ${this.state.idDeudor}`)
        const pdf = doc.output('datauristring');
        this.setState({
            pdf:pdf,
            cambiado:"true",
        });
    }

    isWeb3(){
        
        if(typeof web3 !== 'undefined'){
            let newWeb3 = new Web3(window.web3.currentProvider);
            newWeb3.eth.getAccounts().then(accounts =>{
                if(accounts.length !== 0){
                    let userAddress = accounts[0];
                    this.setState({
                        account: userAddress,
                    })
                }
            });
            this.setState({
                isweb3 : true,
            })
        }
    }

    renderPreview(){
        const pdf = this.state.pdf;
        if(this.state.cambiado === 'true'){
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
        } else{
            if(this.state.etapa === 0){
                return(
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-4 col-md-4 col-lg-4"></div>
                            <div className="col-4 col-md-4 col-lg-4">
                                <h4 className="text-justify">Aquí se verá una previsualización del pagaré en PDF.</h4>
                                <h4 className="text-justify">Termina el primer paso para pode verlo.</h4>
                            </div>
                            <div className="col-4 col-md-4 col-lg-4"></div>
                        </div>
                    </div>
                )
            } else{
                return(
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-4 col-md-4 col-lg-4"></div>
                            <div className="col-4 col-md-4 col-lg-4">
                                <h4 className="text-justify">Aquí se verá una previsualización del pagaré en PDF.</h4>
                                <h4 className="text-justify">Clickea el boton para poder verlo.</h4>
                            </div>
                            <div className="col-4 col-md-4 col-lg-4"></div>
                        </div>
                    </div>
                )
            }
            
        }
        
        
    }

    redirect(){
        if(this.state.redirect){
            return <Redirect to='/balance'/>
        }
    }

    async handleChangeEtapa1(event){
        event.preventDefault();
        let target = event.target;
        let  value = target.value;
        let name = target.name;
        if(name === 'idDeudor' || name=== 'idAcreedor'){
            value = parseInt(value,10);
        }
        
        await this.setState({
            [name]: value,
        });

        if(this.state.idAcreedor === this.state.idDeudor){
            this.setState({
                isSame : true,
            });
        }else{
            this.setState({
                isSame : false,
            });
        }


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

    handleChangeEtapa3(event){
        event.preventDefault();
        let target = event.target;
        let  value = target.value;
        let name = target.name;
        this.setState({
            [name]: value,
        });
    }

    handleChangeDate(date) {
        this.setState({
            fechaVencimiento : date,
        })
    }
    
    async handleChangeContrasenia(event){
        event.preventDefault();
        let {usuario} = this.props.location.state;
        this.setState({
            contrasenia : event.target.value,
        });
        await axios.post(
            '/users/login',
            {
                "cedula": usuario.cedula ,
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
                    isContrasenia : true,
                });
            } else{
                this.setState({
                    isContrasenia : false,
                });
            }

        }).catch(err => {
            this.setState({
                show2 : true,
            });
        });
    }
    
    async handleEtapa1(event) {
        event.preventDefault();
        var data = {
            nombreDeudor: this.state.nombreDeudor,
            idDeudor : this.state.idDeudor,
            nombreAcreedor: this.state.nombreAcreedor,
            idAcreedor : this.state.idAcreedor,
        }
        
        await axios.post(
            '/pagares/etapa1',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            let pagare = response.data;
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
        let aceptador = this.props.getUsuario().cedula === this.state.idDeudor ? this.state.idAcreedor: this.state.idDeudor 
        this.setState({idAceptador: aceptador});
        var data = {
            valor :this.state.valor,
            terminos : this.state.terminos,
            idAceptador : this.state.idAceptador,
            idDeudor : this.state.idDeudor,
            idAcreedor : this.state.idAcreedor,
        }
        data.idAceptador = aceptador;


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

    handleEtapa2Aceptar(event) {
        event.preventDefault();
        this.setState({idAceptador: this.props.getUsuario().cedula});
        var data = {
            valor :this.state.valor,
            terminos : this.state.terminos,
            idAceptador : this.state.idAceptador,
        }
        
        data.idAceptador = this.props.getUsuario().cedula;


        axios.patch(
            `/pagares/${this.state.id}/etapa2/aceptar`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            let pagare = response.data;
            
            this.setState({etapa: pagare.etapa})
                
        });

    }

    handleEtapa2Rechazar(event){
        event.preventDefault();

        var data = {
            valor :this.state.valor,
            terminos : this.state.terminos,
            idAceptador : this.state.idAceptador,
            idDeudor : this.state.idDeudor,
            idAcreedor : this.state.idAcreedor,
            etapa : 1,
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
            console.log(pagare);
                this.setState({
                    etapa : pagare.etapa,
                });
                
        });

    }

    handleEtapa3(event) {
        event.preventDefault();
        const vencimiento = this.state.fechaVencimiento;
        const vencimientoString = `${vencimiento.getDate()}-${vencimiento.getMonth() +1}-${vencimiento.getFullYear()}`
        var data = {
            lugarCreacion :this.state.lugarCreacion,
            fechaVencimiento : vencimientoString,
            codigoRetiro : this.state.codigoRetiro,
        }
        
        axios.patch(
            `/pagares/${this.state.id}/etapa3/`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(response =>{
            let pagare = response.data;
            
            this.setState({etapa: pagare.etapa})
                
        });

    }


    async handleEtapa4(event){
        event.preventDefault(); 
        let fecha = new Date();
        let fechaExpiracion = new Date(fecha.getFullYear() + 5, fecha.getMonth(), fecha.getDate());
        let fechaVencimiento = new Date(this.state.fechaVencimiento);
        let info = `${fecha.toLocaleDateString()}, ${fechaVencimiento.toLocaleDateString()}, ${fechaExpiracion.toLocaleDateString()}, ${this.state.lugarCreacion}`;
        let infoAcreedor = `${this.state.idAcreedor}, ${this.state.nombreAcreedor}`;
        let infoDeudor = `${this.state.idDeudor}, ${this.state.nombreDeudor}`;
        const eth = new Eth(window.web3.currentProvider);
        const account = this.state.account;
        const contract = new EthContract(eth);
        const MiniToken = contract(abi);
        const miniToken = MiniToken.at(address);
        miniToken.createPagare(this.state.id.toString(), this.state.valor.toString(), infoDeudor, infoAcreedor, info, {from: account}).then((txHash) =>{
            console.log('Transaction sent')
            console.dir(txHash);
    
            this.waitForTxToBeMined(txHash);
                
        }).catch(error=>{
            this.setState({
                show2: true,
            })
        });

    }

    waitForTxToBeMined(txHash){
        var self = this;
        this.setState({
            show : true,
        });
            setTimeout(function(){
                self.getConfirmation(txHash);
            }, 10000);
    }

    getConfirmation(txHash){
        let eth = window.web3.eth;
        var self = this;
        let data = {
            firma : "no importa",
        }
        let id = this.state.id;
        let txReceipt;
        eth.getTransactionReceipt(txHash,function(error, result){
            if(!error){
                txReceipt = result;
                console.log(txReceipt);
                if(txReceipt!= null){
                    axios.patch(`/pagares/${id}/etapa4`, data,{headers:{'Content-Type': 'application/json'}})
                    .then(response =>{
                        self.setState({
                            isContrasenia: false,
                            show: false,
                            redirect:true,
                        });
                    })
                }else{
                    self.waitForTxToBeMined(txHash);
                }
                
            }
            else
                console.error(error);
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
        } else if(element === 'pdf'){
            if(this.state.etapa === 0){
            
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
                return 'Condiciones del prestamo'
            }
        }
        if(input === 'lugarCreacion'){
            if(pEtapa > 3){
                return `${this.state.lugarCreacion}`
            } else{
                return 'Ciudad de Creación Ej: Bogotá'
            }
        }
        if(input === 'fechaVencimiento'){
            if(pEtapa > 3){
                return `${this.state.fechaVencimiento}`
            } else{
                return 'Fecha en la que se espera el pago';
            }
        }
        if(input === 'codigoRetiro'){
            if(pEtapa > 3){
                return `${this.state.codigoRetiro}`
            } else{
                return 'Código de retiro'
            }
        }
    }

    renderEtapa2(){
        if(this.state.etapa === 1 || this.state.etapa ===1.5){
            if(this.state.etapa ===1){
                return(
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
                                <input name="terminos" type="text" onChange={this.handleChangeEtapa2} className="form-control" id="terminos" placeholder={this.placeholder(1,'terminos')} disabled={this.isDisabled(1,'input')}/>
                            </div>
                                <button name="proponer" type="submit" className="btn btn-primary" onClick={this.handleEtapa2} style={{visibility:this.isDisabled(1,'submit')}} >Siguiente Paso</button>
                        </form>
                     </div>
                     <div className="col-6 col-md-6 col-lg-6"></div>
                    </div>
                    <div className="row">&nbsp;</div>
                    </div>
                </div>
            </div>
                )
            } else{

                if(this.state.idAceptador !== this.props.getUsuario().cedula){
                    return(
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
                                <input name="terminos" type="text" onChange={this.handleChangeEtapa2} className="form-control" id="terminos" placeholder={this.placeholder(1,'terminos')} disabled={this.isDisabled(1,'input')}/>
                            </div>
                                <button name="proponer" type="submit" className="btn btn-primary" onClick={this.handleEtapa2} style={{visibility:this.isDisabled(1,'submit')}} >Siguiente Paso</button>
                        </form>
                     </div>
                     <div className="col-6 col-md-6 col-lg-6"></div>
                    </div>
                    <div className="row">&nbsp;</div>
                    </div>
                </div>
            </div>
                    )
                } else{

                    return(
                <div id="accordion">
                <div className="card">
                    <div className="card-header" id="etapa2">
                        <div className="col-md-10">
                            <button className={`btn`} data-toggle="collapse" data-target="#etapa2Collapse" aria-expanded={true} aria-controls="etapa2Collapse" disabled={false} >
                                <h5 className={`title-card-ongoing`}>Acuerdos del prestamo</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa2Collapse" className={`collapse show`} aria-labelledby="etapa2" data-parent="#accordion">
                    <div className="row">
                    <div className="col-1 col-md-1 col-lg-1"></div>
                    <div className="col-5 col-md-5 col-lg-5">
                    <h5> Estas son las condiciones propuestas:</h5>
                        <form>
                            <div className="form-group">
                                <label htmlFor="valor">Valor (en pesos colombianos)</label>
                                <input name="valor" type="number" min="1"  className="form-control" id="valor" aria-describedby="Valor" placeholder={this.state.valor} disabled={true}/>
                                <small id="valorHelp" className="form-text text-muted">valor acordado de prestamo</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Condiciones">Condiciones</label>
                                <input name="terminos" type="text" className="form-control" id="terminos" placeholder={this.state.terminos} disabled={true}/>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-lg-6 col-6">
                                    <button name="proponer" type="submit" className="btn btn-primary" onClick={this.handleEtapa2Aceptar}>Aceptar Condiciones</button>
                                </div>
                                <div className="col-md-6 col-lg-6 col-6">
                                    <button name="rechazar" type="submit" className="btn btn-primary" onClick={this.handleEtapa2Rechazar}>Rechazar Condiciones</button>
                                </div>
                            </div>
                        </form>
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
            
        } else{
            return(
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
                                <label htmlFor="valor">Valor (en pesos colombianos)</label>
                                <input name="valor" type="number" min="1" onChange={this.handleChangeEtapa2} className="form-control" id="valor" aria-describedby="Valor" placeholder={this.placeholder(1,'valor')} disabled={this.isDisabled(1,'input')}/>
                                <small id="valorHelp" className="form-text text-muted">valor acordado de prestamo</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Condiciones">Condiciones</label>
                                <input name="terminos" type="text" onChange={this.handleChangeEtapa2} className="form-control" id="terminos" placeholder={this.placeholder(1,'terminos')} disabled={this.isDisabled(1,'input')}/>
                            </div>
                                <button name="proponer" type="submit" className="btn btn-primary" onClick={this.handleEtapa2} style={{visibility:this.isDisabled(1,'submit')}} >Siguiente Paso</button>
                        </form>
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

    renderEtapa3 () {
        if(this.state.idAcreedor === this.props.getUsuario().cedula){
            return (
                <div id="accordion">
                <div className="card">
                    <div className="card-header" id="etapa3">
                        <div className="col-md-10">
                            <button className={`btn ${this.isSuccessful(2,'card')}  ${this.isDisabled(2,'card')}`} data-toggle="collapse" data-target="#etapa3Collapse" aria-expanded={this.isDisabled(2,'aria')} aria-controls="etapa3Collapse" disabled={this.isDisabled(2,'button')} >
                                <h5 className={`title-card${this.isSuccessful(2,'title')}`}>Acuerdo de Retiro</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa3Collapse" className={`collapse ${this.isDisabled(2,'accordion')}`} aria-labelledby="etapa3" data-parent="#accordion">
                    <div className="row">
                    <div className="col-1 col-md-1 col-lg-1"></div>
                    <div className="col-5 col-md-5 col-lg-5">
                    {this.state.etapa < 2 
                        ? <h3 className="text-left font-weight-bold">Esperando código de retiro del acreedor</h3>
                        :
                        <form>
                            <div className="form-group">
                                <label htmlFor="lugarCreacion">Lugar de Creación</label>
                                <input name="lugarCreacion" type="text" onChange={this.handleChangeEtapa3} className="form-control" id="lugarCreacion" placeholder={this.placeholder(2,'lugarCreacion')} disabled={this.isDisabled(2,'input')}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="fechaVencimiento">Fecha de Vencimiento</label>
                                <DatePicker id="fechaVencimiento" name="fechaVencimiento" locale="es" selected={this.state.fechaVencimiento} onChange={this.handleChangeDate} disabled={this.isDisabled(2,'input')} dateFormat='dd/MM/yyyy' minDate={new Date()} maxDate={addYears(new Date(),5)}/>
                            </div>
                            <div className="form-group">
                                    <label htmlFor="codigoRetiro">Código de retiro</label>
                                    <input name="codigoRetiro" type="text" onChange={this.handleChangeEtapa3} className="form-control" id="codigoRetiro" placeholder={this.placeholder(2,'codigoRetiro')} disabled={this.isDisabled(2,'input')}/>
                                </div>
                                <button name="proponerRetiro" type="submit" className="btn btn-primary" onClick={this.handleEtapa3} style={{visibility:this.isDisabled(2,'submit')}} >Siguiente Paso</button>
                        </form>
                    }
                     </div>
                     <div className="col-6 col-md-6 col-lg-6"></div>
                    </div>
                    <div className="row">&nbsp;</div>
                    </div>
                </div>
            </div>
            );
        } else{
            return (
                <div id="accordion">
                <div className="card">
                    <div className="card-header" id="etapa3">
                        <div className="col-md-10">
                            <button className={`btn ${this.state.etapa < 2 ? '': this.state.etapa === 2 ? 'btn-warning': 'btn-success'}`} data-toggle="collapse" data-target="#etapa3Collapse" aria-expanded={this.isDisabled(2,'aria')} aria-controls="etapa3Collapse" disabled={this.state.etapa < 2 ? true : false }>
                                <h5 className={`title-card-${this.state.etapa < 2 ? 'ongoing' : 'success'}`}>Acuerdo de Retiro</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa3Collapse" className={`collapse ${this.isDisabled(2,'accordion')}`} aria-labelledby="etapa3" data-parent="#accordion">
                    <div className="row">
                    <div className="col-1 col-md-1 col-lg-1"></div>
                    <div className="col-5 col-md-5 col-lg-5">
                    {this.state.etapa < 3 
                    ? <h3 className="text-left font-weight-bold">Esperando código de retiro del acreedor</h3>
                    :
                    <form>
                        <div className="form-group">
                            <label htmlFor="lugarCreacion">Lugar de Creación</label>
                            <input name="lugarCreacion" type="text" onChange={this.handleChangeEtapa3} className="form-control" id="lugarCreacion" placeholder={this.placeholder(2,'lugarCreacion')} disabled={this.isDisabled(2,'input')}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fechaVencimiento">Fecha de Vencimiento</label>
                            <DatePicker id="fechaVencimiento" name="fechaVencimiento" locale="es" selected={this.state.fechaVencimiento} onChange={this.handleChangeDate} disabled={this.isDisabled(2,'input')} dateFormat='dd/MM/yyyy' />
                        </div>
                        <div className="form-group">
                        <label>Código de retiro</label>
                        <h5 className="text-center">Cuando Firmes obtendras el código para retirar el dinero</h5>
                        </div>
                            <button name="proponerRetiro" type="submit" className="btn btn-primary" onClick={this.handleEtapa3} style={{visibility:this.isDisabled(2,'submit')}} >Siguiente Paso</button>
                    </form>
                    }      
                    </div>
                    <div className="col-6 col-md-6 col-lg-6"></div>
                    </div>
                    <div className="row">&nbsp;</div>
                    </div>
                </div>
            </div>
            );
        }
    }
    
    renderEtapa4(){
        if(this.state.idDeudor === this.props.getUsuario().cedula){
            return (
                <div id="accordion">
                <div className="card">
                    <div className="card-header" id="etapa4">
                        <div className="col-md-10">
                            <button className={`btn ${this.isSuccessful(3,'card')}  ${this.isDisabled(3,'card')}`} data-toggle="collapse" data-target="#etapa4Collapse" aria-expanded={this.isDisabled(3,'aria')} aria-controls="etapa4Collapse" disabled={this.isDisabled(3,'button')} >
                                <h5 className={`title-card${this.isSuccessful(3,'title')}`}>Firma</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa4Collapse" className={`collapse ${this.isDisabled(3,'accordion')}`} aria-labelledby="etapa4" data-parent="#accordion">
                    <div className="row">
                    <div className="col-1 col-md-1 col-lg-1"></div>
                    <div className="col-5 col-md-5 col-lg-5">
                        <p>&nbsp;</p>
                        <p className="text-center font-weight-bold">Antes de Firmar por favor revisa la previsualización del pagaré.</p>
                        <form>
                            <div className="form-group">
                                <label htmlFor="contrasenia">Digite su contraseña para poder firmar:</label>
                                <input name="contrasenia" type="password" onChange={this.handleChangeContrasenia} className="form-control" id="contrasenia" placeholder="Contraseña" disabled={this.isDisabled(3,'input')}/>
                            </div>
                                <button name="firmar" type="submit" className="btn btn-success" onClick={this.handleEtapa4} disabled={!this.state.isContrasenia && this.state.isweb3}>Firmar</button>
                        </form>
                     </div>
                     <div className="col-6 col-md-6 col-lg-6"></div>
                    </div>
                    <div className="row">&nbsp;</div>
                    </div>
                </div>
            </div>
            );
        } else{
            return (
                <div id="accordion">
                <div className="card">
                    <div className="card-header" id="etapa4">
                        <div className="col-md-10">
                            <button className={`btn ${this.state.etapa === 3? 'btn-warning': ''}  ${this.isDisabled(3,'card')}`} data-toggle="collapse" data-target="#etapa4Collapse" aria-expanded={this.isDisabled(3,'aria')} aria-controls="etapa4Collapse" disabled={this.isDisabled(3,'button')}>
                                <h5 className={`title-card-${this.state.etapa === 3? 'success': 'ongoing'}`}>Firma</h5>
                            </button>
                        </div>
                    </div>

                    <div id="etapa4Collapse" className={`collapse ${this.isDisabled(3,'accordion')}`} aria-labelledby="etapa4" data-parent="#accordion">
                        <div className="row">
                            <div className="col-1 col-md-1 col-lg-1"></div>
                            <div className="col-5 col-md-5 col-lg-5">
                                <p>&nbsp;</p>
                                <h3 className="text-left font-weight-bold">Esperando la firma del deudor</h3>
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
                    <button className="but-solid" onClick={this.updatePDF} style={{visibility:this.isDisabled(0,'pdf')}}>Click para actualizar</button>
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
                            <button type="submit" className="btn btn-primary" onClick={this.handleEtapa1} style={{visibility:this.isDisabled(0,'submit')}} disabled={this.state.isSame}>Siguiente Paso</button>
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
            {this.renderEtapa2()}
            <div className="row">&nbsp;</div>
            {this.renderEtapa3()}
            <div className="row">&nbsp;</div>
            {this.renderEtapa4()}
            <div className="row">&nbsp;</div>
        </div>
        <div className="col-md-6 col-lg-6 col-6">{this.renderPreview()}</div>
        </div>
        <Modal show={this.state.show2} onHide={()=>{this.setState({show2:false})}}>
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
                <h6>&nbsp;Para firmar el pagaré necesitas confirmar la transacción</h6>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className="but-solid" onClick={() =>{this.setState({show2:false})}}>
                Cerrar
            </Button>
            </Modal.Footer>
        </Modal>
        <Modal show={this.state.show}>
            <Modal.Header>
                <Modal.Title>Esperando confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <h6>&nbsp;Se está confirmando la transacción, cuando se confirme te redigiremos a tu balance.</h6>
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
        </div>  );
    }
}
 
export default CrearPagare;