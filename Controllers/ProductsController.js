const productsModal = require("../Models/products");

const productController = {
  addProducts: async (req, res) => {
    const dealerId = req.body?.id;
    const {
      productName,
      price,
      brand,
      category,
      stock,
      defaultImage,
      productImages,
      description,
      tag,
    } = req.body;
    const newProduct = await productsModal.create({
      dealer:dealerId,
      productName: productName,
      price: price,
      brand: brand,
      // category: category,
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
};


module.exports=productController