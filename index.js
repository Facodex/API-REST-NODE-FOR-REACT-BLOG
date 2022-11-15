const { conexion } = require('./basedatos/conexion');
const express = require('express');
const cors = require('cors');

// Iniciar App 
console.log('App de node iniciada');

//Conectar a la base de datos 
conexion();

//Crear servidor Node
const app = express();
const puerto = 3900;

//Configurar cors

app.use(cors());

// Convertir body a objeto js 
app.use(express.json()); //esto es para recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})); //recibo datos por form-urlencoded


// Crear rutas 
const rutas_articulo = require('./rutas/articulo');
// cargo las rutas 
app.use('/api', rutas_articulo);



// rutas de prueba hardcodeadas
app.get('/probando', (req, res) =>{
    console.log('Se ha ejecutado el endpoint probando');
    return res.status(200).json([
        {
            name: 'Facu',
            url: 'facodex.tech'
        },
        {
            name: 'victor',
            url: 'vicotr.com'
        }
    ]);
});

app.get('/', (req, res) =>{
    console.log('Se ha ejecutado el endpoint probando');
    return res.status(200).send(`
        <h1>INICIO :)</h1>
    `);
});





//Crear Servidor y escuchar peticiones http
app.listen(puerto, () =>{
    console.log('servidor corriendo en el puerto ' + puerto);
});