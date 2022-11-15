const mongoose = require('mongoose');

const conexion = async() =>{

    try{

        await mongoose.connect("mongodb://localhost:27017/mi_blog");
        //parametros a pasar si da error {}
        // useNewUrlParser: true useUnifiedTopology: true useCreateIndex: true 

        console.log('ya estamos conectados');

    } catch(error){
        console.log(error);
        throw new Error('No se ha podido conectar a la base de datos');
    }

}


module.exports = {
    conexion
}