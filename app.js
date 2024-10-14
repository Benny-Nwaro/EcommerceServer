const express = require("express");
const app = express();
const cors = require("cors")
const connectDb = require("./config/db");
const morgan = require('morgan');
const PORT = process.env.PORT || 8080;
const callBack = () => {
  console.log(`Server listening on port ${PORT}`);
};
console.log("connecting to database")
connectDb();

app.use(cors())

app.use(express.json({ extended: false }));
app.use("/api/users", require("./routes/userApi"));
app.use("/api/products", require("./routes/productsAPI"));
app.use("/api/auth", require("./routes/authApi"));
app.use("/api/profile", require("./routes/profileApi"));
app.use("/api/cart", require("./routes/cartApi"));
app.use("/api/payment", require("./routes/paymentApi"));
app.use(morgan('dev'));



// app.get('/', (req, res)=>{
//     res.send("Requesting Homepage").status(200);
// })
// app.get("/test", (req, res)=>{
//     res.json({"msg":"We are touching it"})
// })
app.listen(PORT, callBack);