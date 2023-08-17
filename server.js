const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/user");
const { gitRouter } = require("./routes/github-auth");
const { googleRouter } = require("./routes/google-auth");
const { authenticate } = require("./middlewares/authenticate");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Route to check if server is working or not");
});

app.use("/user", userRouter);
app.use("/auth/github", gitRouter);
app.use("/auth/google", googleRouter)

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${process.env.PORT}`);
});
