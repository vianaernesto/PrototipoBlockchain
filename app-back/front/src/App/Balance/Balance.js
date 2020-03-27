import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Balance.css"

class Balance extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            pagaresAfavor: [
                {
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
                }
            ],
            debe: [

                {
                    id: "002",
                    valor: 500000,
                    nombreDeudor: "Juan Perez",
                    cedulaDeudor: "1020384728",
                    fechaCreacion: "10-05-2020",
                    lugarCreacion: "Ibagué",
                    fechaVencimiento: "10-05-2021",
                    fechaExpiracion: "10-05-2021",
                    lugarCumplimiento: "Bogotá D.C.",
                    nombreAcreedor: "Camilo Diaz",
                    cedulaAcreedor: "1020384722",
                    firma: "f0f0cd0de23d2deefce212"
                }

            ]
         }
    }
    render() { 
        return (
        <div className="host">
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                    <h1 className="display-4 text-center font-weight-bold">
                    A Su Favor
                    </h1>
                </div>
                <div className="col-lg-6 col-6 col-md-6 text-center">
                    <h1 className="display-4 text-center font-weight-bold">
                    Usted Debe
                    </h1>
                </div>
            </div>
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                 <div className="row" id="CardsContainer">
                     {this.state.pagaresAfavor.length > 0 ? (
                         <React.Fragment>
                             {this.state.pagaresAfavor.map((x,i) =>{
                                 return(
                                     <div key={i}
                                        className="col-lg-4 col-md-8 col-sd-12"
                                        style={{ marginTop: "2em" }}>
                                        <div class="card" style={{width: "18em"}}>
                                            <div className="card-body">
                                                <p className="card-text text-left">Pagaré #{x.id}</p>
                                                <h2 className="card-title">${x.valor}</h2>
                                            </div>
                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Deudor: </span><span className="text-right">{x.nombreDeudor}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Cédula: </span><span className="text-right">{x.cedulaDeudor}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Creado el: </span><span className="text-right">{x.fechaCreacion}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Fecha de Expiración: </span><span className="text-right">{x.fechaExpiracion}</span></li>
                                                </ul>
                                                <div className="card-body">
                                                <Link to = "/pagareDetail"><button className="but-solid">Detalle</button></Link>
                                                </div>
                                        </div>
                                    </div>
                                 );
                             })}
                         </React.Fragment>
                     ): (
                         <div className="col-md-12"
                         style={{marginTop: "2em", width: "100%" }}>
                             <div className="card" style={{textAlign: "center" }}>
                                <div className="card-body">
                                    <p className="card-text">
                                    No tiene pagarés a su favor en este momento
                                    </p>
                                </div>
                             </div>
                         </div>
                     )}
                 </div>
                </div>
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                 <div className="row" id="CardsContainer">
                     {this.state.debe.length > 0 ? (
                         <React.Fragment>
                             {this.state.debe.map((x,i) =>{
                                 return(
                                     <div key={i}
                                        className="col-lg-4 col-md-8 col-sd-12"
                                        style={{ marginTop: "2em" }}>
                                        <div class="card" style={{width: "18em"}}>
                                            <div className="card-body">
                                                <p className="card-text text-left">Pagaré #{x.id}</p>
                                                <h2 className="card-title">${x.valor}</h2>
                                            </div>
                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Acreedor: </span><span className="text-right">{x.nombreAcreedor}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Cédula del Acreedor: </span><span className="text-right">{x.cedulaAcreedor}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Creado el: </span><span className="text-right">{x.fechaCreacion}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Fecha de Expiración: </span><span className="text-right">{x.fechaExpiracion}</span></li>
                                                </ul>
                                                <div className="card-body">
                                                <Link to = "/pagareDetail"><button className="but-solid">Detalle</button></Link>
                                                </div>
                                        </div>
                                    </div>
                                 );
                             })}
                         </React.Fragment>
                     ): (
                         <div className="col-md-12"
                         style={{marginTop: "2em", width: "100%" }}>
                             <div className="card" style={{textAlign: "center" }}>
                                <div className="card-body">
                                    <p className="card-text">
                                    No tiene deudas en forma de pagaré en este momento.
                                    </p>
                                </div>
                             </div>
                         </div>
                     )}
                 </div>
                </div>
            </div>
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6">
                <div className="col-lg-6 col-6 col-md-6">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item active" aria-current="page"><h5>Total a Favor:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $8,000,000</h5></li>
                        </ol>
                    </nav>
                </div>
                </div>
                <div className="col-lg-6 col-6 col-md-6">
                <div className="col-lg-6 col-6 col-md-6">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item active" aria-current="page"><h5>Total a Favor:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $8,000,000</h5></li>
                        </ol>
                    </nav>
                </div>
                 </div>
            </div>
        </div>);
    }
}
 
export default Balance;