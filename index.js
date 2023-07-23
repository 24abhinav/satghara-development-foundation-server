const express = require("express");
require('dotenv').config();
const path = require('path')
const bodyParser = require('body-parser');
var cors = require('cors');
const { addContact, getContact, deleteContact, changeContactStatus } = require("./Controller/Contact");
const { getPageMeta } = require("./Controller/General");
const { addDonation, getDonation, deleteDonation, updateDonation } = require("./Controller/Donation");
const { addAdminUser, getAdminUser, deleteAdminUser, changeAdminUser, setAdminPassword, adminSignIn, resetPassword } = require("./Controller/AdminUser");
const app = express();
require('./Database/db');
 
let PORT = process.env.PORT || 5000;
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ exposedHeaders: 'X-Session-Token' }));

app.use('/static', express.static(path.join(__dirname, 'public')));
 
app.post("/contact", addContact);
app.get("/admin/contact", getContact);
app.delete("/admin/contact", deleteContact);
app.patch("/admin/contact", changeContactStatus);


app.get('/donation', getDonation);
app.post('/admin/donation', addDonation);
app.delete('/admin/donation', deleteDonation);
app.patch('/admin/donation', updateDonation);


app.post('/admin/user', addAdminUser);
app.get('/admin/user', getAdminUser);
app.delete('/admin/user', deleteAdminUser);
app.patch('/admin/user', changeAdminUser);
app.patch('/admin/set-password', setAdminPassword);
app.post('/admin/sign-in', adminSignIn);
app.post('/admin/reset-password', resetPassword);

app.get("/page-meta", getPageMeta);
 
app.listen(PORT, function (error) {
    if (error) throw error;
    console.log("Server created Successfully on PORT", PORT);
});

app.on('error', err => {
    console.log('app error', err);
});
