const mongoose = require('mongoose')

const product_details_schema = new mongoose.Schema({
    "_id" : String,
    "name": String,
    "price":String
})

const customer_details_schema= new mongoose.Schema({
    "name_on_invoice":String,
    "address":String,
})
const invoice_Schema = new mongoose.Schema({
    "order_id":String,
    "customer_id":String,
    "total_cost":String,
    "customer_details": customer_details_schema,
    "product_details" :[product_details_schema],
    "created_at":String
})

module.exports = mongoose.model("invoiceModel",invoice_Schema)