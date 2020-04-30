const abi = [
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": false,
        "internalType": "string",
        "name": "from",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "to",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "_id",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "firma",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "id_endoso",
        "type": "string"
        }
    ],
    "name": "AcceptEndoso",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": false,
        "internalType": "string",
        "name": "_id",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "deudor_id",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "acreedor_id",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "valor",
        "type": "string"
        }
    ],
    "name": "PagareCreate",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": false,
        "internalType": "string",
        "name": "_id",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
        }
    ],
    "name": "RejectCreate",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
        {
        "indexed": false,
        "internalType": "string",
        "name": "from",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "to",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "_id",
        "type": "string"
        },
        {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
        }
    ],
    "name": "RejectEndoso",
    "type": "event"
    },
    {
    "constant": false,
    "inputs": [
        {
        "internalType": "string",
        "name": "serial",
        "type": "string"
        }
    ],
    "name": "setId",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "constant": true,
    "inputs": [],
    "name": "getId",
    "outputs": [
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "constant": false,
    "inputs": [
        {
        "internalType": "string",
        "name": "_id",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "valor",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "id_deudor",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "id_acreedor",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "info",
        "type": "string"
        }
    ],
    "name": "createPagare",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "constant": false,
    "inputs": [
        {
        "internalType": "string",
        "name": "id_endosante",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "id_endosatario",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "id_pagare",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "fecha",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "firma",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "id_endoso",
        "type": "string"
        }
    ],
    "name": "endosarPagare",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "constant": true,
    "inputs": [
        {
        "internalType": "string",
        "name": "_id",
        "type": "string"
        }
    ],
    "name": "getPagareById",
    "outputs": [
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "bool",
        "name": "",
        "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "constant": true,
    "inputs": [
        {
        "internalType": "string",
        "name": "_id",
        "type": "string"
        }
    ],
    "name": "getEndosoById",
    "outputs": [
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "",
        "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "constant": true,
    "inputs": [
        {
        "internalType": "string",
        "name": "owner",
        "type": "string"
        },
        {
        "internalType": "string",
        "name": "_id",
        "type": "string"
        }
    ],
    "name": "isOwnerOf",
    "outputs": [
        {
        "internalType": "bool",
        "name": "",
        "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "constant": false,
    "inputs": [
        {
        "internalType": "string",
        "name": "_id",
        "type": "string"
        }
    ],
    "name": "marcarPagado",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
    }
]

const address = '0x68a9e87DDccB21B7222051c89B96ad4770eA6644';

export {abi, address};