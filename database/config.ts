import mongoose from "mongoose";

export const conectarDB = async (): Promise<void> => {
    try {
        const connectionString = process.env.CONNECTIONSTRING;
        if (!connectionString) {
            throw new Error('Connection string no definida')
        }
        await mongoose.connect(connectionString);
    }
    catch (error) {
        console.log(error);
    }
}