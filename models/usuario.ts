import { Model, Schema, model } from "mongoose";

export interface IUser {
    email: string;
    password: string;
    code?   : string;
    verified: boolean;
};

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, "El correo es obligatorio"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    code: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    }
});

const Usuario: Model<IUser> = model<IUser>("Usuario", UserSchema);

export default Usuario;