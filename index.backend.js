import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import usuariosRouter from './Routes/usuarios.routes.js';
import productosRouter from './Routes/productos.routes.js';
import ventasRouter from './Routes/ventas.routes.js';
import categoriasRouter from './Routes/categorias.routes.js';
import { connectToDatabase } from './db/connection.db.js'; //nuevo
import 'dotenv/config';

const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Rutas API (van primero para que las peticiones a /usuarios/nuevo no fallen)
app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);
app.use('/categorias', categoriasRouter);

// Da acceso a carpetas como /JS, /CSS, /Assets, /Utils, etc., usando rutas relativas.
app.use(express.static(__dirname));

// Permite acceder a mis páginas como: http://localhost:3001/registro.html
app.use(express.static(path.join(__dirname, 'HTML')));

connectToDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log('✅ Conexión a MongoDB exitosa.');
            console.log(`🚀 Servidor levantado en http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('❌ Error al conectar a la base de datos y/o iniciar el servidor:', error);
        process.exit(1); // Detener la aplicación si la DB falla
    });


