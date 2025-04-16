const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/tracker";

async function connectToMongo() {
  await mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to Mongo Successfully"))
    .catch((err) => console.log(err));
}

module.exports = connectToMongo;
