import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import usuariosRouter from './Routes/usuarios.routes.js';
import productosRouter from './Routes/productos.routes.js';
import ventasRouter from './Routes/ventas.routes.js';

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Rutas API (van primero para que las peticiones a /usuarios/nuevo no fallen)
app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);

// Esto da acceso a carpetas como /JS, /CSS, /Assets, /Utils, etc., usando rutas relativas.
app.use(express.static(__dirname));

// Esto permite acceder a mis páginas como: http://localhost:3001/registro.html
app.use(express.static(path.join(__dirname, 'HTML')));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor levantado en http://localhost:${port}`);
});
