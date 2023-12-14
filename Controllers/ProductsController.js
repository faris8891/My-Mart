const productsModel = require("../Models/products");
const categoryModel = require("../Models/category");

const productController = {
  addProducts: async (req, res) => {
    const dealerId = req.body?.id;
    const {
      name,
      price,
      brand,
      category,
      stock,
      defaultImage,
      productImages,
      description,
      tag,
    } = req.body;

    const newProduct = await productsModel.create({
      dealer: dealerId,
      name: name,
      price: price,
      brand: brand,
      category: category,
      stock: stock,
      defaultImage: defaultImage,
      productImages: productImages,
      description: description,
      // tag: tag,
    });

    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      data: {
        addedProduct: newProduct,
      },
    });
  },

  getProducts: async (req, res) => {
    const filter = { isDeleted: false };
    const products = await productsModel.find(filter);
    res.status(200).json({
      status: "success",
      message: "Successfully fetched categories",
      data: {
        products: products,
      },
    });
  },

  getProduct: async (req, res) => {
    const { id } = req.params;
    const filter = { _id: id, isDeleted: false };

    const product = await productsModel.findOne(filter);

    res.status(200).json({
      status: " success",
      message: "Successfully fetched product",
      data: {
        product: product,
      },
    });
  },

  deleteProduct: async (req, res) => {
    const dealerId = req.body.id;
    const { productId } = req.params;

    const filter = {
      _id: productId,
      isDeleted: false,
      dealer: dealerId,
    };
    const update = {
      isDeleted: true,
    };

    const deletedProduct = await productsModel.findOneAndUpdate(filter, update);

    res.status(200).json({
      status: " success",
      message: "Successfully deleted product",
    });
  },

  activateProduct: async (req, res) => {
    const { id } = req.params;
    const { status } = req.query;

    const filter = { _id: id, isDeleted: false };
    const update = { isActive: status };

    const activatedProduct = await productsModel.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Successfully changed product status",
      data: {
        product: activatedProduct,
      },
    });
  },

  createCategory: async (req, res) => {
    //TODO Add created by and updated by

    const { id, name, color } = req.body;
    const newCategory = await categoryModel.create({
      name: name,
      color: color,
    });
    res.status(201).json({
      status: "success",
      message: "New category successfully",
      data: {
        addedCategory: newCategory,
      },
    });
  },

  getCategories: async (req, res) => {
    const categories = await categoryModel.find({ isDeleted: false });
    res.status(200).json({
      status: "success",
      message: "Successfully fetched categories",
      data: {
        categories: categories,
      },
    });
  },
};

module.exports = productController;
