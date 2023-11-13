const invoiceService = require("../services/invoiceService")
const InvoiceModel = require("../model/invoiceSchema")
const PDFDocument = require('pdfkit')
const createDoc = require('../doc/doc')
const fs = require('fs')
const date = new Date()
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${day}-${month}-${year}`;

const getInvoice = (req, res) =>{
    const orderId = req.params['orderId']
    const invoice = invoiceService.getInvoice(orderId).then(savedInvoice =>{
        res.setHeader('content-type', 'application/pdf');
        res.setHeader('Content-disposition', 'attachment;filename=invoice.pdf');
        createDoc.createDoc(savedInvoice,
            (chuck)=>res.write(chuck),
            ()=>res.end())
        
    }).catch((error)=>{
        console.error('Error creating invoice:', error);
        res.status(500).send('Error creating invoice');
    })
}


const createInvoice = (req, res) =>{
    console.log('REQUEST TO CREATE INVOICE !!')
    const {
        customer_id,
        total_cost,
        customer_details,
        product_details,
        order_id
    } = req.body
    if ( !order_id || !customer_id || !total_cost || !customer_details || !product_details) {
        return res.status(400).send('ฮั่นแหน่ ส่ง request.body มาไม่หมดนะไอสาส');
    }
    const invoiceModel = {
        "order_id" : order_id,
        "customer_id": customer_id,
        "total_cost": total_cost,
        "customer_details": customer_details,
        "product_details": product_details,
        "created_at": currentDate
    }

    invoiceService.createInvoice(invoiceModel)
    .then((savedInvoice) => {
        res.setHeader('content-type', 'application/pdf');
        res.setHeader('Content-disposition', 'attachment;filename=invoice.pdf');
        createDoc.createDoc(savedInvoice,
            (chuck)=>res.write(chuck),
            ()=>res.end())
    })
    .catch((error) => {
        console.error('Error creating invoice:', error);
        res.status(500).send('Error creating invoice');
    });
}

module.exports = {
    createInvoice,  
    getInvoice
}