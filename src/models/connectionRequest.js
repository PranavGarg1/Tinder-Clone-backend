const mongooose = require("mongoose");

const requestSchema = new mongoose.Schema({
  fromUserId: { type: String, required: true },
  toUserId: { type: String, required: true },
  status: { type: String, required: true },
});

module.exorts = monngoose.model("ConnectionRequest, requestSchema");
