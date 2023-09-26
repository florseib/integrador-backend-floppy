import { Router } from 'express';
import validarJWT from '../middlewares/validarJWT';
import { isVerified } from '../middlewares/validarVerificado';
import { check } from 'express-validator';
import { recolectarErrores } from '../middlewares/recolectarErrores';
import { Request, Response } from 'express'
import { ObjectId } from 'mongoose';
import Compra, { ICompra } from '../models/compra';

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const orders = await Compra.find({usuario: req.body.usuarioConfirmado._id}).populate("detallesEnvio", "items")

    res.status(201).json({
        orders
    })
})

router.post("/",
    [
        validarJWT,
        isVerified,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("telefono", "El telefono es obligatorio").not().isEmpty(),
        check("ciudad", "La ciudad es obligatorio").not().isEmpty(),
        check("direccion", "La direccion es obligatoria").not().isEmpty(),
        check("codigoPostal", "El codigo postal es obligatorio").not().isEmpty(),
        recolectarErrores
    ],
    async (req: Request, res: Response) => {
        const usuarioId: ObjectId = req.body.usuarioConfirmado._id;
        const orderData: ICompra = req.body

        const data = {
            ...orderData,
            usuario: usuarioId,
            fecha: new Date(),
            estatus: "pending"
        }

        const order = new Compra(data);

        await order.save();

        res.status(201).json({
            order
        })
    })

export default router;