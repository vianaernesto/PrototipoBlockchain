import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {EscenarioContext} from '../Context/context';

import contract from '../../assets/contract.png';


class Home extends Component {
    
    revisarUsuario(){
        let direccion = this.props.getUsuario() ? '/balance' : '/login';

        return (
            <Link to={direccion}>
                <button className="but-outline">Iniciar Ahora</button>
            </Link>
        );
    }
    
    
    render() { 
        return ( 
            <div className="container host d-flex align-items-center">
                <div className="row align-items-center justify-content-center">
                    <div className="col-12 col-md-6 text-left my-5 my-md-0">
                        <h1 className="font-weight-bold display-4">Desmaterializa tu pagaré</h1>
                        <p className="py-4 text-muted">
                        Página para desmaterializar, endosar y pagar tus pagarés de manera segura.
                        </p>
                        <div className="d-flex justify-content-end">
                            {this.revisarUsuario()}
                        </div>                        
                    </div>
                    <div className="col-12 col-md-6 d-flex justify-content-center">
                        <img className="banner my-5 my-md-0" src={contract} alt="Imagen contrato" />
                    </div>
                </div>
            </div>
         );
    }
}

Home.contextType = EscenarioContext;
 
export default Home;
