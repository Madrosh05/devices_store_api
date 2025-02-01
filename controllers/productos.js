import productosModel from '../models/productos.js';


class productosController {
    constructor() {

    }

    async create(req, res) {
        try {
            const data = await productosModel.create(req.body);
            res.status(201).json(data);
        } catch (e) {
            console.error(e);
            res.status(500).send(e);
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = await productosModel.update(id,req.body);
            res.status(200).json(data);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const data = await productosModel.delete(id);
            res.status(206).json(data);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getAll(req, res) {
        try {
            const data = await productosModel.getAll();
            res.status(201).json(data);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const data = await productosModel.getOne(id);
            res.status(201).json(data);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    }    

    export default new productosController();



