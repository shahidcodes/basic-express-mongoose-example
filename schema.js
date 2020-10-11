const mongoose = require("mongoose");

const { Schema } = mongoose;

const user = new Schema({
  username: String,
  password: String,
});

const meeting = new Schema(
  {
    title: String,
    date: Date,
    organiser: String,
    attendies: [String],
    createdBy: Schema.Types.ObjectId,
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model("user", user),
  Meeting: mongoose.model("meeting", meeting),
};
