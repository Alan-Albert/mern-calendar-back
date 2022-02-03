const { response } = require("express");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");


const validarJWT = ( req, resp = response, next ) => {
  const token = req.header('x-token');

  if ( !token ) {
      return res.status(401).json({
          ok: false,
          msg: 'No hay token en la petición'
      });
  }

  try {
      const payload = jwt.verify(
          token,
          process.env.SECRET_JWT_SEED
      );

      req.uid = payload.uid;
      req.name = payload.name;

    //   console.log(payload);
  } catch (error) {
    return res.status(401).json({
        ok: false,
        msg: 'Token no válido'
    });
  }

  next();
};

module.exports = {
    validarJWT
}