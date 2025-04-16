const connectToMongo = require("./db");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const fetchUser = require("./middleware/fetchUser");

connectToMongo();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
const port = 5500;
app.use(express.json());

app.use("/api/authStudent", require("./routes/authStudent"));
app.use("/api/authFaculty", require("./routes/authFaculty"));
app.use("/api/authAdministrator", require("./routes/authAdministrator"));
app.use("/api/send-mail", require("./routes/email"));
app.use("/api", require("./routes/email"));
app.use("/api/file", require("./routes/file"));

app.listen(port, () => {
  console.log(`Tracker app listening on port ${port}`);
});
