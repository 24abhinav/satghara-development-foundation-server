const express = require("express");
require('dotenv').config();
const bodyParser = require('body-parser');
var cors = require('cors');
const { addContact } = require("./Controller/Contact");
const app = express();
 
let PORT = process.env.PORT || 5000;
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
 
app.post("/contact", addContact);
 
app.listen(PORT, function (error) {
    if (error) throw error;
    console.log("Server created Successfully on PORT", PORT);
});
