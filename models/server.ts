import express, {Express} from "express";
import { conectarDB } from "../database/config";
import carritoRoutes from "../routes/carrito"
import librosRoutes from "../routes/libros"
import authRoutes from "../routes/auth"
import cors from "cors";


export class Server {
    app: Express;

    constructor() {
        this.app = express();
        this.conectarABase();
        this.middlewares();
        this.routes();
    }

    async conectarABase(): Promise<void> {
        await conectarDB();
    }

    middlewares(): void {
        this.app.use(express.json());
        this.app.use(cors())
    }

    routes(): void {
        this.app.use("/libros", librosRoutes);
        this.app.use("/carrito", carritoRoutes);
        this.app.use("/auth", authRoutes);
    }

    listen(): void {
        this.app.listen(process.env.PORT, () => {
            console.log("Corriendo");
        })
    }
}
