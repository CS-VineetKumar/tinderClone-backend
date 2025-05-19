const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://devtovineetkumar:lplnHS8MLgMTvFLk@vineet-node.fhu069h.mongodb.net/tinderClone"
  );
};

module.exports = {
  connectDB,
};
