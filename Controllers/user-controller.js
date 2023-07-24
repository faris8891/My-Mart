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
const jwt_key = process.env.JWT_KEY;

module.exports = {
  profile: {
    get: async (req, res) => {
      try {
        const id = req.body.id;
        const userProfile = await users.findOne(
          { _id: id },
          { password: 0, cart: 0 }
        );
        res.status(200).json(userProfile);
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
        console.log(error);
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
      console.log(req.body);
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
        console.log(error);
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
        console.log(jwtData);

        if (data) {
          let options = {
            authorization: FAST_SMS,
            message: `Dear customer, use this OTP ${otp} to log in to your MyMart account. Valid for the next 5 mins.`,
            numbers: [userPhone],
          };

          await fast2sms
            .sendMessage(options)
            .then((response) => {
              const userToken = jwt.sign(jwtData, jwt_key);
              res.cookie("otpLogin", userToken, {
                maxAge: 1000 * 60 * 400,
                httpOnly: true,
              });
              res.status(200).send("OK");
            })
            .catch((error) => {
              console.log(error);
              res.status(404).send("Not Found");
            });
        } else {
          res.status(404).send("User Not Found");
        }
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
    put: async (req, res) => {
      try {
        const otp = req.body.otp;
        const data = req.cookies;
        const expectedData = jwt.verify(data.otpLogin, jwt_key);
        if (otp == expectedData.otp) {
          const user = await users.findOne({ mob: expectedData.mob });
          const userToken = jwt.sign({ id: user._id }, jwt_key);
          res.cookie("userId", userToken, { maxAge: 900000, httpOnly: true });
          res.status(202).send("Accepted");
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        res.status(401).send("Unauthorized user");
      }
    },
  },

  register: {
    post: async (req, res) => {
      try {
        const data = req.body;
        const password = await bcrypt.hash(data.password, saltRounds);
        const newUser = await users.insertMany({
          fullName: data.fullName,
          email: data.email,
          password: password,
          phone: data.phone,
          location: data.location,
          address: data.address,
          flatNo: data.flatNo,
        });
        res.status(201).send("Created");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
  },

  shops: {
    get: async (req, res) => {
      try {
        // console.log(req.body);
        const shops = await dealers.find(
          { active: true },
          { fullName: 1, location: 1 }
        );
        res.status(200).json(shops);
      } catch (error) {
        console.log(error);
      }
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
        };
        res.status(200).json(cart);
      } catch (error) {
        console.log(error);
        res.status(404).send("Not Found");
      }
    },

    post: async (req, res) => {
      try {
        console.log(req.body);
        const dealer = req.body.dealerId;
        const cartProduct = req.body.productId;
        const userId = req.body.id;
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
        // console.log(dealerId, productId, price, quantity);

        const existingCart = await users.find({
          "cart.productId": cartProduct,
        });
        // console.log(existingCart);

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
          // console.log(updatedQuantity);

          const addCart = await users.updateOne(
            {
              _id: userId,
              "cart.productId": cartProduct,
            },
            { $set: { "cart.$.quantity": updatedQuantity } }
          );
          // console.log(addCart, "+++++++++++");
        } else {
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
      } catch (error) {
        console.log(error);
        res.status(400).send("Add cart failed");
      }
    },
    delete: async (req, res) => {
      try {
        const data = req.body;
        console.log(data);
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
      } catch (error) {
        console.log(error);
      }
    },
  },
  paymentVerify: {
    post: (req, res) => {
      console.log(
        req,
        "***************************************************"
      );
      try {
        const data = req.params.orderId;
        const razorpaySignature = req.body.razorpay_signature;
        const razorpayPaymentId = req.body.razorpay_payment_id;
        const orderId = jwt.verify(data, jwt_key).orderId;
        console.log(orderId, "==========");
        const generatedSignature = crypto
          .createHmac("sha256", RZP_KEY)
          .update(orderId + "|" + razorpayPaymentId)
          .digest("hex");
          
          if (generatedSignature === razorpaySignature) {
          console.log(generatedSignature, "--------", razorpaySignature);
          res.status(200).send("OK");
        } else {
          res.status(404).send("Not Found");
        }
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
  },

  checkout: {
    post: async (req, res) => {
      try {
        const userId = req.body.id;
        const dealerId = req.query.dealerId;
        const orderData = req.body;

        const user = await users.findOne({ _id: userId });
        let totalAmount = 0;
        let noOfItems = 0;
        user.cart.forEach((products) => {
          totalAmount = totalAmount + products.price * products.quantity;
          noOfItems = noOfItems + products.quantity;
        });

        console.log(totalAmount, noOfItems);

        const cart = await users.findOne({ _id: userId }, { cart: 1 });
        console.log(cart);

        const order = await orders.insertMany({
          orderId: "My-mart:" + crypto.randomBytes(7).toString("hex"),
          userId: userId,
          dealerId: dealerId,
          orderDate: new Date().toLocaleString(),
          address: user.address,
          quantity: noOfItems,
          totalAmount: totalAmount,
          paymentMode: orderData.paymentMode,
          paymentStatus: orderData.paymentStatus,
          orderStatus: orderData.orderStatus,
          items: user.cart,
        });

        const clearCart = await users.findOneAndUpdate(
          { _id: userId },
          { $set: { cart: [] } }
        );
        res.status(200).send("OK");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
  },

  feedback: {
    patch: async (req, res) => {
      try {
        const orderId = req.query.orderId;
        const data = req.body;
        console.log(data, orderId);
        const feedback = await orders.updateOne(
          { userId: data.id, _id: orderId, orderStatus: "delivered" },
          {
            $set: {
              feedback: { message: data.message, rating: data.rating },
            },
          }
        );
        console.log(feedback);
        res.status(202).send("Accepted");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
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
