const express = require('express');
const dotenv= require('dotenv');
const mongoose=require('mongoose')
const vendorRoute = require('./routes/vendorRoute')
const firmRoute=require('./routes/firmRoute');
const bodyParser = require('body-parser');
const productRoute = require('./routes/productRoute');
const cors = require('cors');
const path=require('path');

const app = express();
const PORT=process.env.PORT || 4000;

dotenv.config();
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(()=>{console.log("Mongodb connected successfully")})
  .catch((error)=>console.log(error))

app.use(bodyParser.json());
app.use('/vendor', vendorRoute);
app.use('/firm',firmRoute);
app.use('/product',productRoute);
app.use('/uploads',express.static('uploads'));
app.listen(PORT,()=>{
  console.log(`server is running at port ${PORT}`)
});

app.use("/",(req,res)=>{
  res.send("<h1>Welcome to my food store</h1>")
})