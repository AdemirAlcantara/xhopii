import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class Database {

    static async connect() {
        try{
            const uri = process.env.MONGODB_URI;
            if (!uri) {
                throw new Error("A variável MONGODB_URI não foi definida.");
            }

            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log("Conexão com o MongoDB estabelecida com sucesso!");
        }catch(error){
            console.error("Erro ao conectar ao MongoDB:", error);
            process.exit(1);
        }
    }
    
    static async disconnect() {

        try{
            await mongoose.disconnect();
            console.log("MongoDB desconectado com sucesso!");
        }catch (error){
            console.error("Erro ao desconectar do MongoDB:", error);
        }
    }
}

export default Database;