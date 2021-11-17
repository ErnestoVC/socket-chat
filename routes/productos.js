const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto, 
        borrarProducto } = require('../controllers/productos.controller');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validator');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerProductos );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId().custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId().custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId().custom( existeProductoPorId ),
    check('categoria','No es un id de Mongo').isMongoId().custom( existeCategoriaPorId ),
    validarCampos
], actualizarProducto );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);


module.exports = router;