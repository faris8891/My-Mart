const usersModel = require("../Models/user");
const cartModel = require("../Models/cart");
const dealers = require("../Models/dealer");
const orders = require("../Models/orders");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const razorpay = require("razorpay");
const fast2sms = require("fast-two-sms");
const AppError = require("../Util/AppError");
const { ErrorHandler } = require("../Util/errorHandling");

require("dotenv").config();

const FAST_SMS = process.env.FAST_SMS;
const RZP_ID = process.env.RZP_ID;
const RZP_KEY = process.env.RZP_KEY;
const jwt_key = process.env.JWT_USER_KEY;

const userController = {
  registerUsers: async (req, res) => {
    const { fullName, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await usersModel.create({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      phone: phone,
    });
    newUser.save();
    res.status(201).json({
      status: "success",
      message: "You have registered successfully",
      data: {
        createdUser: newUser,
      },
    });
  },

  loginUsers: async (req, res) => {
    const { email, password } = req.body;
    const filter = {
      email: email,
      isActive: true,
      isDeleted: false,
    };
    const user = await usersModel.findOne(filter);
    let hash = user.password;

    bcrypt.compare(password, hash, function (err, result) {
      if (result === true && email === user.email) {
        const userToken = jwt.sign({ id: user._id }, jwt_key);
        res.status(200).json({
          status: "success",
          message: "You have logged successfully",
          data: {
            token: userToken,
            user: user,
          },
        });
      } else {
        const appError = new AppError(
          "Login failed",
          "Invalid email or password",
          401
        );
        ErrorHandler(appError, req, res);
      }
    });
  },

  getCart: async (req, res) => {
    const { id } = req.body
    const filter = {userId:id}
    const cart = await cartModel.find(filter).populate("cart.productId")

    res.status(200).json({
      status: " success",
      message: "Successfully fetched cart",
      data: {
        cart: cart,
      },
    });
  },

  addToCart: async (req, res) => {
    const { dealerId, productId, quantity, id } = req.body;

    //If there is no cart for user then will create a new cart
    const findCart = { userId: id };
    const checkExistCart = await cartModel.countDocuments(findCart);
    if (!Boolean(checkExistCart)) {
      const cart = {
        userId: id,
        cart: [],
      };
      const createCart = await cartModel.create(cart);
      createCart.save();
    }

    const filter = { userId: id, "cart.productId": productId };
    const checkExistInCart = await cartModel.countDocuments(filter);

    if (Boolean(checkExistInCart)) {
      const increment = { $inc: { "cart.$.quantity": 1 } };
      const incrementQuantity = await cartModel
        .findOneAndUpdate(filter, increment, { new: true })
        .populate({ path: "cart.productId" })
        .select({ cart: 1 });

      res.status(200).json({
        status: " success",
        message: "Successfully incremented quantity",
        data: {
          cart: incrementQuantity,
        },
      });
    } else {
      const update = {
        $addToSet: {
          cart: {
            dealerId: dealerId,
            productId: productId,
            quantity: quantity,
          },
        },
      };
      const addToCart = await cartModel
        .findOneAndUpdate(findCart, update, { new: true })
        .populate({ path: "cart.productId" })
        .select({ cart: 1 });

      res.status(200).json({
        status: " success",
        message: "Successfully added to cart",
        data: {
          cart: addToCart,
        },
      });
    }

    const appError = new AppError(
      "Failed",
      "Something went wrong! please try again.",
      400
    );
    ErrorHandler(appError, req, res);
  },

  // const filter = { _id: id, "cart.productId": { $ne: productId } };

  // ========================================== OLD =======================================>>
  // otpLogin: {
  //   post: async (req, res) => {
  //     try {
  //       const userPhone = req.body.phone;
  //       const otp = 10000 + Math.floor(Math.random() * 89999);
  //       const data = await users.findOne({ phone: userPhone });
  //       const jwtData = { phone: data.phone, otp: otp };

  //       if (data) {
  //         let options = {
  //           authorization: FAST_SMS,
  //           message: `Dear user, your MyMart OTP is :${otp} Valid for 5 mins.`,
  //           numbers: [userPhone],
  //         };

  //         await fast2sms
  //           .sendMessage(options)
  //           .then((response) => {
  //             const userToken = jwt.sign(jwtData, jwt_key, {
  //               expiresIn: 1000 * 60 * 400,
  //             });
  //             res.status(200).json(userToken);
  //           })
  //           .catch((error) => {
  //             res.status(404).send("Not Found");
  //           });
  //       } else {
  //         res.status(404).send("User Not Found please register");
  //       }
  //     } catch (error) {
  //       res.status(400).send("Something went wrong");
  //     }
  //   },

  //   put: async (req, res) => {
  //     try {
  //       const otp = req.body.otp;
  //       const data = req.body.otpToken;
  //       const expectedData = jwt.verify(data, jwt_key);
  //       if (otp == expectedData.otp) {
  //         const user = await users.findOne({ mob: expectedData.mob });
  //         const userToken = jwt.sign({ id: user._id }, jwt_key, {
  //           expiresIn: "1d",
  //         });
  //         res.status(202).json(userToken);
  //       } else {
  //         res.status(404).send("Not Found");
  //       }
  //     } catch (error) {
  //       res.status(401).send("Unauthorized user");
  //     }
  //   },
  // },

  // payment: {
  //   post: async (req, res) => {
  //     try {
  //       // total amount
  //       const userId = req.body.id;
  //       const user = await users.findOne({ _id: userId });
  //       let totalAmount = 0;
  //       user.cart.forEach((products) => {
  //         totalAmount = totalAmount + products.price * products.quantity;
  //       });
  //       // razorpay
  //       let instance = new razorpay({
  //         key_id: RZP_ID,
  //         key_secret: RZP_KEY,
  //       });
  //       let options = {
  //         amount: `${totalAmount}00`,
  //         currency: "INR",
  //         receipt: "My-mart:" + crypto.randomBytes(7).toString("hex"),
  //       };
  //       instance.orders.create(options, function (err, order) {
  //         const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
  //         const tenMinutesLater = currentTime + 600; // 10 minutes = 600 seconds
  //         const userToken = jwt.sign(
  //           { orderId: order.id, exp: tenMinutesLater },
  //           jwt_key
  //         );
  //         res.status(200).json({
  //           data: order,
  //           orderToken: userToken,
  //         });
  //       });
  //     } catch (error) {}
  //   },
  // },

  // paymentVerify: {
  //   post: async (req, res) => {
  //     try {
  //       const data = req.params.orderId;
  //       const feedback = {
  //         message: "Awaiting feedback",
  //         rating: 0,
  //       };
  //       const razorpaySignature = req.body.razorpay_signature;
  //       const razorpayPaymentId = req.body.razorpay_payment_id;
  //       const orderId = jwt.verify(data, jwt_key).orderId;
  //       const generatedSignature = crypto
  //         .createHmac("sha256", RZP_KEY)
  //         .update(orderId + "|" + razorpayPaymentId)
  //         .digest("hex");

  //       if (generatedSignature === razorpaySignature) {
  //         // creating order ==> online payment

  //         const userId = req.body.id;
  //         const user = await users.findOne({ _id: userId });

  //         let totalAmount = 0;
  //         let noOfItems = 0;
  //         let dealerId = user.cart[0].dealerId;
  //         user.cart.forEach((products) => {
  //           totalAmount = totalAmount + products.price * products.quantity;
  //           noOfItems = noOfItems + products.quantity;
  //         });

  //         const order = await orders.insertMany({
  //           orderId: "My-mart:" + crypto.randomBytes(7).toString("hex"),
  //           userId: userId,
  //           userName: user.fullName,
  //           dealerId: dealerId,
  //           orderDate: new Date().toLocaleString(),
  //           address: user.address,
  //           quantity: noOfItems,
  //           totalAmount: totalAmount,
  //           paymentMode: "online",
  //           paymentStatus: true,
  //           orderStatus: "pending",
  //           items: user.cart,
  //           feedback: feedback,
  //         });
  //         const clearCart = await users.findOneAndUpdate(
  //           { _id: userId },
  //           { $set: { cart: [] } }
  //         );
  //         res.status(200).send("Payment Successful");
  //       } else {
  //         res.status(404).send("Payment Failed");
  //       }
  //     } catch (error) {
  //       res.status(400).send("Something went wrong!");
  //     }
  //   },
  // },
};

module.exports = userController;
