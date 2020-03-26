import React, { Component } from "react";

class PagareDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
                    id: "001",
                    valor: 100000,
                    nombreDeudor: "Alberto Gomez",
                    cedulaDeudor: "1020817633",
                    fechaCreacion: "10-03-2020",
                    lugarCreacion: "Bogotá D.C.",
                    fechaVencimiento: "10-03-2021",
                    fechaExpiracion: "10-03-2021",
                    lugarCumplimiento: "Bogotá D.C.",
                    nombreAcreedor: "Juan Perez",
                    cedulaAcreedor: "1020384728",
                    firma: "f0f0cd0de23d2dce212"
        };
    }
    render() { 
        return (
            <div className="host">
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                   &nbsp;
                </div>
                <div className="col-lg-6 col-6 col-md-6 text-center">
                &nbsp;
                </div>
            </div>
                <div className="row" id="CardsContainer">
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Pagaré</font></div>
                            <div className="card-body">
                                <h5 className="card-title">#{this.state.id}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Valor</font></div>
                            <div className="card-body">
                                <h5 className="card-title">${this.state.valor}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                </div>
                <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                   &nbsp;
                </div>
                <div className="col-lg-6 col-6 col-md-6 text-center">
                &nbsp;
                </div>
                </div>
                <div className="row" id="CardsContainer">
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Nombre Del Deudor</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.nombreDeudor}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Nombre del Acreedor</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.nombreAcreedor}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                </div>
                <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                   &nbsp;
                </div>
                <div className="col-lg-6 col-6 col-md-6 text-center">
                &nbsp;
                </div>
                </div>
                <div className="row" id="CardsContainer">
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Cédula del Deudor</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.cedulaDeudor}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Cedula del Acreedor</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.cedulaAcreedor}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                </div>
                <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                   &nbsp;
                </div>
                <div className="col-lg-6 col-6 col-md-6 text-center">
                &nbsp;
                </div>
                </div>
                <div className="row" id="CardsContainer">
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Fecha de Creacion</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.fechaCreacion}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Fecha de Vencimiento</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.fechaVencimiento}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                </div>
                <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                   &nbsp;
                </div>
                <div className="col-lg-6 col-6 col-md-6 text-center">
                &nbsp;
                </div>
                </div>
                <div className="row" id="CardsContainer">
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Lugar de Creación</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.lugarCreacion}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Fecha de Expiración</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.fechaVencimiento}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                </div>
                <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                   &nbsp;
                </div>
                <div className="col-lg-6 col-6 col-md-6 text-center">
                &nbsp;
                </div>
                </div>
                <div className="row" id="CardsContainer">
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Lugar de Cumplimiento</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.lugarCumplimiento}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                    <div className="col-6 col-md-6">
                     <div className="card-group">
                        <div className="card bg-white" style={{width : "18em"}}>
                        <div className="card-header bg-primary" style={{color:"white"}}><font size="5">Firma</font></div>
                            <div className="card-body">
                                <h5 className="card-title">{this.state.firma}</h5>
                            </div>
                        </div>
                     </div>
                    </div>
                </div>
                <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                   &nbsp;
                </div>
                <div className="col-lg-6 col-6 col-md-6 text-center">
                &nbsp;
                </div>
                </div>
            </div>
          );
    }
}
 
export default PagareDetail;