const Product= require("../models/Product");
const Firm= require('../models/Firm');
const multer=require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

const addProduct= async(req,res)=>{
  try {
    const {productName,price,category,bestSeller, description} = req.body;
    const image=req.file?req.file.filename:undefined;

    const firmId= req.params.firmId;
    const firm = await Firm.findById(firmId);

    if(!firm){
      return res.status(404).json({error:"no firm found"});
    }
    const product = new Product({
      productName,price,category,image,bestSeller, description,firm:firm._id
    })

    const savedProduct = await product.save();

    firm.product.push(savedProduct);

    await firm.save();
    return res.status(200).json(savedProduct);

  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"});
  }
}

const getProductByFirm= async(req,res)=>{
  try {

    const firmId= req.params.firmId;
    const firm = await Firm.findById(firmId);

    if(!firm){
      return res.status(404).json({error:"no firm found"});
    }
    const restaurantName= firm.firmName;
    const products = await Product.find({firm:firmId});

    return res.status(200).json({restaurantName,products});

  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"});
  }
}

const deleteProductById= async(req,res)=>{
  try {

    const productId= req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if(!deletedProduct){
      return res.status(404).json({error:"no product found"});
    }
    const firm = await Firm.findById(deletedProduct.firm);
    if (firm) {
      firm.product.pull(productId);
      await firm.save();
    }
    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"});
  }
}

module.exports ={addProduct: [upload.single('image'),addProduct], getProductByFirm ,deleteProductById};