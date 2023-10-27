import { Router } from 'express';
import validarJWT from '../middlewares/validarJWT';
import { isVerified } from '../middlewares/validarVerificado';
import { check } from 'express-validator';
import { recolectarErrores } from '../middlewares/recolectarErrores';
import { Request, Response } from 'express'
import { ObjectId } from 'mongoose';
import Compra, { ICompra } from '../models/compra';

const router = Router();

router.get("/",
    [
        validarJWT,
        recolectarErrores
    ],
    async (req: Request, res: Response) => {
        const orders = await Compra.find({ usuario: req.body.usuarioConfirmado._id }).populate(["detallesEnvio", { path: 'items', populate: { path: 'libro' } }])

        res.status(201).json({
            orders
        })
    })

router.post("/",
    [
        validarJWT,
        isVerified,
        check("detallesEnvio.nombre", "El nombre es obligatorio").not().isEmpty(),
        check("detallesEnvio.telefono", "El telefono es obligatorio").not().isEmpty(),
        check("detallesEnvio.ciudad", "La ciudad es obligatoria").not().isEmpty(),
        check("detallesEnvio.direccion", "La direccion es obligatoria").not().isEmpty(),
        check("detallesEnvio.codigoPostal", "El codigo postal es obligatorio").not().isEmpty(),
        recolectarErrores
    ],
    async (req: Request, res: Response) => {
        // const {nombre, telefono, ciudad, direccion, codigoPostal} = req.body;
        const usuarioId: ObjectId = req.body.usuarioConfirmado._id;
        const orderData: ICompra = req.body

        const data = {
            ...orderData,
            fecha: new Date(),
            usuario: usuarioId,
            //El envío es genérico porque no tengo de dónde sacarlo
            envio: 500,
            // items: {},
            // detallesEnvio: {
            //     nombre: "",
            //     telefono: "",
            //     ciudad: "",
            //     direccion: "",
            //     codigoPostal: "",
            // },
            estatus: "pending",
        }

        const order = new Compra(data);

        await order.save();

        res.status(201).json({
            order
        })
    })

export default router;