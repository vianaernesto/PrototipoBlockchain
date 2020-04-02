import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import { Switch} from "react-router-dom";
import { PrivateRoute } from '../Index/SpecialRoutes.js';

import CrearPagare  from '../Transaction/CrearPagare.js';
import "./Balance.css";

const cookies = new Cookies();

class Balance extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            headers: {
                "Content-Type": "application/json",
                "authorization": cookies.get("token")
            },
            pagaresAfavor: [],
            pagaresEnContra : [],
            nombre : `${this.props.getUsuario().nombres} ${this.props.getUsuario().apellidos}`,
            cedulaUsuario : this.props.getUsuario().cedula,
            totalDeuda : 0,
            totalCobro : 0,
            rol : 'acreedor',
         }

         this.getPagares = this.getPagares.bind(this);
    }

    componentDidMount(){
        this.getPagares();
    }

    getPagares(){

        let getPagaresAFavor = axios.get(`pagares/acreedor/${this.state.cedulaUsuario}`,{headers : this.state.headers})

        let getPagaresEnContra = axios.get(`pagares/deudor/${this.state.cedulaUsuario}`,{headers : this.state.headers});
        
        axios.all([getPagaresAFavor,getPagaresEnContra])
            .then(axios.spread((...responses)=>{
                

                let datosAFavor = responses[0].data;
                let datosEnContra = responses[1].data;
                let totalAFavor = 0;
                let totalEnContra = 0;

                datosAFavor.map((x)=>{
                    totalAFavor = x.valor + totalAFavor;
                    return totalAFavor;
                });

                datosEnContra.map((x)=>{
                    totalEnContra = x.valor + totalEnContra;
                    return totalEnContra;
                });

                this.setState({
                    pagaresAfavor: datosAFavor,
                    pagaresEnContra : datosEnContra,
                    totalCobro : totalAFavor,
                    totalDeuda : totalEnContra,
                });
                
            }));
        
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
                <div className="col-lg-2 col-2 col-md-2"></div>
                <div className="col-lg-2 col-2 col-md-2">
                    <Link to={{pathname: '/pagare/crear/', state: {rol: 'acreedor', usuario: {nombre: this.state.nombre, cedula:this.state.cedulaUsuario}}}}  ><button className="but-solid">Crear Pagaré como Acreedor </button></Link>
                </div>
                <div className="col-lg-2 col-2 col-md-2"></div>
                <div className="col-lg-2 col-2 col-md-2"></div>
                <div className="col-lg-2 col-2 col-md-2">
                    <Link to= {{pathname: '/pagare/crear/', state: {rol: 'deudor', usuario: {nombre:this.state.nombre, cedula:this.state.cedulaUsuario}}}}><button className="but-solid">Crear Pagaré como Deudor</button></Link>
                </div>
                <div className="col-lg-2 col-2 col-md-2"></div>
            </div>
            <div className="row align-items-center justify-content-center">
                <div className="col-lg-6 col-6 col-md-6 text-center ">
                 <div className="row" id="CardsContainer">
                     {this.state.pagaresAfavor.length > 0 ? (
                         <React.Fragment>
                             {this.state.pagaresAfavor.map((x,i) =>{
                                 if(x.etapa >4){
                                    return(
                                    <div key={i}>
                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                    <div
                                        className="col-lg-4 col-md-8 col-sd-12"
                                        style={{ marginTop: "2em" }}>
                                        <div className="card" style={{width: "18em"}}>
                                            <div className="card-body">
                                                <p className="card-text text-left">Pagaré #{x._id}</p>
                                                <h2 className="card-title">${x.valor}</h2>
                                            </div>
                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Deudor: </span><span className="text-right">{x.nombreDeudor}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Cédula del Deudor: </span><span className="text-right">{x.idDeudor}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Creado el: </span><span className="text-right">{new Date(x.fechaCreacion).getDate()}/{new Date(x.fechaCreacion).getMonth() + 1}/{new Date(x.fechaCreacion).getFullYear()}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Fecha de Expiración: </span><span className="text-right">{new Date(x.fechaExpiracion).getDate()}/{new Date(x.fechaExpiracion).getMonth() + 1}/{new Date(x.fechaExpiracion).getFullYear()}</span></li>
                                                </ul>
                                                <div className="card-body">
                                                <Link to = "/pagareDetail"><button className="but-solid">Detalle</button></Link>
                                                </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                    </div>
                                     
                                 );
                                 } else{
                                     return(
                                         <div key={i}>Incompleto</div>
                                     );
                                 }
                                 
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
                     {this.state.pagaresEnContra.length > 0 ? (
                         <React.Fragment>
                             {this.state.pagaresEnContra.map((x,i) =>{
                                 if(x.etapa > 4){
                                    return(
                                    <div key={i}>
                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                    <div
                                        className="col-lg-4 col-md-8 col-sd-12"
                                        style={{ marginTop: "2em" }}>
                                        <div className="card" style={{width: "18em"}}>
                                            <div className="card-body">
                                                <p className="card-text text-left">Pagaré #{x._id}</p>
                                                <h2 className="card-title">${x.valor}</h2>
                                            </div>
                                                <ul className="list-group list-group-flush">
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Acreedor: </span><span className="text-right">{x.nombreAcreedor}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Cédula del Acreedor: </span><span className="text-right">{x.idAcreedor}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Creado el: </span><span className="text-right">{new Date(x.fechaCreacion).getDate()}/{new Date(x.fechaCreacion).getMonth() + 1}/{new Date(x.fechaCreacion).getFullYear()}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Creado en: </span><span className="text-right">{x.lugarCreacion}</span></li>
                                                    <li className="list-group-item"><span  className="text-left font-weight-bold">Fecha de Expiración: </span><span className="text-right">{new Date(x.fechaExpiracion).getDate()}/{new Date(x.fechaExpiracion).getMonth() + 1}/{new Date(x.fechaExpiracion).getFullYear()}</span></li>
                                                </ul>
                                                <div className="card-body">
                                                <Link to = "/pagareDetail"><button className="but-solid">Detalle</button></Link>
                                                </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-2 col-sd-12"></div>
                                    </div>
                                     
                                 );
                                 }else{
                                     return(
                                         <div key={i}>
                                             Incompleto
                                         </div>
                                     );
                                 }
                                 
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
            <div className="row">
                &nbsp;
            </div>
            <div className="row align-content-start">
            <div className="col-lg-6 col-6 col-md-6">
                <div className="col-lg-8 col-8 col-md-8">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page"><h5 className="favor">Total a Favor:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${this.state.totalCobro}</h5></li>
                        </ol>
                    </nav>
                </div>
                </div>
                <div className="col-lg-6 col-6 col-md-6">
                <div className="col-lg-8 col-8 col-md-8">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page"><h5 className="contra">Total en Contra:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${this.state.totalDeuda}</h5></li>
                        </ol>
                    </nav>
                </div>
                </div>
            </div>
            <Switch>
                <PrivateRoute exact path="/pagare/crear/:rol" component={ (props) => <CrearPagare {...props} getUsuario={this.getUsuario}  />} getUsuario={this.getUsuario} />
              </Switch>
        </div>);
    }
}
 
export default Balance;