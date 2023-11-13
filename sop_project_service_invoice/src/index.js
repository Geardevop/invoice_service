const express = require('express');
const bodyParser = require("body-parser")
const v1InvoiceRouter = require('./v1/routes/invoiceRouter')
const cors = require('cors')
const mongoose = require("mongoose")
const app = express();
const PORT = process.env.PORT || 5000

const MONGO_URL = "mongodb://127.0.0.1:27017/SOP_Project"
const DB_NAME = "SOP_Project"

mongoose.connect(MONGO_URL, {
    dbName: DB_NAME
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB :' +db.name);
  });

app.use(cors())
app.use(bodyParser.json())
app.use("/api/v1", v1InvoiceRouter)

app.listen(PORT, ()=>{
    console.log("listening on port "+PORT)
})