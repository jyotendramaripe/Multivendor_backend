const Vendor=require("../models/vendor");
const jwt= require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const dotenv= require('dotenv');
dotenv.config();

const secretKey=process.env.SECRET_KEY;

const vendorRegister= async(req,res)=>{
    const {username,email,password} =req.body;
  try {
    const vendorEmail = await Vendor.findOne({email});
    if(vendorEmail){
      return res.status(400).json("Email already exits")
    }
    const hashedPassword= await bcrypt.hash(password,10);

    const newVendor= new Vendor({
      username,
      email,
      password:hashedPassword,
    });
    await newVendor.save();
    res.status(201).json({msg:"Vendor registered succesfully"});
    console.log('registered');
    
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
}

const vendorLogin= async(req,res)=>{
  const {email,password} =req.body;
  try {
    const vendor = await Vendor.findOne({email});
    if(!vendor || !(await bcrypt.compare(password,vendor.password))){
      return res.status(401).json({error:"Invalid Username or Password"})
    }
    const vendorId=vendor._id;
    const token= jwt.sign({vendorId: vendor._id}, secretKey,{expiresIn:'1h'});
    // console.log(token);
    res.status(200).json({success:"Login Successfull",token,vendorId,vendor});
    console.log("this is token",token);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
}

const getAllVendors = async(req,res)=>{
  try {
    const vendors= await Vendor.find().populate('firm');
    res.json({vendors});
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
}

const getVendorById = async(req,res)=>{
  const vendorId= req.params.id;
  try {
    const vendor=await Vendor.findById(vendorId).populate('firm');//populate('firm') shows the firm content otherwise only referene will be shown
    if(!vendor){
      return res.status(404).json({error:"Vendor not found"});
    }
    const vendorFirmId=vendor.firm[0]._id;
    res.status(200).json({vendor,vendorFirmId});
    console.log(vendorFirmId);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
}



module.exports={vendorRegister,vendorLogin,getAllVendors,getVendorById};