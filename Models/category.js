const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    color: {
      type: String,
    },

    // tag: {
    //   type:mongoose.Schema.Types.ObjectId
    // },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
    //   required: true,
    // },
    // updatedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
    //   required: true,
    // },

    isDeleted: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
