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
];

const abi2 = [{"inputs":[{"internalType":"contract ENS","name":"ensAddr","type":"address"},{"internalType":"contract Resolver","name":"resolverAddr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"ADDR_REVERSE_NODE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"claim","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"}],"name":"claimWithResolver","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"defaultResolver","outputs":[{"internalType":"contract Resolver","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"node","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"setName","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const address2 = '0x6F628b68b30Dc3c17f345c9dbBb1E483c2b7aE5c';

const address = '0x68a9e87DDccB21B7222051c89B96ad4770eA6644';

export {abi, abi2, address, address2};