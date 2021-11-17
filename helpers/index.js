const dbValidator = require('./db-validator')
const generarJWT = require('./generar-jwt')
const googleVerify = require('./google-verify')
const subirArchivo = require('./subir-archivo')
// const dbValidator = require('')
// const dbValidator = require('')
// const dbValidator = require('')

module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}