const productsModel = require("../Models/products");
const categoryModel = require("../Models/category");

const productController = {
  addProducts: async (req, res) => {
    console.log(dealerId, "add products");
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
      tag: tag,
    });

    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      data: {
        addedProduct: newProduct,
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
      message: "Product added successfully",
      data: {
        addedCategory: newCategory,
      },
    });
  },
};

module.exports = productController;
