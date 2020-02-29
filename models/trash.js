const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trashSchema = new Schema(
  {
    type: { type: String, default: "Feature", required: true },
    geometry: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], required: true }
    },
    properties: {
      name: { type: String },
      address: { type: String }
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.updatedAt;
        delete ret.createdAt;
        return ret;
      }
    }
  }
);

const Trash = mongoose.model("trash", trashSchema);
module.exports = Trash;
