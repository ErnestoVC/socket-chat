const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validator');

const {
    validarCampos,
    validarJWT,
    tieneRole,
    esAdminRole
} = require('../middlewares');

const router = Router();

//Obtener todas la categorias - público
router.get('/', obtenerCategorias);

//Obtener una categoria por id - público
router.get('/:id',[
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], obtenerCategoria);

//Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualiuzar - privado - cualquier persona con token válido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],  actualizarCategoria);

//Borrar una cateogira - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;