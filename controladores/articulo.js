const validator = require('validator');
const fs = require('fs');
const path = require('path');
const Articulo = require('../modelos/Articulo');
const {validarArticulo} = require('../helpers/validar')

//cada una de estas acciones sera una pagina o una ruta de nuestro proyecto

const prueba = (req, res) =>{

    return res.status(200).json({
        mensaje: 'Soy una accion de prueba en mi controlador de articulo'
    })
}


// metodo crear nuevo articulo
const crear = (req, res) =>{

    // recoger parametros por post a guardar 
    let parametros = req.body;

    // validar datos 

    try {

        validarArticulo(parametros);

    } catch (error) {

        return res.status(400).json({
            status: 'error',
            mensaje: 'faltan datos a enviar'
        });

    }

    //crear el objeto a guardar 

    const articulo = new Articulo(parametros);

    // asignar valores a objeto basado en el modelo (manual o automatico)
    // articulo.titulo = parametros.titulo; asi seria manueal pero asi no lo vamos a hacer

    
    // guardar el articulo en la base de datos
    articulo.save((error, ArticuloGuardado) =>{

        if(error || !ArticuloGuardado){
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado el nuevo articulo"
            });
        }


        // devolvemos resultado 

        return res.status(200).json({
            status: "succes",
            articulo: ArticuloGuardado,
            mensaje: "nuevo articulo guardado correctamente"
        });
    });

}

// metodo para conseguir articulos de la api 
const listar = (req, res) => {

    let consulta = Articulo.find({});
        
       if(req.params.ultimos){  //aqui compruebo si llego el parametro
         consulta.limit(2);         //aqui limito el maximo de articulos que quiero traer
       }

        consulta.sort({fecha: -1})  //aqui empiezo a encadenar filtros de consulta(por ejemplo este es para revertir el orden);
                      .exec((error, articulos) =>{
        if(error || !articulos){
            return res.status(404).json({
                status: "error",
                mensaje: 'No se han encontrado articulos'
            });
        }
        
        return res.status(200).send({
            status: "succes",
            articulos
        });
    });
}


// metodo listar un articulo
const uno = (req, res) => {

    // recogemos el id que llega por url 
    let id = req.params.id;

    // buscamos el articulo con ayuda del modelo Articulo 
    Articulo.findById(id, (error, articulo) =>{

        // devolvemos el error si lo hay 
        if(error || !articulo){
            return res.status(404).json({
                status: "error",
                mensaje: 'No se han encontrado el articulo'
            });
        }


        // devolvemos el articulo si esta todo bien 
        return res.status(200).send({
            status: "succes",
            articulo
        });
    });
}


// metodo borrar
const borrar = (req, res) => {

    // guardamos el id que nos llega
    let articuloId = req.params.id;

    // Buscamos el articulo que le corresponde el id con ayuda de nuestro modelo
    Articulo.findOneAndDelete({_id: articuloId}, (error, articuloBorrado) =>{

        if(error || !articuloBorrado){
            return res.status(500).json({
                status: "error",
                mensaje: 'No se ha borrado el articulo'
            });
        }


        return res.status(200).send({
            status: "succes",
            articulo: articuloBorrado,
            mensaje: "Se ha borrado exitosamente"
        });
    });

} 


// metodo editar
const editar = (req, res) => {

    // guardamos el id que nos llega
    let articuloId = req.params.id;

    // guardamos los nuevos datos del body 
    let parametros = req.body;

    // validamos que sean correctos 
    try {

        validarArticulo(parametros);

    } catch (error) {

        return res.status(400).json({
            status: 'error',
            mensaje: 'faltan datos a enviar'
        });

    }

    // buscamos y actualizamos el articulo 
    Articulo.findOneAndUpdate({_id: articuloId}, req.body, {new: true}, (error, articuloActualizado ) => {

        // comprobamos si hay error y devolvemos 
        if(error || !articuloActualizado){

            return res.status(500).json({
                status: "error",
                mensaje: 'No se ha actualizado el articulo'
            });

        }

        // devolvemos con exito la actualizacion 
        return res.status(200).send({
            status: "succes",
            articulo: articuloActualizado,
        });

    });
} 

// metodo para subir img
const subir = ( req, res ) => {

    //configurar multer

    //recoger el fichero de la img subida
    if( !req.file && !req.files){
        return res.status(404).json({
            status: 'error',
            mensaje: "peticion invalida"
        });
    }

    //nombre del archivo
    let archivo = req.file.originalname;

    //extension del archivo
    let archivo_split = archivo.split('\.');
    let extension = archivo_split[1];

    //comprobar si la extension es correcta
    if(extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif'){
        //borrar archivo y dar rta
        fs.unlink(req.file.path, ( error ) => {
            return res.status(400).json({
                status: 'error',
                mensaje: "Archivo invalido"
            });
        });
    }else{
        //si todo va bien actualizar el articulo 

        // guardamos el id que nos llega
        let articuloId = req.params.id;

        // buscamos y actualizamos el articulo 
        Articulo.findOneAndUpdate({_id: articuloId}, {imagen: req.file.filename}, {new: true}, (error, articuloActualizado ) => {

            // comprobamos si hay error y devolvemos 
            if(error || !articuloActualizado){

                return res.status(500).json({
                    status: "error",
                    mensaje: 'No se ha actualizado el articulo'
                });

            }

            // devolvemos con exito la actualizacion 
            return res.status(200).send({
                status: "succes",
                articulo: articuloActualizado,
                fichero: req.file
            });

        });
    }

}

// metodo para traer una imagen unica 
const imagen = ( req, res ) =>{

    let fichero = req.params.fichero;
    let ruta_fisica = './imagenes/articulos/' + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if( existe ){
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: 'No se ha encontrado la imagen',
                existe,
                fichero,
                ruta_fisica
            });
        }
    });
}

// metodo buscador 
const buscador = ( req, res ) => {

    // sacamos el string 
    let busqueda= req.params.busqueda;

    // buscamos con OR AND etc 
    Articulo.find({ "$or":[
        {'titulo': { '$regex': busqueda, '$options': 'i'}},
        {'contenido': { '$regex': busqueda, '$options': 'i'}}
    ]})
    .sort( {fecha: -1} ) //ejecuto consulta
    .exec( (error, articulosEncontrados) =>{ //devuelvo resultado 

        if(error || !articulosEncontrados || articulosEncontrados.length <= 0){
            return res.status(404).json({
                status: "error",
                mensaje: 'No se han encontrado articulos'
            });
        }

        return res.status(200).json({
            status: 'succes',
            articulos: articulosEncontrados
        })

    });
}

module.exports = {
    prueba,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}