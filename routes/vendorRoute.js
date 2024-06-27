const vendorController = require('../controllers/vendorController');
const express = require('express');
const router = express.Router();

router.post('/register',vendorController.vendorRegister);
router.post('/login',vendorController.vendorLogin);
router.get('/all-vendors',vendorController.getAllVendors);
router.get('/single-vendor/:id',vendorController.getVendorById);//here inplace of id we can use any other name but we should pass the _id in the browser to get the details of that vendor

module.exports= router;