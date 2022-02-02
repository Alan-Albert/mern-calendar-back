const bcrypt = require('bcryptjs');
const { response } = require('express');
const { validationResult } = require('express-validator');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');

const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let usuario = await Usuario.findOne({ email });

		if (usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'Un usuario ya existe con ese email',
			});
		}

		usuario = new Usuario(req.body);

		//Encriptar contraseña
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		//Generar JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor contacte al administrador',
		});
	}
};

const loginUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let usuario = await Usuario.findOne({ email });

		if (!usuario) {
			return res.status(400).json({
				ok: false,
				msg: 'El usuario no existe con ese email',
			});
		}

		const validPass = bcrypt.compareSync(password, usuario.password);

		if (!validPass) {
			return res.status(400).json({
				ok: false,
				msg: 'Password incorrecto',
			});
		}

		//Generar JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.status(200).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
            token
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Por favor contacte al administrador',
		});
	}
};

const revalidarToken = async(req, res) => {

    const uid = req.uid;
    const name = req.name;

    //Generar JWT
	const token = await generarJWT(uid, name);

	res.json({
		ok: true,
        uid,
        name,
		token
	});
};

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidarToken,
};
