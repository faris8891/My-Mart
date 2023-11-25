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
    const products = await productsModel.find({ isDeleted: false });
    res.status(200).json({
      status: "success",
      message: "Successfully fetched categories",
      data: {
        products: products,
      },
    });
  },

  activateProducts: async (req, res) => {
    console.log(req, res);
    const { productId, status } = req.params;
    const activatedProduct = await productsModel.findByIdAndUpdate(productId, {
      isActive: status,
    });
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

  getCategory: async (req, res) => {
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
