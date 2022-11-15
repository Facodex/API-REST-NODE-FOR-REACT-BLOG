const express = require('express');
const { now } = require('mongoose');
const multer = require('multer');
// en esta constante traigo todos los metodos para manejar articulos 
const ArticuloControlador = require('../controladores/articulo');

const router = express.Router();

// creando nuestro metodo para subir imgs
const almacenamiento = multer.diskStorage({
    destination: function( req, file, cb ){ 
        cb( null, './imagenes/articulos' );
    },
    filename: function( req, file, cb ){ 
        cb( null, 'articulo' + Date.now() + file.originalname );
    }
});
const subidas = multer( {storage: almacenamiento } );


// definimos ruta 
// el segundo metodo es el controlador(la funcion que va a ejecutar)

router.get('/ruta-de-prueba', ArticuloControlador.prueba);

// ruta util 

router.post('/crear', ArticuloControlador.crear);
router.get('/articulos/:ultimos?', ArticuloControlador.listar);
router.get('/articulo/:id', ArticuloControlador.uno);
router.delete('/articulo/:id', ArticuloControlador.borrar);
router.put('/articulo/:id', ArticuloControlador.editar);
router.post('/subir-imagen/:id', [subidas.single('file0')], ArticuloControlador.subir);
router.get('/imagen/:fichero', ArticuloControlador.imagen);
router.get('/buscar/:busqueda', ArticuloControlador.buscador);


// exportar mi router 
module.exports = router;



