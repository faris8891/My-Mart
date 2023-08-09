const admin = require("../Models/admin");
const users = require("../Models/user");
const dealers = require("../Models/dealer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_ADMIN_KEY;
const saltRounds = 10;

module.exports = {
  apiTest: {
    test: (req, res) => {
      try {
        res.status(200).json({
          message: "api connected",
          data: { sampleData: "this is a test data" },
          status: "success",
        });
      } catch (error) {
        res.status(400).json({
          message: "api connection failed",
          status: "something went wrong",
        });
      }
    },
  },

  login: {
    async post(req, res) {
      try {
        const { userName, password } = req.body;
        const adminData = await admin.findOne({ userName: userName });
        if (password == adminData.password && userName == adminData.userName) {
          const userToken = jwt.sign({ id: adminData._id }, jwt_key, {
            expiresIn: "1d",
          });
          res.status(200).json(userToken);
        } else {
          res
            .status(401)
            .send("You have entered an invalid username or password");
        }
      } catch (error) {
        console.log(error);
        res
          .status(401)
          .send("You have entered an invalid username or password");
      }
    },
  },
  profile: {
    get: async (req, res) => {
      try {
        const id = req.body.id;
        const adminData = await admin.findOne(
          { _id: id },
          { password: 0, _id: 0 }
        );
        res.status(200).json(adminData);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
  },

  Dealer: {
    get: async (req, res) => {
      try {
        const dealersData = await dealers.find({}, { password: 0 });
        res.status(200).json(dealersData);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    post: async (req, res) => {
      try {
        const dealerData = req.body;
        const password = await bcrypt.hash(dealerData.password, saltRounds);
        await dealers.insertMany({
          fullName: dealerData.fullName,
          userName: dealerData.userName,
          password: password,
          storeImage: "sample store image",
          // storeImage: dealerData.storeImage,
          location: dealerData.location,
          address: dealerData.address,
          mobile: dealerData.phone,
          active: false,
          COD: false,
          onlinePayment: false,
          isTopShops: false,
          isOpen: false,
        });
        res.status(201).send("New dealer registered successfully ");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },

    put: async (req, res) => {
      try {
        const id = req.body.dealerId;
        const dealerData = req.body;
        const dealerUpdate = await dealers.updateOne(
          { _id: id },
          {
            $set: {
              fullName: dealerData.fullName,
              userName: dealerData.userName,
              mobile: dealerData.mobile,
              location: dealerData.location,
              address: dealerData.address,
            },
          }
        );
        if (dealerUpdate.modifiedCount > 0) {
          res.status(202).send("Dealer Updated Successfully");
        } else {
          res.status(202).send("Dealer Update Failed");
        }
      } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong");
      }
    },

    patch: async (req, res) => {
      id = req.body.dealerId;
      dealerStatus = req.body.dealerStatus;
      try {
        dealerActive = await dealers.updateOne(
          { _id: id },
          { active: dealerStatus }
        );
        res.status(200).send("Dealer Updated");
      } catch (error) {
        res.status(400).send("Dealer Update failed");
      }
    },

    delete: async (req, res) => {
      try {
        id = req.body.dealerId;
        dealerDelete = await dealers.deleteOne({ _id: id });
        res.status(200).send("Ok");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  topShops: {
    patch: async (req, res) => {
      try {
        const data = req.body;
        const topShops = await dealers.updateOne(
          { _id: data.dealerId },
          { isTopShops: data.isTopShops }
        );
        if (data.isTopShops) {
          res.status(200).send("Added to top shops");
        } else {
          res.status(200).send("Removed from top shops");
        }
      } catch (error) {
        console.log(error);
        res.status(400).send("Something went wrong");
      }
    },
  },

  users: {
    get: async (req, res) => {
      try {
        const user = await users.find({}, { password: 0 });
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(404).send("Not Found");
      }
    },

    post: async (req, res) => {
      try {
        const data = req.body;
        const emailCheck = await users.find({ email: data.email });
        const phoneCheck = await users.find({ phone: data.phone });
        const password = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await users.create({
          fullName: data.fullName,
          email: data.email,
          password: password,
          phone: data.phone,
          location: data.location,
          address: data.address,
          flatNo: data.flatNo,
          // profileImage: data.profileImage,
          profileImage: "test image",
        });
        res.status(201).send("User Created");
      } catch (error) {
        if (error.keyPattern.email) {
          res.status(400).send("Email has already been taken");
        } else if (error.keyPattern.phone) {
          res.status(400).send("Mobile number has already been taken");
        } else res.status(400).send("Something wrong");
      }
    },

    put: async (req, res) => {
      try {
        const data = req.body;
        const id = req.body.userId;
        const userUpdate = await users.updateOne(
          { _id: id },
          {
            $set: {
              fullName: data.fullName,
              email: data.email,
              phone: data.phone,
              location: data.location,
              address: data.address,
              flatNo: data.flatNo,
            },
          }
        );
        res.status(202).send("Success fully updated user");
      } catch (error) {
        res.status(400).send("User update failed");
      }
    },

    patch: async (req, res) => {
      try {
        const status = req.body.userStatus;
        const id = req.body.userId;
        const user = await users.updateOne(
          { _id: id },
          { $set: { active: status } }
        );
        res.status(202).send("User Updated");
      } catch (error) {
        res.status(400).send("Update failed");
      }
    },

    delete: async (req, res) => {
      try {
        const id = req.body.userId;
        const userUpdate = await users.deleteOne({
          _id: id,
        });
        res.status(202).send("User deleted");
        // console.log(res);
      } catch (error) {
        res.status(400).send("User delete failed");
      }
    },
  },

  logout: {
    get: (req, res) => {
      const id = req.body.id;
      const userToken = jwt.sign({ id: id }, jwt_key);
      res.cookie("adminId", userToken, { maxAge: 0, httpOnly: true });
      res.status(200).send("OK");
    },
  },
};
