const users = require("../Models/user");
const dealers = require("../Models/dealer");
const orders = require("../Models/orders");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const razorpay = require("razorpay");
const fast2sms = require("fast-two-sms");

require("dotenv").config();

const FAST_SMS = process.env.FAST_SMS;
const RZP_ID = process.env.RZP_ID;
const RZP_KEY = process.env.RZP_KEY;
const jwt_key = process.env.JWT_USER_KEY;

module.exports = {
  profile: {
    get: async (req, res) => {
      try {
        const id = req.body.id;
        const userProfile = await users.findOne(
          { _id: id },
          { profileImage: 1 }
        );
        const cart = await users.findById({ _id: id }, { cart: 1, _id: 0 });
        userProfile.cartLength = cart.cart.length;
        const profile = {
          profileImage: userProfile.profileImage,
          cartLength: cart.cart.length,
        };
        res.status(200).json(profile);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },

    put: async (req, res) => {
      try {
        const data = req.body;
        const userProfile = await users.updateOne(
          { _id: data.id },
          {
            $set: {
              fullName: data.fullName,
              phone: data.phone,
              location: data.location,
              address: data.address,
              flatNo: data.flatNo,
            },
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },

    delete: async (req, res) => {
      try {
        const id = req.body.id;
        const userProfile = await users.deleteOne({ _id: id });
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  login: {
    post: async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await users.findOne({ email: email });
        let hash = user.password;
        bcrypt.compare(password, hash, function (err, result) {
          if (result == true && email == user.email) {
            const userToken = jwt.sign({ id: user._id }, jwt_key, {
              expiresIn: "1d",
            });
            res.cookie("userId", userToken, { maxAge: 900000, httpOnly: true });
            res.status(200).json(userToken);
          } else {
            res.status(401).send("Invalid email or password");
          }
        });
      } catch (error) {
        res.status(400).send("Something went wrong");
      }
    },
  },

  otpLogin: {
    post: async (req, res) => {
      try {
        const userPhone = req.body.phone;
        const otp = 10000 + Math.floor(Math.random() * 89999);
        const data = await users.findOne({ phone: userPhone });
        const jwtData = { phone: data.phone, otp: otp };

        if (data) {
          let options = {
            authorization: FAST_SMS,
            message: `Dear user, your MyMart OTP is :${otp} Valid for 5 mins.`,
            numbers: [userPhone],
          };

          await fast2sms
            .sendMessage(options)
            .then((response) => {
              const userToken = jwt.sign(jwtData, jwt_key, {
                expiresIn: 1000 * 60 * 400,
              });
              res.status(200).json(userToken);
            })
            .catch((error) => {
              res.status(404).send("Not Found");
            });
        } else {
          res.status(404).send("User Not Found please register");
        }
      } catch (error) {
        res.status(400).send("Something went wrong");
      }
    },

    put: async (req, res) => {
      try {
        const otp = req.body.otp;
        const data = req.body.otpToken;
        const expectedData = jwt.verify(data, jwt_key);
        if (otp == expectedData.otp) {
          const user = await users.findOne({ mob: expectedData.mob });
          const userToken = jwt.sign({ id: user._id }, jwt_key, {
            expiresIn: "1d",
          });
          res.status(202).json(userToken);
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        res.status(401).send("Unauthorized user");
      }
    },
  },

  registerUsers: {
    post: async (req, res) => {
      try {
        const { fullName, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await users.create({
          fullName: fullName,
          email: email,
          password: hashedPassword,
          phone: phone,
          // location: data.location,
          // address: data.address,
          // flatNo: data.flatNo,
          profileImage:
            "https://res.cloudinary.com/dknozjmje/image/upload/v1690616727/MyMartImages/zgsq0drxkymunbbgcufq.webp",
          active: true,
        });
        res.status(201).json({
          status: "success",
          message: "You have registered successfully",
          data: {
            createdUser: newUser,
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
  },

  shops: {
    get: async (req, res) => {
      try {
        const shops = await dealers.find(
          { active: true },
          { fullName: 1, location: 1, created_at: 1, isTopShops: 1, isOpen: 1 }
        );
        res.status(200).json(shops);
      } catch (error) {}
    },
  },

  products: {
    get: async (req, res) => {
      try {
        const dealerId = req.params.dealerId;
        const products = await dealers.find(
          { _id: dealerId, active: true },
          { products: 1 }
        );
        res.status(200).json(products);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
  },

  cart: {
    get: async (req, res) => {
      try {
        const userId = req.body.id;
        const user = await users.findOne({ _id: userId });
        let totalAmount = 0;
        const paymentMode = await dealers.findById(
          { _id: user.selectedShop },
          { COD: 1, onlinePayment: 1, _id: 0 }
        );
        user.cart.forEach((products) => {
          totalAmount = totalAmount + products.price * products.quantity;
        });

        const cart = {
          totalAmount: totalAmount,
          noOfItems: user.cart.length,
          address: user.address,
          defaultImage: user.defaultImage,
          listOfItems: user.cart,
          description: user.description,
          dealerId: user.selectedShop,
          paymentMode: paymentMode,
        };
        res.status(200).json(cart);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },

    post: async (req, res) => {
      try {
        const userId = req.body.id;
        const dealer = req.body.dealerId;
        const cartProduct = req.body.productId;

        const user = await users.findById({ _id: userId });

        if (user.cart.length > 0) {
          if (user.selectedShop != dealer) {
            res
              .status(400)
              .send(
                "You have items from different dealers in your cart. Please place separate orders for each dealer."
              );
          } else {
            const product = await dealers.findOne(
              {
                _id: dealer,
                "products._id": cartProduct,
              },
              { "products.$": true }
            );
            const quantity = req.body.quantity;
            const dealerId = product._id;
            const productId = product.products[0]._id;
            const price = product.products[0].price;
            const defaultImage = product.products[0].defaultImage;
            const productName = product.products[0].productName;
            const description = product.products[0].description;

            const existingCart = await users.find({
              "cart.productId": cartProduct,
            });

            if (existingCart.length > 0) {
              const quantity = await users.findOne(
                {
                  _id: userId,
                  "cart.productId": cartProduct,
                },
                { "cart.quantity.$": true }
              );

              let existingQuantity = quantity.cart[0].quantity;
              let updatedQuantity = ++existingQuantity;

              const addCart = await users.updateOne(
                {
                  _id: userId,
                  "cart.productId": cartProduct,
                },
                { $set: { "cart.$.quantity": updatedQuantity } }
              );
            } else {
              const shop = await users.updateOne(
                { _id: userId },
                { selectedShop: dealer }
              );
              const cart = await users.updateOne(
                { _id: userId },
                {
                  $push: {
                    cart: {
                      productName: productName,
                      dealerId: dealerId,
                      productId: productId,
                      price: price,
                      defaultImage: defaultImage,
                      quantity: quantity,
                      description: description,
                    },
                  },
                }
              );
            }
            res.status(200).send("Successfully added to cart");
          }
        }

        if (user.cart.length == 0) {
          const product = await dealers.findOne(
            {
              _id: dealer,
              "products._id": cartProduct,
            },
            { "products.$": true }
          );
          const quantity = req.body.quantity;
          const dealerId = product._id;
          const productId = product.products[0]._id;
          const price = product.products[0].price;
          const defaultImage = product.products[0].defaultImage;
          const productName = product.products[0].productName;
          const description = product.products[0].description;

          const existingCart = await users.find({
            "cart.productId": cartProduct,
          });

          if (existingCart.length > 0) {
            const quantity = await users.findOne(
              {
                _id: userId,
                "cart.productId": cartProduct,
              },
              { "cart.quantity.$": true }
            );

            let existingQuantity = quantity.cart[0].quantity;
            let updatedQuantity = ++existingQuantity;

            const addCart = await users.updateOne(
              {
                _id: userId,
                "cart.productId": cartProduct,
              },
              { $set: { "cart.$.quantity": updatedQuantity } }
            );
          } else {
            const shop = await users.updateOne(
              { _id: userId },
              { selectedShop: dealer }
            );
            const cart = await users.updateOne(
              { _id: userId },
              {
                $push: {
                  cart: {
                    productName: productName,
                    dealerId: dealerId,
                    productId: productId,
                    price: price,
                    defaultImage: defaultImage,
                    quantity: quantity,
                    description: description,
                  },
                },
              }
            );
          }
          res.status(200).send("Successfully added to cart");
        }
      } catch (error) {
        res.status(400).send("Add cart failed");
      }
    },
    delete: async (req, res) => {
      try {
        const data = req.body;
        const productId = data.productId;
        const product = await users.findOneAndUpdate(
          { _id: data.id },
          {
            $pull: {
              cart: {
                productId: productId,
              },
            },
          }
        );
        res.status(202).send("Successfully removed from cart");
      } catch (error) {
        res.status(400).send("Add product failed");
      }
    },
  },
  payment: {
    post: async (req, res) => {
      try {
        // total amount
        const userId = req.body.id;
        const user = await users.findOne({ _id: userId });
        let totalAmount = 0;
        user.cart.forEach((products) => {
          totalAmount = totalAmount + products.price * products.quantity;
        });
        // razorpay
        let instance = new razorpay({
          key_id: RZP_ID,
          key_secret: RZP_KEY,
        });
        let options = {
          amount: `${totalAmount}00`,
          currency: "INR",
          receipt: "My-mart:" + crypto.randomBytes(7).toString("hex"),
        };
        instance.orders.create(options, function (err, order) {
          const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
          const tenMinutesLater = currentTime + 600; // 10 minutes = 600 seconds
          const userToken = jwt.sign(
            { orderId: order.id, exp: tenMinutesLater },
            jwt_key
          );
          res.status(200).json({
            data: order,
            orderToken: userToken,
          });
        });
      } catch (error) {}
    },
  },

  paymentVerify: {
    post: async (req, res) => {
      try {
        const data = req.params.orderId;
        const feedback = {
          message: "Awaiting feedback",
          rating: 0,
        };
        const razorpaySignature = req.body.razorpay_signature;
        const razorpayPaymentId = req.body.razorpay_payment_id;
        const orderId = jwt.verify(data, jwt_key).orderId;
        const generatedSignature = crypto
          .createHmac("sha256", RZP_KEY)
          .update(orderId + "|" + razorpayPaymentId)
          .digest("hex");

        if (generatedSignature === razorpaySignature) {
          // creating order ==> online payment

          const userId = req.body.id;
          const user = await users.findOne({ _id: userId });

          let totalAmount = 0;
          let noOfItems = 0;
          let dealerId = user.cart[0].dealerId;
          user.cart.forEach((products) => {
            totalAmount = totalAmount + products.price * products.quantity;
            noOfItems = noOfItems + products.quantity;
          });

          const order = await orders.insertMany({
            orderId: "My-mart:" + crypto.randomBytes(7).toString("hex"),
            userId: userId,
            userName: user.fullName,
            dealerId: dealerId,
            orderDate: new Date().toLocaleString(),
            address: user.address,
            quantity: noOfItems,
            totalAmount: totalAmount,
            paymentMode: "online",
            paymentStatus: true,
            orderStatus: "pending",
            items: user.cart,
            feedback: feedback,
          });
          const clearCart = await users.findOneAndUpdate(
            { _id: userId },
            { $set: { cart: [] } }
          );
          res.status(200).send("Payment Successful");
        } else {
          res.status(404).send("Payment Failed");
        }
      } catch (error) {
        res.status(400).send("Something went wrong!");
      }
    },
  },

  checkout: {
    post: async (req, res) => {
      try {
        const feedback = {
          message: "Awaiting feedback",
          rating: 0,
        };
        const userId = req.body.id;
        const user = await users.findOne({ _id: userId });

        let totalAmount = 0;
        let noOfItems = 0;
        let dealerId = user.cart[0].dealerId;
        user.cart.forEach((products) => {
          totalAmount = totalAmount + products.price * products.quantity;
          noOfItems = noOfItems + products.quantity;
        });

        const order = await orders.insertMany({
          orderId: "My-mart:" + crypto.randomBytes(7).toString("hex"),
          userId: userId,
          userName: user.fullName,
          dealerId: dealerId,
          orderDate: new Date().toLocaleString(),
          address: user.address,
          quantity: noOfItems,
          totalAmount: totalAmount,
          paymentMode: "online",
          paymentStatus: false,
          orderStatus: "pending",
          items: user.cart,
          feedback: feedback,
        });
        const clearCart = await users.findOneAndUpdate(
          { _id: userId },
          { $set: { cart: [] } }
        );
        res.status(200).send("Payment Successful");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  feedback: {
    post: async (req, res) => {
      try {
        const data = req.body;
        const orderId = data.orderId;
        const feedback = await orders.updateOne(
          { userId: data.id, _id: orderId, orderStatus: "delivered" },
          {
            $set: {
              feedback: { message: data.feedback, rating: data.rating },
            },
          }
        );
        if (feedback.modifiedCount > 0) {
          res.status(202).send("Successfully updated feedback");
        } else {
          res.status(400).send("Feedback update failed");
        }
      } catch (error) {
        res.status(400).send("Something went wrong");
      }
    },
  },

  orderHistory: {
    get: async (req, res) => {
      try {
        const userId = req.body.id;
        const orderHistory = await orders.find({ userId: userId });
        res.status(200).json(orderHistory);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
  },

  logout: {
    get: (req, res) => {
      try {
        const data = req.body;
        const userToken = jwt.sign({ id: data.id }, jwt_key);
        res.cookie("userId", userToken, { maxAge: 0, httpOnly: true });
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },
};
