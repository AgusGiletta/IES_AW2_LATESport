import { API } from '../../auth/api.js'; 

// Obtengo todos los productos activos desde el Back y llamo a la ruta GET /productos de mi Express.js
export const getProductos = async () => {
    try {
        const response = await fetch(`${API}/productos/`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.status}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error al intentar obtener los productos:', error);
        throw error;
    }
};

// Obtengo un producto por su ID y llamo ala ruta GET /productos/byId/:id
export const getProductoById = async (id) => {
    try {
        const response = await fetch(`${API}/productos/byId/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Producto con ID ${id} no encontrado.`);
        }

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Error al obtener producto por ID ${id}:`, error);
        throw error;
    }
};

// Obtengo todos los productos activos de una categoría específica y llamo a la ruta GET /productos/byCategoria/:categoria
export const getProductosByCategoria = async (categoria) => {
    try {
        const response = await fetch(`${API}/productos/byCategoria/${categoria}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 404) {
             return [];
        }
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Error al obtener productos por categoría ${categoria}:`, error);
        throw error;
    }
};

// Creo un nuevo producto en el Back y llamo a la ruta POST /productos/nuevo
export const crearNuevoProducto = async (productoData) => {
    try {
        const response = await fetch(`${API}/productos/nuevo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Fallo al crear producto (Status: ${response.status})`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al crear nuevo producto:', error);
        throw error;
    }
};