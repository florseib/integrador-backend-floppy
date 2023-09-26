import { Model, ObjectId, Schema, model } from "mongoose";
import Categoria from "./categoria"

export interface ILibro {
    name: string,
    author: string,
    price: number,
    category: ObjectId,
    picture: string
}

const LibroSchema = new Schema<ILibro>({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true
    },
    picture: {
        type: String,
        required: true,
    },
});

const Libro: Model<ILibro> = model<ILibro>("Libro", LibroSchema);

export default Libro;