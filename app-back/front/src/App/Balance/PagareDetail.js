import React, { Component } from "react";
import {Redirect} from 'react-router-dom';
import axios from "axios";
import jsPDF from 'jspdf';

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
        this.renderEndosos = this.renderEndosos.bind(this);
    }

    componentDidMount(){
        if(this.props.location.state !== undefined){
            let pagare = this.props.location.state.pagare;
            if(this.props.location.state.rol !== undefined && this.props.location.state.usuario !== undefined){
                this.setState({
                    canEndose : true
                })
            }
            if(pagare.ultimoEndoso !== null){
                axios.get(`endosos/${pagare._id}/endosos`,{headers : {"Content-Type" : "application/json"}})
                    .then(response =>{
                        let data = response.data;
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
                })
            }
            
        this.setUpPDF(pagare);
        }else{
            this.setState({redirect:true});
        }
    }

    setUpPDF(pagare){
        console.log(pagare);
        let creacion = new Date(pagare.fechaCreacion)
        let dia = creacion.getDate().toString();
        let mes = creacion.getMonth().toString();
        let anio = creacion.getFullYear().toString();
        const doc = new jsPDF();
        doc.setFontSize(15);
        doc.text(10,25, `Pagaré No.  ${pagare._id}`);
        doc.setFontSize(12);
        doc.text(10,35, `Yo ${pagare.nombreDeudor} idenficado con la cedula de ciudadanía ${pagare.idDeudor} me obligo a pagar`);
        doc.text(10,42, `solidaria e incondicionalmente a favor de ${pagare.nombreAcreedor} o de quien represente sus derechos`);
        doc.text(10,49, `o al tenedor legitimo del presente titulo valor en la ciudad de ${pagare.lugarCreacion} la suma de`);
        doc.text(10,56, `${pagare.valor} pesos moneda corriente el día ${dia} del mes de ${mes} del ${anio}. `)
        doc.text(10,70, `Autorizo irrevocablemente a ${pagare.nombreAcreedor} o a quien represente sus derechos`)
        doc.text(10,77, `o al tenedor legítimo del presente título valor para declarar el plazo vencido el presente`)
        doc.text(10,84, `pagaré y que para tal evento proceda inmediatamente.`)
        doc.text(10,260,`Firma: ${pagare.firma}`)
        doc.text(10,270,`Cedula: ${pagare.idDeudor}`)
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

    renderEndosos(){
        this.state.endosos.map((x,i) =>{
            return(
                <div key={i}>
                    <div className="col-lg-4 col-md-8 col-sm-12">
                        <div className="card" style={{width: "18em"}}>
                            <div className="card-body">
                            <p className="card-text text-left" style={{fontWeight:"bold"}}>Endoso #{x._id}</p>
                            <h2 className="card-title"><span className="text-left font-weight-bold">Nombre Titular:</span><span className="text-right"> ${x.nombre_endosatario}</span></h2>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><span  className="text-left font-weight-bold">Cédula Endosante: </span><span className="text-right">{x.id_endosante}</span></li>
                                <li className="list-group-item"><span  className="text-left font-weight-bold">Fecha de Endosamiento: </span><span className="text-right">{new Date(x.fecha).getDate()}/{new Date(x.fecha).getMonth() + 1}/{new Date(x.fecha).getFullYear()}</span></li>
                                <li className="list-group-item"><span  className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                <li className="list-group-item"><span  className="text-left font-weight-bold">Fecha de Expiración: </span><span className="text-right">{new Date(x.fechaExpiracion).getDate()}/{new Date(x.fechaExpiracion).getMonth() + 1}/{new Date(x.fechaExpiracion).getFullYear()}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        });
    }

    render() { 
        if(this.state.endosos.length ===0){
            return (
                <div className="content-body host">
                    {this.redirect()}
                    {this.state.canEndose
                    ?   <div className="row">
                            <div className="col-md-3 col-3 col-lg-3"></div>
                            <div className="col-md-6 col-6 col-lg-6">
                                <button className="but-solid" onClick={this.endosar}>Endosar</button>
                            </div>
                            <div className="col-md-3 col-3 col-lg-3"></div>
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
                        <div className="col-md-3 col-3 col-lg-3"></div>
                        <div className="col-md-6 col-6 col-lg-6">
                            <button className="but-solid" onClick={this.endosar}>Endosar</button>
                        </div>
                        <div className="col-md-3 col-3 col-lg-3"></div>
                    </div>
                :   <div></div>
            }
                <div className="row">&nbsp;</div>
                <div className="row">
                    <div className="col-md-6 col-6 col-lg-6">
                        {this.renderPDF()}
                    </div>
                    <div className="col-md-6 col-6 col-lg-6">
                        {this.renderEndosos()}
                    </div>
                </div>
                <div className="row">&nbsp;</div>
            </div>
            )
        }
        
    }
}
 
export default PagareDetail;