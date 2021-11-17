const { response } = require('express');
//const { isValidObjectId } = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Producto, Categoria } = require('../models');


const coleccionesAllow = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuario = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // true

    if (esMongoID) {

        const usuario = await Usuario.findById(termino);
        res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino)
                            .populate('categoria','nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ nombre: regex, estado: true })
                            .populate('categoria','nombre')

    res.json({
        results: productos
    });

}

const buscar = ( req , res = response) => {

    const {coleccion, termino} = req.params;

    if (!coleccionesAllow.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${ coleccionesAllow }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino, res);
            break;

        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsqueda'
            });
    }
}

module.exports = {
    buscar
}