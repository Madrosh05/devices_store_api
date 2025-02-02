const Product = require('../models/product.model');

const productController = {
  async create(req, res) {
    try {
      const product = new Product({
        ...req.body,
        createdBy: req.user.uid
      });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const query = {};

      if (category) {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const products = await Product.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const count = await Product.countDocuments(query);

      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getOne(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedBy: req.user.uid },
        { new: true }
      );
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = productController; 