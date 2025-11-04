import mongoose from 'mongoose'
import 'dotenv/config'

// url de la base de datos
const MONGODB_URI = process.env.MONGODB_URI

let cached = global._mongoose || { conn: null, promise: null }

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn

    if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
        dbName: 'latesport',
        bufferCommands: false
    })

    cached.conn = await cached.promise
    return cached.conn
}