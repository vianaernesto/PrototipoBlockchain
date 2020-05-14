import React from "react";
export const escenarios = {
    simple: 'Simple',
    conENS: 'Ens',
    conEther: 'Ether',
};

export const EscenarioContext = React.createContext({
    escenario: escenarios.simple,
    toggleSimple: () =>{},
    toggleENS: () =>{},
    toggleEther: () =>{},
});