import { Model, Schema, Types, model } from "mongoose";

interface IShippingDetails {
    nombre: String;
    telefono: String;
    ciudad: String;
    direccion: String;
    codigoPostal: String;
}

interface IItem {
    libro: Types.ObjectId;
    cantidad: Number;
}

export interface ICompra {
    fecha: Date;
    usuario: Types.ObjectId;
    // precio: Number;
    envio: Number;
    items: IItem[];
    detallesEnvio: IShippingDetails;
    estatus: String;
};

const CompraSchema = new Schema<ICompra>({
    fecha: {
        type: Date,
        default: Date.now,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    // precio: {
    //     type: Number,
    //     required: true,
    // },
    envio: {
        type: Number,
        required: true,
    },
    detallesEnvio: {
        nombre: {
			type: String,
			required: true,
		},
		telefono: {
			type: String,
			required: true,
		},
		ciudad: {
			type: String,
			required: true,
		},
		direccion: {
			type: String,
			required: true,
		},
		codigoPostal: {
            type: String,
            required: true,
        },
    },
    items: [{
        libro: {
            type: Schema.Types.ObjectId,
            ref: 'Libro',
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
        }
    }],
    estatus: {
        type: String,
        required: true,
    }
});

const Compra: Model<ICompra> = model<ICompra>("Compra", CompraSchema);

export default Compra;