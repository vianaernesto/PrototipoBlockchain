import React, { Component } from "react";
import {Redirect, Link} from 'react-router-dom';
import axios from "axios";
import jsPDF from 'jspdf';
import QRCode from 'qrcode'
import {Col, Row, Nav, Tab, NavItem, NavLink, TabContent, TabPane} from 'react-bootstrap';
import { EscenarioContext } from '../Context/context';
import { abiEther, addressEther } from '../metamask/abi.js';
import Web3 from 'web3';
import Eth from 'ethjs-query';
import EthContract from 'ethjs-contract';

import './PagareDetail.css';

class PagareDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : "",
            codigoRetiro: "",
            fechaCreacion : "",
            fechaExpiracion : "",
            fechaVencimiento : "",
            firma : "",
            idAcreedor : 0,
            idDeudor : 0,
            lugarCumplimiento : "",
            nombreAcreedor : "",
            nombreDeudor : "",
            valor : "",
            ultimoEndoso : "",
            redirect : false,
            canEndose : false,
            pdf : {},
            endosos: [],
        };

        this.renderPDF = this.renderPDF.bind(this);
        this.redirect = this.redirect.bind(this);
        this.setUpPDF = this.setUpPDF.bind(this);
        this.setUpPDFEther = this.setUpPDFEther.bind(this);
        this.renderNormal = this.renderNormal.bind(this);
    }

    componentDidMount(){
        if(this.props.location.state !== undefined){
            let pagare = this.props.location.state.pagare;
            let rol = this.props.location.state.rol;
            if(this.props.location.state.rol !== undefined && this.props.location.state.usuario !== undefined){
                this.setState({
                    canEndose : true
                })
            }
            if(this.context.escenario === "Ether" && typeof window.web3 !== 'undefined'){
                this.setState({
                    id: pagare.id,
                    fechaCreacion: pagare.fechaCreacion,
                    fechaVencimiento: pagare.fechaVencimiento,
                    idAcreedor : pagare.idAcreedor,
                    idDeudor : pagare.idDeudor,
                    nombreAcreedor : pagare.nombreAcreedor,
                    nombreDeudor : pagare.nombreDeudor,
                    valor : pagare.valorPeso,
                    lugarCreacion: pagare.lugarCreacion,
                })
                let newWeb3 = new Web3(window.web3.currentProvider);
                window.ethereum.enable().then(enabled => {
                let endososLocal = [];
                setInterval(() => {
                    if(this.state.endosos.length === 0){
                        newWeb3.eth.getAccounts().then(accounts => {
                            const eth = new Eth(window.web3.currentProvider);
                            const account = accounts[0];
                            const contract = new EthContract(eth);
                            const MiniToken = contract(abiEther);
                            const miniToken = MiniToken.at(addressEther);
                            miniToken.getEndososPagare(pagare.id,{from:account})
                            .then(res =>{
                                let resultado = res[0];
                                let found = false;
                                let endosoFinal = {};
                                for(let i = 0; i < resultado.length; i++){
                                    if(resultado[i].es_ultimo_endoso){
                                        endosoFinal=resultado[i];
                                        found= true;
                                    };
                                    endososLocal.concat(resultado[i]);
                                }
                                if(endosoFinal.id_endosatario === this.props.location.state.usuario.cedula || (resultado.length === 0 && rol === "acreedor")){
                                    this.setState({
                                        endosos:endososLocal,
                                        canEndose: true,
                                    })
                                }else{
                                    this.setState({
                                        endosos:endososLocal,
                                        canEndose:false,
                                    })
                                }
                                
                            });
                    })
                  }
                }, 100);
                this.setUpPDFEther(pagare,endososLocal);
                
            });
        }
            else{
                if(pagare.ultimoEndoso !== "null" && this.props.location.state.usuario){
                    axios.get(`/endosos/pagare/${pagare._id}`,{headers : {"Content-Type" : "application/json"}})
                        .then(response =>{
                            let data = response.data.reverse();
                            let found = false;
                            let endosoFinal = {};
                            for(let i = 0; i < data.length, !found; i++){
                                if(data[i].es_ultimo_endoso){
                                    endosoFinal=data[i];
                                    found = true;
                                }
                            }
                            if(endosoFinal.id_endosatario === this.props.location.state.usuario.cedula){
                                this.setState({
                                    id : pagare._id,
                                    codigoRetiro: pagare.codigoRetiro,
                                    fechaCreacion : pagare.fechaCreacion,
                                    fechaExpiracion : pagare.fechaExpiracion,
                                    fechaVencimiento : pagare.fechaVencimiento,
                                    firma : pagare.firma,
                                    idAcreedor : pagare.idAcreedor,
                                    idDeudor : pagare.idDeudor,
                                    lugarCumplimiento : pagare.pendiente ? "": pagare.lugarCumplimiento,
                                    nombreAcreedor : pagare.nombreAcreedor,
                                    nombreDeudor : pagare.nombreDeudor,
                                    valor : pagare.valor,
                                    endosos : data,
                                    canEndose: true,
                                });
                            }else{
                                this.setState({
                                    id : pagare._id,
                                    codigoRetiro: pagare.codigoRetiro,
                                    fechaCreacion : pagare.fechaCreacion,
                                    fechaExpiracion : pagare.fechaExpiracion,
                                    fechaVencimiento : pagare.fechaVencimiento,
                                    firma : pagare.firma,
                                    idAcreedor : pagare.idAcreedor,
                                    idDeudor : pagare.idDeudor,
                                    lugarCumplimiento : pagare.pendiente ? "": pagare.lugarCumplimiento,
                                    nombreAcreedor : pagare.nombreAcreedor,
                                    nombreDeudor : pagare.nombreDeudor,
                                    valor : pagare.valor,
                                    endosos : data,
                                    lugarCreacion : pagare.lugarCreacion,
                                });
                            }
                            this.setUpPDF(pagare,data);
                        });
                }else{
                    let  data = [];
                    this.setState({
                        id : pagare._id,
                        codigoRetiro: pagare.codigoRetiro,
                        fechaCreacion : pagare.fechaCreacion,
                        fechaExpiracion : pagare.fechaExpiracion,
                        fechaVencimiento : pagare.fechaVencimiento,
                        firma : pagare.firma,
                        idAcreedor : pagare.idAcreedor,
                        idDeudor : pagare.idDeudor,
                        lugarCumplimiento : pagare.pendiente ? "": pagare.lugarCumplimiento,
                        nombreAcreedor : pagare.nombreAcreedor,
                        nombreDeudor : pagare.nombreDeudor,
                        valor : pagare.valor,
                    });
                    this.setUpPDF(pagare,data);
                }
            }
        }else{
            this.setState({redirect:true});
        }
    }

    async setUpPDF(pagare,endososPasados){
        let creacion = new Date(pagare.fechaCreacion)
        let dia = creacion.getDate().toString();
        let mes = (creacion.getMonth()+1).toString();
        let anio = creacion.getFullYear().toString();
        let counter = 0;
        const doc = new jsPDF();
        doc.setFontSize(15);
        doc.text(10, 25, `Pagaré No.  ${pagare._id}`);
        doc.setFontSize(12);
        doc.text(10,35, `Yo ${pagare.nombreDeudor} idenficado con la cedula de ciudadanía ${pagare.idDeudor} me obligo `);
        doc.text(10,42, `a pagar solidaria e incondicionalmente a favor de ${pagare.nombreAcreedor}`);
        doc.text(10,49, 'o de quien represente sus derechos')
        doc.text(10,56, `o al tenedor legitimo del presente titulo valor en la ciudad de ${pagare.lugarCreacion} la suma de`);
        doc.text(10,63, `${pagare.valor} pesos moneda corriente el día ${dia} del mes de ${mes} del ${anio}. `)
        doc.text(10,77, `Autorizo irrevocablemente a ${pagare.nombreAcreedor} o a quien represente sus derechos`)
        doc.text(10,84, `o al tenedor legítimo del presente título valor para declarar el plazo vencido el presente`)
        doc.text(10,91, `pagaré y que para tal evento proceda inmediatamente.`)
        doc.text(10,260,`Firma: ${pagare.firma}`)
        doc.text(10,270,`Cedula: ${pagare.idDeudor}`)
        var urlString = 'https://ropsten.etherscan.io/tx/' + pagare.firma
        var canvas = await QRCode.toCanvas(urlString)
        var myImage = canvas.toDataURL("image/jpeg,1.0");
        var imgWidth = (canvas.width * 20) / 240;
        var imgHeight = (canvas.height * 20) / 240; 
        // jspdf changes
        doc.addImage(myImage, 'JPEG', 5, 190, imgWidth*4, imgHeight*4);
        if(endososPasados.length !== 0){
            doc.addPage();
        }
        let endososPDF = endososPasados.reverse();
        for (let x in endososPDF) {
            if(counter > 290){
                doc.addPage();
                counter = 0;
            }
            if(endososPDF[x].etapa === 3){
                if(endososPDF[x].es_ultimo_endoso){
                    doc.setTextColor(255, 0, 0);
                    doc.text(10, 18 + counter, `Endoso #${parseInt(x)+1} (Último Endoso)`)
                }else{
                    doc.setTextColor(255, 0, 0);
                    doc.text(10, 18 + counter, `Endoso #${parseInt(x)+1}`)
                }
                doc.setTextColor(0,0,0);
                let fecha = new Date(endososPDF[x].fecha);
                doc.text(10, 25 + counter, `Endosante: ${endososPDF[x].nombre_endosante}`)
                doc.text(10, 32 + counter, `Cedula Endosante: ${endososPDF[x].id_endosante}`)
                doc.text(10, 39 + counter, `Endosatario: ${endososPDF[x].nombre_endosatario}`)
                doc.text(10, 46 + counter, `Cedula Endosatario: ${endososPDF[x].id_endosatario}`)
                doc.text(10, 53 + counter, `Fecha Endoso: ${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`)
                doc.text(10, 60 + counter, `Firma: ${endososPDF[x].firma}`)
                counter += 55;
            }
                
        }
        const pdf = doc.output('datauristring');
        this.setState({
            pdf:pdf,
        });
    }

    async setUpPDFEther(pagare,endososPasados){
        let creacion = new Date(pagare.fechaCreacion)
        let dia = creacion.getDate().toString();
        let mes = (creacion.getMonth()+1).toString();
        let anio = creacion.getFullYear().toString();
        let counter = 0;
        const doc = new jsPDF();
        doc.setFontSize(15);
        doc.text(10, 25, `Pagaré No.  ${pagare.id}`);
        doc.setFontSize(12);
        doc.text(10,35, `Yo ${pagare.nombreDeudor} idenficado con la cedula de ciudadanía ${pagare.idDeudor} me obligo `);
        doc.text(10,42, `a pagar solidaria e incondicionalmente a favor de ${pagare.nombreAcreedor}`);
        doc.text(10,49, 'o de quien represente sus derechos')
        doc.text(10,56, `o al tenedor legitimo del presente titulo valor en la ciudad de ${pagare.lugarCreacion} la suma de`);
        doc.text(10,63, `${pagare.valor} pesos moneda corriente el día ${dia} del mes de ${mes} del ${anio}. `)
        doc.text(10,77, `Autorizo irrevocablemente a ${pagare.nombreAcreedor} o a quien represente sus derechos`)
        doc.text(10,84, `o al tenedor legítimo del presente título valor para declarar el plazo vencido el presente`)
        doc.text(10,91, `pagaré y que para tal evento proceda inmediatamente.`)
        doc.text(10,270,`Cedula: ${pagare.idDeudor}`)
        var urlString = 'https://ropsten.etherscan.io/tx/' + pagare.firma
        var canvas = await QRCode.toCanvas(urlString)
        var myImage = canvas.toDataURL("image/jpeg,1.0");
        var imgWidth = (canvas.width * 20) / 240;
        var imgHeight = (canvas.height * 20) / 240; 
        // jspdf changes
        doc.addImage(myImage, 'JPEG', 5, 190, imgWidth*4, imgHeight*4);
        if(endososPasados.length !== 0){
            doc.addPage();
        }
        let endososPDF = endososPasados.reverse();
        for (let x in endososPDF) {
            if(counter > 290){
                doc.addPage();
                counter = 0;
            }
            if(endososPDF[x].etapa === 3){
                if(endososPDF[x].es_ultimo_endoso){
                    doc.setTextColor(255, 0, 0);
                    doc.text(10, 18 + counter, `Endoso #${parseInt(x)+1} (Último Endoso)`)
                }else{
                    doc.setTextColor(255, 0, 0);
                    doc.text(10, 18 + counter, `Endoso #${parseInt(x)+1}`)
                }
                doc.setTextColor(0,0,0);
                let fecha = new Date(endososPDF[x].fecha);
                doc.text(10, 25 + counter, `Endosante: ${endososPDF[x].nombre_endosante}`)
                doc.text(10, 32 + counter, `Cedula Endosante: ${endososPDF[x].id_endosante}`)
                doc.text(10, 39 + counter, `Endosatario: ${endososPDF[x].nombre_endosatario}`)
                doc.text(10, 46 + counter, `Cedula Endosatario: ${endososPDF[x].id_endosatario}`)
                doc.text(10, 53 + counter, `Fecha Endoso: ${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`)
                doc.text(10, 60 + counter, `Firma: ${endososPDF[x].firma}`)
                counter += 55;
            }
                
        }
        const pdf = doc.output('datauristring');
        this.setState({
            pdf:pdf,
        });
    }

    redirect(){
        if(this.state.redirect){
            return <Redirect to='/balance'/>
        }
    }

    renderPDF(){
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
    
    renderNormal(){
        if(this.state.endosos.length ===0 || (this.state.endosos.length === 1 && this.state.endosos[0].etapa <3)){
            return (
                <div className="content-body host">
                    {this.redirect()}
                    {this.state.canEndose
                    ?   <div className="row">
                            <div className="col-md-2 col-2 col-lg-2"></div>
                            <div className="col-md-6 col-6 col-lg-6">
                                <Link to ={{pathname: '/endoso/crear/', state: {pagare : this.props.location.state.pagare, endoso2:this.state.endosos[0], usuario: {nombre: this.state.nombre, cedula:this.state.cedulaUsuario}}}}><button className={`but-solid`}>Endosar Pagaré</button></Link>
                            </div>
                            <div className="col-md-4 col-4 col-lg-4"></div>
                        </div>
                    :   <div></div>
                }
                    <div className="row">&nbsp;</div>
                    <div className="row">
                        <div className="col-md-12 col-12 col-lg-12">
                            {this.renderPDF()}
                        </div>
                    </div>
                    <div className="row">&nbsp;</div>
                </div>
            );
        } else{
            return(
                <div className="content-body host">
                {this.redirect()}
                {this.state.canEndose
                ?   <div className="row">
                        <div className="col-md-2 col-2 col-lg-2"></div>
                        <div className="col-md-6 col-6 col-lg-6">
                            <Link to ={{pathname: '/endoso/crear/', state: {pagare : this.props.location.state.pagare,endoso2:this.state.endosos[0], usuario: {nombre: this.state.nombre, cedula:this.state.cedulaUsuario}}}}><button className={`but-solid`}>Endosar Pagaré</button></Link>
                        </div>
                        <div className="col-md-4 col-4 col-lg-4"></div>
                    </div>
                :   <div></div>
                }
                <div className="row">&nbsp;</div>
                <div className="row">
                    <div className="col-md-6 col-6 col-lg-6">
                        {this.renderPDF()}
                    </div>
                    <div className="col-md-6 col-6 col-lg-6">
                        <div className="row">
                            <Tab.Container id="endosos-left" defaultActiveKey={`${"0"}`}>
                            <Row>
                                <Col sm={6} lg={6}>
                                    <Nav variant="pills" className="flex-column">
                                    {this.state.endosos.map((x,i) =>{
                                            if(x.etapa > 2){
                                                return(
                                                    <NavItem>
                                                        <NavLink eventKey={`${i}`}>
                                                            <h6 style={{color:"black"}}>{`Endosado por: ${x.nombre_endosante} `}
                                                                {x.es_ultimo_endoso ? <span className="badge badge-success">Último Endoso</span> : <span></span>}</h6>
                                                        </NavLink>
                                                    </NavItem>
                                                )
                                            }
                                        })}
                                    </Nav>
                                </Col>
                                <Col sm={6} lg={6}>
                                    <TabContent defaultChecked={`${"0"}`}>
                                    {this.state.endosos.map((x,i)=>{
                                            if(x.etapa > 2){
                                                return(
                                                        <TabPane eventKey={`${i}`}>
                                                        <div className="row">
                                                                <div className="col-md-12 col-lg-12">
                                                                    <h6 className="font-weight-bold">
                                                                        Nombre Endosante:
                                                                    </h6>
                                                                    <h6 >
                                                                        {x.nombre_endosante}
                                                                    </h6>
                                                                    Cedula Endosante:
                                                                    
                                                                    <h6>
                                                                        {x.id_endosante}
                                                                    </h6>  
                                                                    <h6 className="font-weight-bold">
                                                                        Firma Endosante:
                                                                        
                                                                    </h6>
                                                                    <h6>
                                                                        {x.firma}
                                                                    </h6>
                                                                    <h6 className="font-weight-bold">
                                                                        Nombre Endosatario:
                                                                    </h6>
                                                                    <h6>
                                                                    {x.nombre_endosatario}
                                                                    </h6>
                                                                    <h6 className="font-weight-bold">
                                                                        Cedula Endosatario:
                                                                       
                                                                    </h6>
                                                                    <h6>
                                                                        {x.id_endosatario}
                                                                    </h6>
                                                                    <h6 className="font-weight-bold">
                                                                        Fecha de Endosamiento:
                                                                    </h6>
                                                                    <h6>
                                                                    {`${new Date(x.fecha).getDate()}/${new Date(x.fecha).getMonth() + 1}/${new Date(x.fecha).getFullYear()}`}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </TabPane>
                                                )
                                            }
                                        })}
                                    </TabContent>
                                </Col>
                            </Row>
                            </Tab.Container>
                        </div>
                    </div>
                </div>
                <div className="row">&nbsp;</div>
            </div>
            )
        }
    }

    renderEther(){
            if(this.state.endosos.length ===0){
                return (
                    <div className="content-body host">
                        {this.redirect()}
                        {this.state.canEndose
                        ?   <div className="row">
                                <div className="col-md-2 col-2 col-lg-2"></div>
                                <div className="col-md-6 col-6 col-lg-6">
                                    <Link to ={{pathname: '/endoso/crear/', state: {pagare : this.props.location.state.pagare, endoso2:this.state.endosos[0], usuario: {nombre: this.state.nombre, cedula:this.state.cedulaUsuario}}}}><button className={`but-solid`}>Endosar Pagaré</button></Link>
                                </div>
                                <div className="col-md-4 col-4 col-lg-4"></div>
                            </div>
                        :   <div></div>
                    }
                        <div className="row">&nbsp;</div>
                        <div className="row">
                            <div className="col-md-12 col-12 col-lg-12">
                                {this.renderPDF()}
                            </div>
                        </div>
                        <div className="row">&nbsp;</div>
                    </div>
                );
            } else{
                return(
                    <div className="content-body host">
                    {this.redirect()}
                    {this.state.canEndose
                    ?   <div className="row">
                            <div className="col-md-2 col-2 col-lg-2"></div>
                            <div className="col-md-6 col-6 col-lg-6">
                                <Link to ={{pathname: '/endoso/crear/', state: {pagare : this.props.location.state.pagare,endoso2:this.state.endosos[0], usuario: {nombre: this.state.nombre, cedula:this.state.cedulaUsuario}}}}><button className={`but-solid`}>Endosar Pagaré</button></Link>
                            </div>
                            <div className="col-md-4 col-4 col-lg-4"></div>
                        </div>
                    :   <div></div>
                    }
                    <div className="row">&nbsp;</div>
                    <div className="row">
                        <div className="col-md-6 col-6 col-lg-6">
                            {this.renderPDF()}
                        </div>
                        <div className="col-md-6 col-6 col-lg-6">
                            <div className="row">
                                <Tab.Container id="endosos-left" defaultActiveKey={`${"0"}`}>
                                <Row>
                                    <Col sm={6} lg={6}>
                                        <Nav variant="pills" className="flex-column">
                                        {this.state.endosos.map((x,i) =>{
                                                    return(
                                                        <NavItem>
                                                            <NavLink eventKey={`${i}`}>
                                                                <h6 style={{color:"black"}}>{`Endosado por: ${x.nombre_endosante} `}
                                                                    {x.es_ultimo_endoso ? <span className="badge badge-success">Último Endoso</span> : <span></span>}</h6>
                                                            </NavLink>
                                                        </NavItem>
                                                    )
                                            })}
                                        </Nav>
                                    </Col>
                                    <Col sm={6} lg={6}>
                                        <TabContent defaultChecked={`${"0"}`}>
                                        {this.state.endosos.map((x,i)=>{
                                                    return(
                                                            <TabPane eventKey={`${i}`}>
                                                            <div className="row">
                                                                    <div className="col-md-12 col-lg-12">
                                                                        <h6 className="font-weight-bold">
                                                                            Nombre Endosante:
                                                                        </h6>
                                                                        <h6 >
                                                                            {x.nombre_endosante}
                                                                        </h6>
                                                                        Cedula Endosante:
                                                                        
                                                                        <h6>
                                                                            {x.id_endosante}
                                                                        </h6>  
                                                                        <h6 className="font-weight-bold">
                                                                            Firma Endosante:
                                                                            
                                                                        </h6>
                                                                        <h6>
                                                                            {x.firma}
                                                                        </h6>
                                                                        <h6 className="font-weight-bold">
                                                                            Nombre Endosatario:
                                                                        </h6>
                                                                        <h6>
                                                                        {x.nombre_endosatario}
                                                                        </h6>
                                                                        <h6 className="font-weight-bold">
                                                                            Cedula Endosatario:
                                                                           
                                                                        </h6>
                                                                        <h6>
                                                                            {x.id_endosatario}
                                                                        </h6>
                                                                        <h6 className="font-weight-bold">
                                                                            Fecha de Endosamiento:
                                                                        </h6>
                                                                        <h6>
                                                                        {`${new Date(x.fecha).getDate()}/${new Date(x.fecha).getMonth() + 1}/${new Date(x.fecha).getFullYear()}`}
                                                                        </h6>
                                                                    </div>
                                                                </div>
                                                            </TabPane>
                                                    )
                                                
                                            })}
                                        </TabContent>
                                    </Col>
                                </Row>
                                </Tab.Container>
                            </div>
                        </div>
                    </div>
                    <div className="row">&nbsp;</div>
                </div>
                )
            }
    }

    render() { 
        if(this.context.escenario !== "Ether"){
            return this.renderNormal();
        }else{
           return this.renderEther();
        }
    }
}

PagareDetail.contextType = EscenarioContext;
 
export default PagareDetail;