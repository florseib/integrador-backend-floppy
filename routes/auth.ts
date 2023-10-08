import { Router } from 'express';
import {Request, Response} from 'express'
import { check } from 'express-validator';
import bcryptjs from 'bcryptjs';
import { existeEmail } from '../helpers/validaciones';
import { recolectarErrores } from '../middlewares/recolectarErrores';
import Usuario, { IUser } from '../models/usuario';
import randomstring from "randomstring";
import { sendEmail } from '../mailer/mailer';
import { generarJWT } from '../helpers/generarJWT';

const router = Router();

router.post(
    "/register",
    [
        check("email", "El email es obligatorio").isEmail(),
        check("password", "La contraseña debe ser de 6 caracteres mínimo").isLength({
            min: 6
        }),
        check("repeatPassword", "Las contraseñas no coinciden").custom(async (confirmPassword, {req}) => {
            const password = req.body.password
            if(password !== confirmPassword){
              throw new Error('Passwords must be same')
            }
          }),
        check("email").custom(existeEmail),
        recolectarErrores
    ],
    async (req: Request, res: Response) => {
        const { email, password }: IUser = req.body

        const usuario = new Usuario({ email, password });

        const salt = bcryptjs.genSaltSync();

        usuario.password = bcryptjs.hashSync(password, salt);

        const newCode = randomstring.generate(6);

        usuario.code = newCode

        await usuario.save();

        await sendEmail(email, newCode);

        res.status(201).json({
            usuario: {
                email: usuario.email,
                verified: false,
                _id: usuario._id,
                __v: usuario.__v
            }
        })
    }
);

router.post(
    "/login",
    [
        check("email", "El mail es obligatorio").not().isEmpty(),
        check("email", "El mail no es válido").isEmail(),
        check("password", "La contraseña debe ser de 6 caracteres mínimo").isLength({
            min: 6
        }),
        recolectarErrores
    ],
    async (req: Request, res: Response): Promise<void> => {
        const {email, password}: IUser = req.body;
        try {
            const usuario = await Usuario.findOne({email});
            if(!usuario) {
                res.status(404).json({
                    msg: "No se encontro un usuario con ese mail"
                });
                return
            }
    
            const validarPassword = bcryptjs.compareSync(password, usuario.password);
    
            if(!validarPassword) {
                res.status(401).json({
                    msg: "La contraseña es incorrecta"
                });
                return;
            };
    
            const token = await generarJWT(usuario.id);
    
            res.status(202).json({
                usuario,
                token
            });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "Error en el servidor"
            })    
        }
    }
);

router.patch(
    "/verify",
    [
        check("email", "El mail es obligatorio").not().isEmpty(),
        check("email", "El mail no es válido").isEmail(),
        check("code").not().isEmpty(),
        recolectarErrores
    ],
    async (req: Request, res: Response) => {

        const {email, code} = req.body;
    
        try {
            const usuario = await Usuario.findOne({email});
    
            if(!usuario) {
                res.status(404).json({
                    msg: "No se encontro un usuario con ese mail"
                });
                return;
            }
    
            if(usuario.verified) {
                res.status(400).json({
                    msg: "El usuario ya esta correctamente verificado"
                });
                return;
            }
    
            if(code !== usuario.code) {
                res.status(401).json({
                    msg: "El código ingresado no es correcto"
                })
                return;
            };
    
            await Usuario.findOneAndUpdate(
                {email},
                {verified: true}
            );
    
            res.status(200).json({
                msg: "Usuario verificado con éxito"
            })
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "Error en el servidor"
            })   
        }
    }
)

export default router;