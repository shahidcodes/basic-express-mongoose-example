const express = require("express");
const mongoose = require("mongoose");
const { User, Meeting } = require("./schema");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./authMiddleware");
const constants = require("./constants");

const hash = (pass) => {
  const handler = crypto.createHash("md5");
  handler.update(pass);
  return handler.digest("hex");
};

mongoose
  .connect(
    "mongodb://mongoadmin:atxmiroxt5%23..@15.206.227.255:27017/test_kazim?authSource=admin",
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("database connected"))
  .catch((err) => console.error(err));

const app = express();

app.use(express.json());

app.post("/login", async (req, res, next) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user || !user.password === hash(req.body.password)) {
    return res.json({ error: true, message: "Invalid username or password" });
  }

  const jwtToken = jwt.sign(user.toObject(), constants.jwtSecret);
  res.json({
    token: jwtToken,
    user,
  });
});

app.post("/signup", async (req, res, next) => {
  const password = hash(req.body.password);
  const user = await User.create({
    username: req.body.username,
    password,
  });

  const jwtToken = jwt.sign(user.toObject(), constants.jwtSecret);
  res.json({
    token: jwtToken,
    user,
  });
});

app
  .use(authMiddleware)
  .route("/meetings")
  .get(async (req, res, next) => {
    const user = req.user;
    const meeting = await Meeting.create({
      ...req.body,
      createdBy: user._id,
    });
    res.json(meeting);
  })
  .put(async (req, res, next) => {
    const { _id } = req.body;
    const data = req.body;
    delete data._id;
    const meeting = await Meeting.findOneAndUpdate(
      {
        _id,
      },
      data,
      { new: true }
    );
    res.json(meeting);
  })
  .post(async (req, res, next) => {
    const data = req.body;
    const meeting = await Meeting.create(data);
    res.json(meeting);
  });

app.use((err, req, res, next) => {
  const message = err.message;
  res.json({ error: true, message });
});
app.listen(3000, () => console.log("server started"));
