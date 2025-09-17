const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://pranavGarg:pranshu%4092@cluster1.mnx8ruk.mongodb.net/tinderClone"
  );
};
module.exports = connectDb;
