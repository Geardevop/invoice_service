const express = require("express");
const router = express.Router();

const invoiceRouter = require("../../controllers/invoiceController")




router.get("/invoice/:orderId", invoiceRouter.getInvoice );

router.post("/invoice", invoiceRouter.createInvoice);


module.exports = router;