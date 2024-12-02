const express = require("express");
const cors = require("cors");
const generativeRouter = require("./router/router");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api", generativeRouter);
app.use("/checking", (req, res)=>{
  res.send(`<h1> Its working fine! </h1>`)
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
