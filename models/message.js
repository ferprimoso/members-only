const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now, required: true },
});


MessageSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_SHORT);
});


// Export model
module.exports = mongoose.model("Message", MessageSchema);