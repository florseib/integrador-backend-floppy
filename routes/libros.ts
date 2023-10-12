import { Request, Response, Router } from "express";
import Libro from '../models/libro';
import Categoria from "../models/categoria";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    // const libros = await Libro.find().populate("category", "descripcion");
    const libros = await Libro.find();

    res.json({
        libros
    })
})

router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const mongoose = require('mongoose');

    if (mongoose.Types.ObjectId.isValid(id)) {
        // const libro = await Libro.findById(id).populate("category", "descripcion");
        const libro = await Libro.findById(id);

        if (libro)
            res.json({
                libro: libro
            })
        else
            res.json({
                msg: "Libro no encontrado"
            })
    }
    else {
        res.json({
            msg: "ID inválido"
        })
    }
})

router.get('/categoria/:category', async (req: Request, res: Response) => {
    const { category } = req.params;

    // const libro = await Libro.findById(id).populate("category", "descripcion");
    const libros = await Libro.find({ category: category.toUpperCase() });

    res.json({
        libros: libros
    })
})

router.get('/categorias', async (req: Request, res: Response) => {
    const categorias = await Categoria.find();

    res.json({
        categorias: categorias
    })
})

router.post("/", async (req: Request, res: Response) => {
    const { name, author, price, category, picture } = req.body;

    if(!(name && author && price && category && picture))
    res.json({
        msg: "Error cargando libro"
    })

    let categoria = await Categoria.findOne({descripcion: category.toUpperCase()})

    if (!categoria) {
        categoria = new Categoria({
            descripcion: category.toUpperCase()
        })

        await categoria.save();
    }

    const libro = new Libro({
        name: name,
        author: author,
        price: price,
        category: category.toUpperCase(),
        picture: picture
    })

    await libro.save();

    res.json({
        msg: "Libro cargado correctamente",
        libro: {
            _id: libro._id,
            author: libro.author,
            price: libro.price,
            categoryId: categoria?._id,
            category: categoria.descripcion,
            picture: libro.picture
        }
    })
})

export default router;