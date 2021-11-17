const { response } = require('express');
const bcryptjs = require('bcryptjs');
const generator = require('generate-password');
const Usuario = require('../models/usuario.models');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {

    //Verificar sí el email existe
    const usuario = await Usuario.findOne({ correo })
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correcto - correo'
      });
    }

    //Si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado:false'
      })
    }

    //Verificar la contraseña
    const validPass = bcryptjs.compareSync(password, usuario.password);
    if (!validPass) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      })
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

const googleSingIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: generator.generate({
          length: 12,
          numbers: true,
          symbols: true,
          strict: true
        }),
        img,
        google: true
      };

      usuario = new Usuario(data);

      await usuario.save();
    }

    //Sí el usuario en DB es falso
    if (!usuario.estado) {
      return res.status(401).json({

        msg: 'Hable con el administrado, usuario bloqueado'

      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar'
    })
  }

}

const renovarToken = async( req, res = response ) =>{

  const { usuario } = req;

  // Generar el JWT
  const token = await generarJWT( usuario.id );

  res.json({
      usuario,
      token
  })
}

module.exports = {
  login,
  googleSingIn,
  renovarToken
};
