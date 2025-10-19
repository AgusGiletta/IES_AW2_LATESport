import express from 'express';
import usuariosRouter from './Routes/usuarios.routes.js';
import productosRouter from './Routes/productos.routes.js';
import ventasRouter from './Routes/ventas.routes.js';

const app = express()
const port = 3001

app.use (express.json()); //uso de express.json()

app.listen(port, () => {
    console.log(`Servidor levantado en el puerto:${port}`)
})

// rutas API
app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);

// servir archivos estáticos
app.use(express.static('HTML'));
app.use('/JS', express.static('JS'));
app.use('/CSS', express.static('CSS'));
app.use('/Assets', express.static('Assets'));
