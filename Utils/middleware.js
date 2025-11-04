import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; 

if (!JWT_SECRET) {
    console.error("ERROR: La variable de entorno JWT_SECRET no está definida.");
}

export const verifyToken = async(token) => {
    console.log("Token recibido para verificación:", token)

    if(!token) {
        return false
    }
    try {
        const decoded = await jwt.verify(token, JWT_SECRET); 
        console.log("Token decodificado (payload):", decoded)
        return true;

    } catch (error) {
        console.log("Error de verificación del token:", error.message)
        return false
    }
};

export const decodeToken = async(token) => {
    if (!(await verifyToken(token))) {
         return false;
     }

    const decoded = jwt.decode(token);
    return decoded
};
