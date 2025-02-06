const Product = require('../models/product.model');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

const productController = {
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
        currentPage: parseInt(page),
        totalProducts: count
      });
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: error.message 
      });
    }
  },

  async create(req, res) {
    try {
      const product = new Product({
        ...req.body,
        createdBy: req.user.uid
      });
      await product.save();
      res.status(HTTP_STATUS.CREATED).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: error.message 
      });
    }
  },

  async getOne(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ 
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND 
        });
      }
      res.json(product);
    } catch (error) {
      console.error('Error getting product:', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: error.message 
      });
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
        return res.status(HTTP_STATUS.NOT_FOUND).json({ 
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND 
        });
      }
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: error.message 
      });
    }
  },

  async delete(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ 
          message: ERROR_MESSAGES.PRODUCT_NOT_FOUND 
        });
      }
      res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        message: error.message 
      });
    }
  }
};

module.exports = productController;