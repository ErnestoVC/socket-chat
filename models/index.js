const Categoria = require('./categoria.models');
const Producto = require('./producto.models');
const ChatMensajes = require('./chat-mensajes');
const Role = require('./roles.models');
const Server = require('./server');
const Usuario = require('./usuario.models');



module.exports = {
    Categoria,
    Producto,
    Role,
    Server,
    Usuario,
    ChatMensajes
}