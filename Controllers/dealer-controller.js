const dealers = require("../Models/dealer");
const users = require("../Models/user");
const orders = require("../Models/orders");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_DEALER_KEY;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "MyMartProduct",
  });
  return res;
}
module.exports = {
  dealersRegister: async (req, res) => {
    try {
      console.log(req.body);
      const { fullName, shopName, email, password, phone, location, address } =
        req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newDealer = await dealers.create({
        fullName: fullName,
        shopName: shopName,
        email: email,
        password: hashedPassword,
        phone: phone,
        location: location,
        address: address,
      });
      res.status(201).json({
        status: "success",
        message: "You have registered successfully",
        data: {
          createdDealer: newDealer,
        },
      });
    } catch (error) {
      if (error.keyPattern.email) {
        res.status(400).json({
          status: "Failed",
          message: "Email has already been taken",
        });
      } else if (error.keyPattern.phone) {
        res.status(400).json({
          status: "Failed",
          message: "Mobile number has already been taken",
        });
      } else
        res.status(400).json({
          status: "Failed",
          message: "Something wrong",
        });
    }
  },

  dealersLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const dealer = await dealers.findOne({
        email: email,
        isActive: true,
        isDeleted: false,
      });
      bcrypt.compare(password, dealer.password, function (err, result) {
        if (result === true && email === dealer.email) {
          const dealerToken = jwt.sign({ id: dealer._id }, jwt_key, {
            expiresIn: "1d",
          });
          res.status(200).json({
            status: "success",
            message: "You have logged successfully",
            data: {
              token: dealerToken,
            },
          });
        } else {
          res.status(401).json({
            status: "Failed",
            message: "Invalid email or password",
          });
        }
      });
    } catch (error) {
      res.status(401).json({
        status: "Failed",
        message: "User not found",
      });
    }
  },

  products: {
    // get: async (req, res) => {
    //   try {
    //     const dealerId = req.body.id;
    //     const products = await dealers.find(
    //       { _id: dealerId },
    //       { products: 1, _id: 0 }
    //     );
    //     res.status(200).json(products[0]);
    //   } catch (error) {
    //     res.status(404).send("Not Found");
    //   }
    // },

    post: async (req, res) => {
      try {
        const dealerId = req.body.id;
        const data = req.body;
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        const product = await dealers.updateOne(
          { _id: dealerId },
          {
            $push: {
              products: {
                productName: data.productName,
                price: data.price,
                category: data.category,
                noOfItem: data.noOfItem,
                defaultImage: cldRes.secure_url,
                productImages: data.description,
                description: data.description,
                productActive: data.productActive,
              },
            },
          }
        );
        res.status(200).send("New product added successfully");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },

    // put: async (req, res) => {
    //   try {
    //     const data = req.body;
    //     const dealerId = data.id;
    //     const productId = data.productId;
    //     // const b64 = Buffer.from(req.file.buffer).toString("base64");
    //     // let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    //     // const cldRes = await handleUpload(dataURI);
    //     const { productName, price, category, noOfItem, description } = data;
    //     const product = await dealers.updateOne(
    //       { _id: dealerId, "products._id": productId },
    //       {
    //         $set: {
    //           "products.$.productName": productName,
    //           "products.$.price": price,
    //           "products.$.category": category,
    //           "products.$.noOfItem": noOfItem,
    //           "products.$.description": description,
    //           // "products.$.defaultImage": cldRes.secure_url,
    //         },
    //       }
    //     );
    //     res.status(202).send("Product updated successfully");
    //   } catch (error) {
    //     res.status(400).send("Bad Request");
    //   }
    // },

    // patch: async (req, res) => {
    //   try {
    //     const data = req.body;
    //     const dealerId = req.body.id;
    //     const productId = req.body.productId;
    //     const product = await dealers.updateOne(
    //       {
    //         _id: dealerId,
    //         "products._id": productId,
    //       },
    //       { $set: { "products.$.productActive": data.productStatus } }
    //     );
    //     if (product.acknowledged) {
    //       res.status(202).send("Product updated successfully");
    //     } else {
    //       res.status(400).send("Product update failed");
    //     }
    //   } catch (error) {
    //     res.status(400).send("Product update failed");
    //   }
    // },
    // delete: async (req, res) => {
    //   try {
    //     const data = req.body;
    //     const dealerId = data.id;
    //     const productId = data.productId;
    //     const product = await dealers.updateOne(
    //       { _id: dealerId },
    //       { $pull: { products: { _id: productId } } }
    //     );
    //     if (product.acknowledged == true && product.modifiedCount != 0) {
    //       res.status(202).send("Product successfully removed");
    //     } else {
    //       res.status(400).send("Product remove failed");
    //     }
    //   } catch (error) {
    //     res.status(400).send("Something wrong ");
    //   }
    // },
  },

  //XXX Pending ================================================>>

  profile: {
    get: async (req, res) => {
      try {
        const id = req.body.id;
        const userData = await dealers.findOne(
          { _id: id },
          { products: 0, password: 0, userName: 0, orders: 0 }
        );
        res.status(200).json(userData);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    put: async (req, res) => {
      try {
        id = req.body.id;
        const dealerData = req.body;
        const password = await bcrypt.hash(dealerData.password, saltRounds);
        dealerUpdate = await dealers.updateOne(
          { _id: id },
          {
            fullName: dealerData.fullName,
            userName: dealerData.userName,
            password: password,
            storeImage: dealerData.storeImage,
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  COD: {
    patch: async (req, res) => {
      try {
        const dealersId = req.body.id;
        const updateCOD = await dealers.updateOne(
          { _id: dealersId },
          { COD: req.body.COD }
        );
        if (updateCOD.modifiedCount > 0) {
          res.status(202).send("COD updated successfully");
        } else {
          res.status(400).send("COD update failed");
        }
      } catch (error) {
        res.status(400).send("Something went wrong");
      }
    },
  },

  onlinePayment: {
    patch: async (req, res) => {
      try {
        const dealersId = req.body.id;
        const updateOnlinePayment = await dealers.updateOne(
          { _id: dealersId },
          { onlinePayment: req.body.onlinePayment }
        );
        if (updateOnlinePayment.modifiedCount > 0) {
          res.status(202).send("Online payment updated successfully");
        } else {
          res.status(400).send("Online payment update failed");
        }
      } catch (error) {
        res.status(400).send("Something went wrong");
      }
    },
  },

  shopClose: {
    patch: async (req, res) => {
      try {
        const data = req.body;
        const closeDealers = await dealers.updateOne(
          { _id: data.dealerId },
          { isOpen: data.data }
        );
        res.status(202).send("success");
      } catch (error) {
        res.status(400).send("Something went wrong");
      }
    },
  },


  orders: {
    get: async (req, res) => {
      try {
        const dealerId = req.body.id;
        const order = await orders.find({
          dealerId: dealerId,
          $or: [
            { orderStatus: "pending" },
            { orderStatus: "confirmed" },
            { orderStatus: "on the way" },
          ],
        });
        res.status(200).json(order);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },

    patch: async (req, res) => {
      try {
        const orderId = req.body.orderId;
        const status = req.body.orderStatus;
        if (status != "delivered") {
          const orderStatus = await orders.updateOne(
            { _id: orderId },
            { $set: { orderStatus: status } }
          );
          res.status(202).send("Accepted");
        }
        if (status == "delivered") {
          const orderStatus = await orders.updateOne(
            { _id: orderId },
            { $set: { orderStatus: status, paymentStatus: true } }
          );
          res.status(202).send("Accepted");
        }
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  orderHistory: {
    get: async (req, res) => {
      try {
        const dealerId = req.body.id;
        const order = await orders.find({
          dealerId: dealerId,
          $or: [{ orderStatus: "delivered" }, { orderStatus: "rejected" }],
        });
        res.status(200).json(order);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
  },

  feedback: {
    get: async (req, res) => {
      try {
        const id = req.body.id;
        const feedback = await orders.find(
          { dealerId: id, feedback: { $exists: true } },
          { feedback: 1 }
        );
        res.status(200).json(feedback);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    delete: async (req, res) => {
      try {
        const dealerId = req.body.id;
        const orderId = req.query.orderId;
        const feedback = await orders.updateOne(
          { _id: orderId, dealerId: dealerId },
          {
            $unset: { feedback: {} },
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },
};
