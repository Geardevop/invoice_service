const {MongoClient} = require('mongodb')
const invoiceModel = require("../model/invoiceSchema")
const mongoose = require('mongoose')

const getInvoice = async (orderId) =>{
    const order = await invoiceModel.findOne({"order_id":orderId}).exec()
    return order
}
const createInvoice = async (Invoice) =>{
    const order = await invoiceModel.findOne({"order_id":Invoice.order_id}).exec()
    if(order){
       return order
    }else{
        const invoice = new invoiceModel({
            order_id :Invoice.order_id,
            customer_id : Invoice.customer_id,
            total_cost : Invoice.total_cost,
            customer_details : Invoice.customer_details,
            product_details : Invoice.product_details,
            created_at : Invoice.created_at,
        })
        return invoice.save()
    }
}

module.exports={
    getInvoice,
    createInvoice
}