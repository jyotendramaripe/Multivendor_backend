const Firm= require('../models/Firm');
const Vendor=require("../models/vendor");
const multer=require("multer");
const path = require("path");
//to get images 
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

const addFirm = async(req,res)=>{
 try {
  
  const {firmName,area,category,region,offer}=req.body;
  const image=req.file?req.file.filename:undefined;

  const vendor = await Vendor.findById(req.vendorId);
  if(!vendor){
    res.status(404).json({message:"vendor not found"});
  }
  if(vendor.firm.length >0){
    return res.status(400).json({message:"vendor can have only one firm"});
  }
  const firm = new Firm({
    firmName,
    area,
    category,
    region,
    offer,
    image,
    vendor:vendor._id,
  });

  const savedFirm=await firm.save();
  const firmId=savedFirm._id;
  vendor.firm.push(savedFirm);
  const vendorFirmName=savedFirm.firmName;

  await vendor.save();
  return res.status(200).json({message:"firm added successfully",firmId,vendorFirmName});

 } catch (error) {
  console.log(error);
  res.status(500).json({message:"Internal server Error"});
 }
}


const deleteFirmById= async(req,res)=>{
  try {

    const firmId= req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if(!deletedFirm){
      return res.status(404).json({error:"no firm found"});
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"});
  }
}


module.exports ={addFirm: [upload.single('image'),addFirm],deleteFirmById }
